import { describe, expect, it } from "vitest";

import type { GuardianDecision } from "@/lib/governance/guardian-decision";
import {
  isGuardianActionAllowed,
  isSensitiveGuardianAction,
} from "@/lib/governance/guardian-decision";

const baseDecision: GuardianDecision = {
  requestId: "req-001",
  schemaVersion: "0.1",
  decision: "allow",
  allowedActions: ["persist_intake", "notify_team"],
  blockedActions: [],
  requiresHumanReview: false,
  riskLevel: "low",
  policyBundleVersion: "guardian-policy/v0",
  reasonCodes: [],
  createdAt: "2026-06-12T00:00:00.000Z",
};

describe("guardian decision", () => {
  it("allows only explicitly listed actions", () => {
    expect(isGuardianActionAllowed(baseDecision, "persist_intake")).toBe(true);
    expect(isGuardianActionAllowed(baseDecision, "notify_team")).toBe(true);
    expect(isGuardianActionAllowed(baseDecision, "preclassify_intake")).toBe(
      false,
    );
  });

  it("lets blocked actions win over allowed actions", () => {
    const decision: GuardianDecision = {
      ...baseDecision,
      allowedActions: ["persist_intake", "evidence_handling"],
      blockedActions: ["evidence_handling"],
    };

    expect(isGuardianActionAllowed(decision, "evidence_handling")).toBe(false);
  });

  it("blocks every action when decision is block", () => {
    const decision: GuardianDecision = {
      ...baseDecision,
      decision: "block",
      allowedActions: ["persist_intake", "notify_team"],
    };

    expect(isGuardianActionAllowed(decision, "persist_intake")).toBe(false);
    expect(isGuardianActionAllowed(decision, "notify_team")).toBe(false);
  });

  it("blocks sensitive actions during human review", () => {
    const decision: GuardianDecision = {
      ...baseDecision,
      decision: "require_human_review",
      requiresHumanReview: true,
      allowedActions: ["persist_intake", "evidence_handling"],
      blockedActions: [],
      riskLevel: "high",
    };

    expect(isGuardianActionAllowed(decision, "persist_intake")).toBe(true);
    expect(isGuardianActionAllowed(decision, "evidence_handling")).toBe(false);
  });

  it("classifies sensitive guardian actions", () => {
    expect(isSensitiveGuardianAction("evidence_handling")).toBe(true);
    expect(isSensitiveGuardianAction("device_inspection")).toBe(true);
    expect(isSensitiveGuardianAction("legal_derivation")).toBe(true);
    expect(isSensitiveGuardianAction("persist_intake")).toBe(false);
    expect(isSensitiveGuardianAction("notify_team")).toBe(false);
  });
});
