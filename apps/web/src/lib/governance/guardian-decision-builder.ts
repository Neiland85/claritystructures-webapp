import type {
  GuardianAction,
  GuardianDecision,
  GuardianRiskLevel,
} from "@/lib/governance/guardian-decision";

export type GuardianInput = {
  requestId: string;
  schemaVersion: "0.1";
  riskLevel: GuardianRiskLevel;
  requiresHumanReview: boolean;
  allowsAutomatedPreclassification: boolean;
  allowsEvidenceHandling: boolean;
  policyBundleVersion: string;
};

const SENSITIVE_GUARDIAN_ACTIONS: GuardianAction[] = [
  "evidence_handling",
  "device_inspection",
  "legal_derivation",
  "authenticity_claim",
  "automated_escalation",
  "third_party_attribution",
];

export function buildGuardianDecision(
  input: GuardianInput,
  createdAt = new Date().toISOString(),
): GuardianDecision {
  const requiresHumanReview =
    input.requiresHumanReview || input.riskLevel === "high";

  const allowedActions: GuardianAction[] = ["persist_intake", "notify_team"];

  if (requiresHumanReview) {
    allowedActions.push("request_human_review");
  }

  if (
    input.allowsAutomatedPreclassification &&
    !requiresHumanReview &&
    input.riskLevel === "low"
  ) {
    allowedActions.push("preclassify_intake");
  }

  const blockedActions = buildBlockedActions(input, requiresHumanReview);

  return {
    requestId: input.requestId,
    schemaVersion: input.schemaVersion,
    decision: requiresHumanReview ? "require_human_review" : "allow",
    allowedActions,
    blockedActions,
    requiresHumanReview,
    riskLevel: input.riskLevel,
    policyBundleVersion: input.policyBundleVersion,
    reasonCodes: buildReasonCodes(input, requiresHumanReview),
    createdAt,
  };
}

function buildBlockedActions(
  input: GuardianInput,
  requiresHumanReview: boolean,
): GuardianAction[] {
  const blocked = new Set<GuardianAction>(SENSITIVE_GUARDIAN_ACTIONS);

  if (!input.allowsAutomatedPreclassification || requiresHumanReview) {
    blocked.add("preclassify_intake");
  }

  return [...blocked];
}

function buildReasonCodes(
  input: GuardianInput,
  requiresHumanReview: boolean,
): string[] {
  const reasonCodes = new Set<string>();

  reasonCodes.add("sensitive_actions_blocked_by_default");

  if (requiresHumanReview) {
    reasonCodes.add("requires_human_review");
  }

  if (input.riskLevel === "high") {
    reasonCodes.add("risk_high");
  }

  if (!input.allowsAutomatedPreclassification) {
    reasonCodes.add("automated_preclassification_disabled");
  }

  if (!input.allowsEvidenceHandling) {
    reasonCodes.add("evidence_handling_disabled");
  }

  return [...reasonCodes];
}
