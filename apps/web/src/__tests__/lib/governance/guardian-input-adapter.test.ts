import { describe, expect, it } from "vitest";

import type { WizardResult } from "@claritystructures/domain";
import { buildGuardianDecision } from "@/lib/governance/guardian-decision-builder";
import { createGuardianInputFromEnvelope } from "@/lib/governance/guardian-input-adapter";
import { createIntakeGovernanceEnvelope } from "@/lib/governance/wizard-result-to-governance-envelope";

const baseWizardResult: WizardResult = {
  clientProfile: "legal_professional",
  urgency: "informational",
  incident: "Client intake for digital evidence governance.",
  devices: 1,
  actionsTaken: ["initial_contact"],
  evidenceSources: ["email"],
  objective: "preserve_traceability",
};

describe("guardian input adapter", () => {
  it("creates GuardianInput from IntakeGovernanceEnvelope", () => {
    const envelope = createIntakeGovernanceEnvelope({
      wizardResult: baseWizardResult,
      requestId: "req-001",
      consentVersion: "v1",
      policyBundleVersion: "wizard-guardian-policy/v0",
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    const input = createGuardianInputFromEnvelope(envelope);

    expect(input).toEqual({
      requestId: "req-001",
      schemaVersion: "0.1",
      riskLevel: "low",
      requiresHumanReview: false,
      allowsAutomatedPreclassification: true,
      allowsEvidenceHandling: true,
      policyBundleVersion: "wizard-guardian-policy/v0",
    });
  });

  it("preserves high-risk fail-closed governance signals", () => {
    const envelope = createIntakeGovernanceEnvelope({
      wizardResult: {
        ...baseWizardResult,
        urgency: "critical",
        physicalSafetyRisk: true,
      },
      requestId: "req-high-risk",
      consentVersion: "v1",
      policyBundleVersion: "wizard-guardian-policy/v0",
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    const input = createGuardianInputFromEnvelope(envelope);

    expect(input.riskLevel).toBe("high");
    expect(input.requiresHumanReview).toBe(true);
    expect(input.allowsAutomatedPreclassification).toBe(false);
    expect(input.allowsEvidenceHandling).toBe(false);
  });

  it("feeds the GuardianDecision builder without granting sensitive action", () => {
    const envelope = createIntakeGovernanceEnvelope({
      wizardResult: baseWizardResult,
      requestId: "req-builder",
      consentVersion: "v1",
      policyBundleVersion: "wizard-guardian-policy/v0",
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    const input = createGuardianInputFromEnvelope(envelope);
    const decision = buildGuardianDecision(input, "2026-06-12T00:00:00.000Z");

    expect(decision.requestId).toBe("req-builder");
    expect(decision.decision).toBe("allow");
    expect(decision.allowedActions).toContain("persist_intake");
    expect(decision.allowedActions).toContain("notify_team");
    expect(decision.blockedActions).toContain("evidence_handling");
    expect(decision.blockedActions).toContain("legal_derivation");
    expect(decision.blockedActions).toContain("authenticity_claim");
  });
});
