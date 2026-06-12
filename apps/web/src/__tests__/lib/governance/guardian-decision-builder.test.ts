import { describe, expect, it } from "vitest";

import {
  buildGuardianDecision,
  type GuardianInput,
} from "@/lib/governance/guardian-decision-builder";
import { isGuardianActionAllowed } from "@/lib/governance/guardian-decision";

const baseInput: GuardianInput = {
  requestId: "req-001",
  schemaVersion: "0.1",
  riskLevel: "low",
  requiresHumanReview: false,
  allowsAutomatedPreclassification: true,
  allowsEvidenceHandling: true,
  policyBundleVersion: "guardian-policy/v0",
};

describe("guardian decision builder", () => {
  it("allows narrow low-risk intake actions", () => {
    const decision = buildGuardianDecision(
      baseInput,
      "2026-06-12T00:00:00.000Z",
    );

    expect(decision.decision).toBe("allow");
    expect(decision.requiresHumanReview).toBe(false);
    expect(isGuardianActionAllowed(decision, "persist_intake")).toBe(true);
    expect(isGuardianActionAllowed(decision, "notify_team")).toBe(true);
    expect(isGuardianActionAllowed(decision, "preclassify_intake")).toBe(true);
  });

  it("blocks sensitive actions by default even when evidence handling is present", () => {
    const decision = buildGuardianDecision(baseInput);

    expect(isGuardianActionAllowed(decision, "evidence_handling")).toBe(false);
    expect(isGuardianActionAllowed(decision, "device_inspection")).toBe(false);
    expect(isGuardianActionAllowed(decision, "legal_derivation")).toBe(false);
    expect(isGuardianActionAllowed(decision, "authenticity_claim")).toBe(false);
    expect(isGuardianActionAllowed(decision, "third_party_attribution")).toBe(
      false,
    );
  });

  it("requires human review for high-risk input", () => {
    const decision = buildGuardianDecision({
      ...baseInput,
      riskLevel: "high",
      requiresHumanReview: false,
    });

    expect(decision.decision).toBe("require_human_review");
    expect(decision.requiresHumanReview).toBe(true);
    expect(isGuardianActionAllowed(decision, "request_human_review")).toBe(
      true,
    );
    expect(isGuardianActionAllowed(decision, "preclassify_intake")).toBe(false);
    expect(decision.reasonCodes).toContain("risk_high");
  });

  it("disables preclassification when automation is not allowed", () => {
    const decision = buildGuardianDecision({
      ...baseInput,
      allowsAutomatedPreclassification: false,
    });

    expect(isGuardianActionAllowed(decision, "preclassify_intake")).toBe(false);
    expect(decision.reasonCodes).toContain(
      "automated_preclassification_disabled",
    );
  });

  it("preserves traceability metadata", () => {
    const decision = buildGuardianDecision(
      baseInput,
      "2026-06-12T00:00:00.000Z",
    );

    expect(decision.requestId).toBe("req-001");
    expect(decision.schemaVersion).toBe("0.1");
    expect(decision.policyBundleVersion).toBe("guardian-policy/v0");
    expect(decision.createdAt).toBe("2026-06-12T00:00:00.000Z");
  });
});
