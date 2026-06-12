import { describe, expect, it } from "vitest";
import type { WizardResult } from "@claritystructures/domain";
import { createIntakeGovernanceEnvelope } from "@/lib/governance/wizard-result-to-governance-envelope";

function baseWizard(overrides: Partial<WizardResult> = {}): WizardResult {
  return {
    clientProfile: "private_individual",
    urgency: "informational",
    incident: "Device shows suspicious behaviour.",
    devices: 1,
    actionsTaken: [],
    evidenceSources: ["screenshots"],
    objective: "Understand risk before taking action.",
    ...overrides,
  };
}

describe("createIntakeGovernanceEnvelope", () => {
  it("creates a deterministic low-risk governance envelope", () => {
    const wizardResult = baseWizard();

    const envelope = createIntakeGovernanceEnvelope({
      wizardResult,
      requestId: "req-001",
      consentVersion: "consent-v1",
      policyBundleVersion: "policy-v1",
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    expect(envelope.schemaVersion).toBe("0.1");
    expect(envelope.source).toBe("clarity-webapp");
    expect(envelope.requestId).toBe("req-001");
    expect(envelope.wizardResult).toBe(wizardResult);
    expect(envelope.governanceContext.riskLevel).toBe("low");
    expect(envelope.governanceContext.requiresHumanReview).toBe(false);
    expect(envelope.governanceContext.allowsEvidenceHandling).toBe(true);
    expect(envelope.integrity.wizardResultHash).toMatch(/^djb2:/);
  });

  it("fails into high risk for critical safety signals", () => {
    const wizardResult = baseWizard({
      urgency: "critical",
      physicalSafetyRisk: true,
    });

    const envelope = createIntakeGovernanceEnvelope({
      wizardResult,
      requestId: "req-002",
      consentVersion: "consent-v1",
      policyBundleVersion: "policy-v1",
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    expect(envelope.governanceContext.riskLevel).toBe("high");
    expect(envelope.governanceContext.requiresHumanReview).toBe(true);
    expect(envelope.governanceContext.allowsAutomatedPreclassification).toBe(
      false,
    );
    expect(envelope.governanceContext.allowsEvidenceHandling).toBe(false);
  });
});
