import { describe, it, expect } from "vitest";
import {
  decideIntake,
  decideIntakeV2,
  decideIntakeWithExplanation,
  isDecisionModelV2,
  DECISION_MODEL_VERSION,
  DECISION_MODEL_VERSION_V2,
  INTAKE_ROUTE_BY_TONE,
} from "../decision";
import type { WizardResult } from "../wizard-result";

/** Helper: minimal wizard result */
function baseWizard(overrides: Partial<WizardResult> = {}): WizardResult {
  return {
    urgency: "informational",
    clientProfile: "private_individual",
    hasEmotionalDistress: false,
    incident: "test incident",
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: "test",
    ...overrides,
  };
}

describe("Decision Engine — V1 (decideIntake)", () => {
  it("should return low priority for minimal informational case", () => {
    const result = decideIntake(baseWizard());
    expect(result.priority).toBe("low");
    expect(result.actionCode).toBe("DEFERRED_INFORMATIONAL_RESPONSE");
    expect(result.decisionModelVersion).toBe(DECISION_MODEL_VERSION);
  });

  it("should route to /contact/basic by default", () => {
    const result = decideIntake(baseWizard());
    expect(result.route).toBe(INTAKE_ROUTE_BY_TONE.basic);
  });

  it("should route to /contact/critical for urgency=critical", () => {
    const result = decideIntake(baseWizard({ urgency: "critical" }));
    expect(result.route).toBe(INTAKE_ROUTE_BY_TONE.critical);
    // urgency=critical scores 6 → high (≥5), needs more flags to reach critical (≥8)
    expect(result.priority).toBe("high");
    expect(result.actionCode).toBe("PRIORITY_REVIEW_24_48H");
  });

  it("should reach critical with urgency=critical + emotional distress", () => {
    const result = decideIntake(
      baseWizard({ urgency: "critical", hasEmotionalDistress: true }),
    );
    // score: 6 (critical) + 2 (distress) = 8 → critical
    expect(result.priority).toBe("critical");
    expect(result.actionCode).toBe("IMMEDIATE_HUMAN_CONTACT");
  });

  it("should route to /contact/family for family conflict profile", () => {
    const result = decideIntake(
      baseWizard({ clientProfile: "family_inheritance_conflict" }),
    );
    expect(result.route).toBe(INTAKE_ROUTE_BY_TONE.family);
    expect(result.flags).toContain("family_conflict");
  });

  it("should route to /contact/legal for legal_professional", () => {
    const result = decideIntake(
      baseWizard({ clientProfile: "legal_professional" }),
    );
    expect(result.route).toBe(INTAKE_ROUTE_BY_TONE.legal);
    expect(result.flags).toContain("legal_professional");
  });

  it("should route to /contact/legal for court_related", () => {
    const result = decideIntake(baseWizard({ clientProfile: "court_related" }));
    expect(result.route).toBe(INTAKE_ROUTE_BY_TONE.legal);
    expect(result.flags).toContain("active_procedure");
  });

  it("should add emotional_distress flag and increase score", () => {
    const result = decideIntake(baseWizard({ hasEmotionalDistress: true }));
    expect(result.flags).toContain("emotional_distress");
  });

  it("should score medium for time_sensitive urgency + emotional distress", () => {
    const result = decideIntake(
      baseWizard({ urgency: "time_sensitive", hasEmotionalDistress: true }),
    );
    // score: 2 (time_sensitive) + 2 (distress) = 4 → medium (≥3)
    expect(result.priority).toBe("medium");
    expect(result.actionCode).toBe("STANDARD_REVIEW");
  });

  it("should score high for legal_risk urgency + emotional distress", () => {
    const result = decideIntake(
      baseWizard({ urgency: "legal_risk", hasEmotionalDistress: true }),
    );
    // score: 4 (legal_risk) + 2 (distress) = 6 → high (≥5)
    expect(result.priority).toBe("high");
    expect(result.actionCode).toBe("PRIORITY_REVIEW_24_48H");
  });

  it("should score critical for physical safety risk", () => {
    const result = decideIntake(
      baseWizard({
        urgency: "time_sensitive",
        physicalSafetyRisk: true,
        hasEmotionalDistress: true,
      }),
    );
    // score: 2 (time_sensitive) + 5 (physical) + 2 (distress) = 9 → critical (≥8)
    expect(result.priority).toBe("critical");
  });

  it("should flag financial risk", () => {
    const result = decideIntake(baseWizard({ financialAssetRisk: true }));
    expect(result.flags).toContain("financial_risk");
  });

  it("should flag access compromised", () => {
    const result = decideIntake(baseWizard({ attackerHasPasswords: true }));
    expect(result.flags).toContain("access_compromised");
  });

  it("should flag evidence volatility", () => {
    const result = decideIntake(baseWizard({ evidenceIsAutoDeleted: true }));
    expect(result.flags).toContain("evidence_volatility");
  });

  it("should produce frozen (immutable) decisions", () => {
    const result = decideIntake(baseWizard());
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.flags)).toBe(true);
  });
});

