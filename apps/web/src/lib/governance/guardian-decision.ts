export type GuardianDecisionValue = "allow" | "block" | "require_human_review";

export type GuardianAction =
  | "persist_intake"
  | "notify_team"
  | "preclassify_intake"
  | "request_human_review"
  | "evidence_handling"
  | "device_inspection"
  | "legal_derivation"
  | "authenticity_claim"
  | "automated_escalation"
  | "third_party_attribution";

export type GuardianRiskLevel = "low" | "medium" | "high";

export type GuardianDecision = {
  requestId: string;
  schemaVersion: "0.1";
  decision: GuardianDecisionValue;
  allowedActions: GuardianAction[];
  blockedActions: GuardianAction[];
  requiresHumanReview: boolean;
  riskLevel: GuardianRiskLevel;
  policyBundleVersion: string;
  reasonCodes: string[];
  createdAt: string;
};

const SENSITIVE_ACTIONS: ReadonlySet<GuardianAction> = new Set([
  "evidence_handling",
  "device_inspection",
  "legal_derivation",
  "authenticity_claim",
  "automated_escalation",
  "third_party_attribution",
]);

export function isSensitiveGuardianAction(action: GuardianAction): boolean {
  return SENSITIVE_ACTIONS.has(action);
}

export function isGuardianActionAllowed(
  decision: GuardianDecision,
  action: GuardianAction,
): boolean {
  if (decision.decision === "block") {
    return false;
  }

  if (decision.blockedActions.includes(action)) {
    return false;
  }

  if (
    decision.decision === "require_human_review" &&
    isSensitiveGuardianAction(action)
  ) {
    return false;
  }

  return decision.allowedActions.includes(action);
}
