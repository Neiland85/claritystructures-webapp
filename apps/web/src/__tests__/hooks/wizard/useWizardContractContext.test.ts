import { describe, expect, it } from "vitest";

import { deriveWizardContractContext } from "@/hooks/wizard/useWizardContractContext";

describe("useWizardContractContext derivation", () => {
  it("derives canonical answers and legal signals from UI state", () => {
    const context = deriveWizardContractContext({
      clientProfile: "legal_professional",
      urgency: "legal_risk",
      objective: "legal_derivation",
    });

    expect(context.answers).toEqual({
      clientProfile: "legal_professional",
      urgency: "legal_risk",
      objective: "legal_derivation",
    });

    expect(context.signals).toContain("routing.legal_professional");
    expect(context.signals).toContain("risk.legal");
    expect(context.signals).toContain("legal.derivation_candidate");
    expect(context.hasLegalDerivationSignal).toBe(true);
  });

  it("derives evidence volatility snippets when volatility signal exists", () => {
    const context = deriveWizardContractContext({
      urgency: "time_sensitive",
      evidenceIsAutoDeleted: true,
    });

    expect(context.signals).toContain("risk.evidence_volatility");
    expect(context.hasEvidenceVolatilitySignal).toBe(true);

    expect(context.snippets.map((item) => item.snippet.id)).toContain(
      "snippet.evidence.do_not_modify_originals",
    );
  });

  it("derives credential compromise snippets when credential signal exists", () => {
    const context = deriveWizardContractContext({
      attackerHasPasswords: true,
    });

    expect(context.signals).toContain("risk.credential_compromise");
    expect(context.hasCredentialCompromiseSignal).toBe(true);

    expect(context.snippets.map((item) => item.snippet.id)).toContain(
      "snippet.credentials.rotate_access",
    );
  });

  it("derives sensitive privacy flag from high data sensitivity", () => {
    const context = deriveWizardContractContext({
      dataSensitivityLevel: "high",
    });

    expect(context.signals).toContain("privacy.high_sensitivity");
    expect(context.hasSensitivePrivacySignal).toBe(true);
  });

  it("does not treat explicit false risk answers as active risk signals", () => {
    const context = deriveWizardContractContext({
      physicalSafetyRisk: false,
      financialAssetRisk: false,
      attackerHasPasswords: false,
      evidenceIsAutoDeleted: false,
    });

    expect(context.answers).toEqual({
      physicalSafetyRisk: false,
      financialAssetRisk: false,
      attackerHasPasswords: false,
      evidenceIsAutoDeleted: false,
    });

    expect(context.hasPhysicalSafetySignal).toBe(false);
    expect(context.hasCredentialCompromiseSignal).toBe(false);
    expect(context.hasEvidenceVolatilitySignal).toBe(false);

    expect(context.signals).not.toContain("risk.physical_safety");
    expect(context.signals).not.toContain("risk.financial_asset");
    expect(context.signals).not.toContain("risk.credential_compromise");
    expect(context.signals).not.toContain("risk.evidence_volatility");
  });

  it("returns empty derived context for empty UI state", () => {
    const context = deriveWizardContractContext({});

    expect(context.answers).toEqual({});
    expect(context.signals).toEqual([]);
    expect(context.snippets).toEqual([]);
    expect(context.hasCriticalSignal).toBe(false);
    expect(context.hasLegalDerivationSignal).toBe(false);
    expect(context.hasSensitivePrivacySignal).toBe(false);
  });
});