describe("Decision Engine — V2 (decideIntakeV2)", () => {
  it("should return V2 model version", () => {
    const result = decideIntakeV2(baseWizard());
    expect(result.decisionModelVersion).toBe(DECISION_MODEL_VERSION_V2);
  });

  it("should be identical to V1 baseline when no signal inputs", () => {
    const v1 = decideIntake(baseWizard());
    const v2 = decideIntakeV2(baseWizard());
    expect(v2.priority).toBe(v1.priority);
    expect(v2.route).toBe(v1.route);
    expect(v2.actionCode).toBe(v1.actionCode);
  });

  it("should escalate to high when exposure is active (isOngoing)", () => {
    const result = decideIntakeV2(
      baseWizard({
        isOngoing: true,
        incident: "test",
        actionsTaken: ["report"],
        evidenceSources: [],
        objective: "test",
      }),
    );
    expect(["high", "critical"]).toContain(result.priority);
  });

  it("should escalate to critical for high data sensitivity + high risk", () => {
    const result = decideIntakeV2(
      baseWizard({
        urgency: "legal_risk",
        dataSensitivityLevel: "high",
        incident: "test",
        actionsTaken: [],
        evidenceSources: [],
        objective: "test",
      }),
    );
    expect(result.priority).toBe("critical");
    expect(result.actionCode).toBe("IMMEDIATE_HUMAN_CONTACT");
  });

  it("should escalate to medium for no device access + messages_only + low baseline", () => {
    const result = decideIntakeV2(
      baseWizard({
        hasAccessToDevices: false,
        incident: "test",
        actionsTaken: [],
        evidenceSources: ["whatsapp messages"],
        objective: "test",
      }),
    );
    expect(["medium", "high", "critical"]).toContain(result.priority);
  });

  it("should escalate to critical for physicalSafetyRisk", () => {
    const result = decideIntakeV2(
      baseWizard({
        physicalSafetyRisk: true,
        incident: "test",
        actionsTaken: [],
        evidenceSources: [],
        objective: "test",
      }),
    );
    expect(result.priority).toBe("critical");
  });

  it("should escalate for financialAssetRisk", () => {
    const result = decideIntakeV2(
      baseWizard({
        financialAssetRisk: true,
        incident: "test",
        actionsTaken: [],
        evidenceSources: [],
        objective: "test",
      }),
    );
    expect(["high", "critical"]).toContain(result.priority);
  });

  it("should escalate for attackerHasPasswords", () => {
    const result = decideIntakeV2(
      baseWizard({
        attackerHasPasswords: true,
        incident: "test",
        actionsTaken: [],
        evidenceSources: [],
        objective: "test",
      }),
    );
    expect(["high", "critical"]).toContain(result.priority);
  });

  it("should be frozen", () => {
    const result = decideIntakeV2(baseWizard());
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe("isDecisionModelV2", () => {
  it("should return true for V2 decisions", () => {
    const decision = decideIntakeV2(baseWizard());
    expect(isDecisionModelV2(decision)).toBe(true);
  });

  it("should return false for V1 decisions", () => {
    const decision = decideIntake(baseWizard());
    expect(isDecisionModelV2(decision)).toBe(false);
  });
});

describe("decideIntakeWithExplanation", () => {
  it("should return decision + explanation for V1", () => {
    const { decision, explanation } = decideIntakeWithExplanation(
      baseWizard(),
      false,
    );
    expect(decision).toBeDefined();
    expect(explanation).toBeDefined();
    expect(explanation.modelVersion).toBe(DECISION_MODEL_VERSION);
    expect(explanation.reasons).toBeInstanceOf(Array);
    expect(explanation.baselinePriority).toBe("low");
    expect(explanation.finalPriority).toBe("low");
  });

  it("should return frozen explanation", () => {
    const { explanation } = decideIntakeWithExplanation(baseWizard(), false);
    expect(Object.isFrozen(explanation)).toBe(true);
    expect(Object.isFrozen(explanation.reasons)).toBe(true);
  });

  it("should include urgency_based_routing reason for critical urgency", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ urgency: "critical" }),
      false,
    );
    expect(explanation.reasons).toContain("urgency_based_routing");
  });

  it("should include client_profile_routing for family conflict", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "family_inheritance_conflict" }),
      false,
    );
    expect(explanation.reasons).toContain("client_profile_routing");
  });

  it("should include client_profile_routing for legal_professional", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "legal_professional" }),
      false,
    );
    expect(explanation.reasons).toContain("client_profile_routing");
  });

  it("should include client_profile_routing for court_related", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "court_related" }),
      false,
    );
    expect(explanation.reasons).toContain("client_profile_routing");
  });

  it("should include family_conflict_flag for family profile", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "family_inheritance_conflict" }),
      false,
    );
    expect(explanation.reasons).toContain("family_conflict_flag");
  });

  it("should include legal_professional_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "legal_professional" }),
      false,
    );
    expect(explanation.reasons).toContain("legal_professional_flag");
  });

  it("should include active_procedure_flag for court_related", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ clientProfile: "court_related" }),
      false,
    );
    expect(explanation.reasons).toContain("active_procedure_flag");
  });

  it("should include emotional_distress_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ hasEmotionalDistress: true }),
      false,
    );
    expect(explanation.reasons).toContain("emotional_distress_flag");
  });

  it("should include physical_safety_risk_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ physicalSafetyRisk: true }),
      false,
    );
    expect(explanation.reasons).toContain("physical_safety_risk_flag");
  });

  it("should include financial_risk_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ financialAssetRisk: true }),
      false,
    );
    expect(explanation.reasons).toContain("financial_risk_flag");
  });

  it("should include access_compromised_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ attackerHasPasswords: true }),
      false,
    );
    expect(explanation.reasons).toContain("access_compromised_flag");
  });

  it("should include evidence_volatility_flag", () => {
    const { explanation } = decideIntakeWithExplanation(
      baseWizard({ evidenceIsAutoDeleted: true }),
      false,
    );
    expect(explanation.reasons).toContain("evidence_volatility_flag");
  });

  describe("V2 explanation", () => {
    it("should use V2 model version", () => {
      const { explanation } = decideIntakeWithExplanation(baseWizard(), true);
      expect(explanation.modelVersion).toBe(DECISION_MODEL_VERSION_V2);
    });

    it("should include ongoing_incident_escalation for active exposure", () => {
      const { explanation } = decideIntakeWithExplanation(
        baseWizard({
          isOngoing: true,
          incident: "test",
          actionsTaken: ["report"],
          evidenceSources: [],
          objective: "test",
        }),
        true,
      );
      expect(explanation.reasons).toContain("ongoing_incident_escalation");
    });

    it("should include data_sensitivity_escalation for high sensitivity + high risk", () => {
      const { explanation } = decideIntakeWithExplanation(
        baseWizard({
          urgency: "legal_risk",
          dataSensitivityLevel: "high",
          incident: "test",
          actionsTaken: [],
          evidenceSources: [],
          objective: "test",
        }),
        true,
      );
      expect(explanation.reasons).toContain("data_sensitivity_escalation");
    });

    it("should include device_access_constraint when no device access", () => {
      const { explanation } = decideIntakeWithExplanation(
        baseWizard({
          hasAccessToDevices: false,
          incident: "test",
          actionsTaken: [],
          evidenceSources: ["whatsapp chat"],
          objective: "test",
        }),
        true,
      );
      expect(explanation.reasons).toContain("device_access_constraint");
    });

    it("should include long_duration_exposure_hint for weeks/months", () => {
      const { explanation: explanationWeeks } = decideIntakeWithExplanation(
        baseWizard({
          estimatedIncidentStart: "weeks",
          incident: "test",
          actionsTaken: [],
          evidenceSources: [],
          objective: "test",
        }),
        true,
      );
      expect(explanationWeeks.reasons).toContain("long_duration_exposure_hint");

      const { explanation: explanationMonths } = decideIntakeWithExplanation(
        baseWizard({
          estimatedIncidentStart: "months",
          incident: "test",
          actionsTaken: [],
          evidenceSources: [],
          objective: "test",
        }),
        true,
      );
      expect(explanationMonths.reasons).toContain(
        "long_duration_exposure_hint",
      );
    });
  });
});
