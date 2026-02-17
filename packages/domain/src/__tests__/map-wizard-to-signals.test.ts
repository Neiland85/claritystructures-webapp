import { describe, it, expect } from "vitest";
import { mapWizardToSignals } from "../map-wizard-to-signals";
import type { WizardResult } from "../wizard-result";

/** Helper: full wizard result */
function baseWizard(overrides: Partial<WizardResult> = {}): WizardResult {
  return {
    urgency: "informational",
    clientProfile: "private_individual",
    hasEmotionalDistress: false,
    incident: "test incident",
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: "test objective",
    ...overrides,
  };
}

describe("mapWizardToSignals", () => {
  describe("incidentType derivation", () => {
    it("should map private_individual to private_case", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.incidentType).toBe("private_case");
    });

    it("should map family_inheritance_conflict to family_dispute", () => {
      const signals = mapWizardToSignals(
        baseWizard({ clientProfile: "family_inheritance_conflict" }),
      );
      expect(signals.incidentType).toBe("family_dispute");
    });

    it("should map legal_professional to legal_professional_case", () => {
      const signals = mapWizardToSignals(
        baseWizard({ clientProfile: "legal_professional" }),
      );
      expect(signals.incidentType).toBe("legal_professional_case");
    });

    it("should map court_related to court_proceeding", () => {
      const signals = mapWizardToSignals(
        baseWizard({ clientProfile: "court_related" }),
      );
      expect(signals.incidentType).toBe("court_proceeding");
    });

    it("should map 'other' to unknown", () => {
      const signals = mapWizardToSignals(
        baseWizard({ clientProfile: "other" }),
      );
      expect(signals.incidentType).toBe("unknown");
    });
  });

  describe("riskLevel derivation", () => {
    it("should be low for informational", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.riskLevel).toBe("low");
    });

    it("should be medium for time_sensitive", () => {
      const signals = mapWizardToSignals(
        baseWizard({ urgency: "time_sensitive" }),
      );
      expect(signals.riskLevel).toBe("medium");
    });

    it("should be high for legal_risk", () => {
      const signals = mapWizardToSignals(baseWizard({ urgency: "legal_risk" }));
      expect(signals.riskLevel).toBe("high");
    });

    it("should be imminent for critical", () => {
      const signals = mapWizardToSignals(baseWizard({ urgency: "critical" }));
      expect(signals.riskLevel).toBe("imminent");
    });

    it("should refine low to high when dataSensitivityLevel is high", () => {
      const signals = mapWizardToSignals(
        baseWizard({ dataSensitivityLevel: "high" }),
      );
      expect(signals.riskLevel).toBe("high");
    });

    it("should refine medium to high when dataSensitivityLevel is high", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          urgency: "time_sensitive",
          dataSensitivityLevel: "high",
        }),
      );
      expect(signals.riskLevel).toBe("high");
    });

    it("should NOT refine already high risk", () => {
      const signals = mapWizardToSignals(
        baseWizard({ urgency: "legal_risk", dataSensitivityLevel: "high" }),
      );
      expect(signals.riskLevel).toBe("high");
    });
  });

  describe("evidenceLevel derivation", () => {
    it("should be none for no sources and no devices", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.evidenceLevel).toBe("none");
    });

    it("should be full_device for devices > 0 and no sources", () => {
      const signals = mapWizardToSignals(baseWizard({ devices: 2 }));
      expect(signals.evidenceLevel).toBe("full_device");
    });

    it("should be full_device for device-related sources", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceSources: ["phone", "laptop"] }),
      );
      expect(signals.evidenceLevel).toBe("full_device");
    });

    it("should be screenshots for screenshot-only sources", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceSources: ["screenshot"] }),
      );
      expect(signals.evidenceLevel).toBe("screenshots");
    });

    it("should be messages_only for message-only sources", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceSources: ["whatsapp chat"] }),
      );
      expect(signals.evidenceLevel).toBe("messages_only");
    });

    it("should be mixed for both screenshot and message sources", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceSources: ["screenshot", "email messages"] }),
      );
      expect(signals.evidenceLevel).toBe("mixed");
    });

    it("should be full_device for device + messages", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceSources: ["phone", "whatsapp"] }),
      );
      expect(signals.evidenceLevel).toBe("full_device");
    });

    it("should refine to messages_only when hasAccessToDevices=false", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          hasAccessToDevices: false,
          evidenceSources: ["phone"],
        }),
      );
      expect(signals.evidenceLevel).toBe("messages_only");
    });

    it("should NOT override none when hasAccessToDevices=false", () => {
      // none stays none (refineEvidenceLevel checks evidenceLevel !== "none")
      const signals = mapWizardToSignals(
        baseWizard({ hasAccessToDevices: false }),
      );
      expect(signals.evidenceLevel).toBe("none");
    });
  });

  describe("exposureState derivation", () => {
    it("should be unknown by default", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.exposureState).toBe("unknown");
    });

    it("should be contained for secured/blocked actions", () => {
      const signals = mapWizardToSignals(
        baseWizard({ actionsTaken: ["secured the device"] }),
      );
      expect(signals.exposureState).toBe("contained");
    });

    it("should be contained for objective containing prevent", () => {
      const signals = mapWizardToSignals(
        baseWizard({ objective: "prevent further access" }),
      );
      expect(signals.exposureState).toBe("contained");
    });

    it("should be potential for monitoring actions", () => {
      const signals = mapWizardToSignals(
        baseWizard({ actionsTaken: ["monitor activity"] }),
      );
      expect(signals.exposureState).toBe("potential");
    });

    it("should be active for report actions", () => {
      const signals = mapWizardToSignals(
        baseWizard({ actionsTaken: ["report to authority"] }),
      );
      expect(signals.exposureState).toBe("active");
    });

    it("should refine to active when isOngoing=true", () => {
      const signals = mapWizardToSignals(baseWizard({ isOngoing: true }));
      expect(signals.exposureState).toBe("active");
    });

    it("should refine unknown to potential for weeks/months estimated start", () => {
      const signalsWeeks = mapWizardToSignals(
        baseWizard({ estimatedIncidentStart: "weeks" }),
      );
      expect(signalsWeeks.exposureState).toBe("potential");

      const signalsMonths = mapWizardToSignals(
        baseWizard({ estimatedIncidentStart: "months" }),
      );
      expect(signalsMonths.exposureState).toBe("potential");
    });

    it("should NOT override non-unknown state with estimated start", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          actionsTaken: ["secured everything"],
          estimatedIncidentStart: "months",
        }),
      );
      expect(signals.exposureState).toBe("contained");
    });
  });

  describe("sensitivityFlags derivation", () => {
    it("should return empty flags for minimal case", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.sensitivityFlags).toEqual([]);
    });

    it("should include emotional_distress", () => {
      const signals = mapWizardToSignals(
        baseWizard({ hasEmotionalDistress: true }),
      );
      expect(signals.sensitivityFlags).toContain("emotional_distress");
    });

    it("should include physical_risk", () => {
      const signals = mapWizardToSignals(
        baseWizard({ physicalSafetyRisk: true }),
      );
      expect(signals.sensitivityFlags).toContain("physical_risk");
    });

    it("should include financial_risk", () => {
      const signals = mapWizardToSignals(
        baseWizard({ financialAssetRisk: true }),
      );
      expect(signals.sensitivityFlags).toContain("financial_risk");
    });

    it("should include access_compromised", () => {
      const signals = mapWizardToSignals(
        baseWizard({ attackerHasPasswords: true }),
      );
      expect(signals.sensitivityFlags).toContain("access_compromised");
    });

    it("should include evidence_volatility", () => {
      const signals = mapWizardToSignals(
        baseWizard({ evidenceIsAutoDeleted: true }),
      );
      expect(signals.sensitivityFlags).toContain("evidence_volatility");
    });

    it("should include cognitive_distortion for cognitive profile", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          cognitiveProfile: {
            coherenceScore: 3,
            cognitiveDistortion: true,
            perceivedOmnipotenceOfAttacker: false,
            isInformationVerifiable: true,
            emotionalShockLevel: "low",
          },
        }),
      );
      expect(signals.sensitivityFlags).toContain("cognitive_distortion");
    });

    it("should include cognitive_distortion for perceived omnipotence", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          cognitiveProfile: {
            coherenceScore: 3,
            cognitiveDistortion: false,
            perceivedOmnipotenceOfAttacker: true,
            isInformationVerifiable: true,
            emotionalShockLevel: "low",
          },
        }),
      );
      expect(signals.sensitivityFlags).toContain("cognitive_distortion");
    });

    it("should include severe_shock for high emotional shock level", () => {
      const signals = mapWizardToSignals(
        baseWizard({
          cognitiveProfile: {
            coherenceScore: 3,
            cognitiveDistortion: false,
            perceivedOmnipotenceOfAttacker: false,
            isInformationVerifiable: true,
            emotionalShockLevel: "high",
          },
        }),
      );
      expect(signals.sensitivityFlags).toContain("severe_shock");
    });
  });

  describe("pass-through fields", () => {
    it("should include devicesCount", () => {
      const signals = mapWizardToSignals(baseWizard({ devices: 3 }));
      expect(signals.devicesCount).toBe(3);
    });

    it("should include thirdPartiesInvolved", () => {
      const signals = mapWizardToSignals(
        baseWizard({ thirdPartiesInvolved: true }),
      );
      expect(signals.thirdPartiesInvolved).toBe(true);
    });

    it("should default thirdPartiesInvolved to false", () => {
      const signals = mapWizardToSignals(baseWizard());
      expect(signals.thirdPartiesInvolved).toBe(false);
    });
  });
});
