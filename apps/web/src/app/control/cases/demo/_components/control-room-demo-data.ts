export const readinessItems = [
  {
    label: "Context",
    status: "Unclear",
    tone: "review",
    detail: "Context boundary requires human review before evidence handling.",
  },
  {
    label: "Consent",
    status: "Pending",
    tone: "blocked",
    detail: "No active authorization for external transfer.",
  },
  {
    label: "Privacy",
    status: "Review required",
    tone: "legal",
    detail: "Sensitive/legal signals detected in the case intake.",
  },
  {
    label: "Evidence",
    status: "Scoped",
    tone: "ok",
    detail: "18 candidate items in scope, 7 marked out of scope.",
  },
  {
    label: "Transfer",
    status: "Blocked",
    tone: "blocked",
    detail: "Controlled transfer package cannot be generated yet.",
  },
  {
    label: "Audit",
    status: "Healthy",
    tone: "ok",
    detail: "Assurance trail is recording operational events.",
  },
] as const;

export const allowedActions = [
  "Add review note",
  "Run readiness check",
  "Classify scope",
  "Request legal/privacy review",
  "Export internal summary",
] as const;

export const blockedActions = [
  {
    action: "Generate transfer package",
    reason: "Missing active authorization record.",
    unlock: "Register consent and close scope matrix.",
  },
  {
    action: "Legal derivation",
    reason: "Case requires human review before derivation.",
    unlock: "Resolve privacy boundary and review requirement.",
  },
  {
    action: "Mark evidence-ready",
    reason: "Context boundary is still unclear.",
    unlock: "Complete context classification.",
  },
] as const;

export const timeline = [
  {
    time: "23:40",
    type: "CASE_FILE_CREATED",
    result: "Governed case file initialized.",
  },
  {
    time: "23:42",
    type: "GOVERNANCE_DECISION_RECORDED",
    result: "Guardian decision generated with blocked transfer actions.",
  },
  {
    time: "23:44",
    type: "CONTROL_GATE_BLOCKED",
    result: "Transfer package gate blocked: consent missing.",
  },
  {
    time: "23:46",
    type: "PRIVACY_REVIEW_REQUIRED",
    result: "Sensitive/legal indicators require review.",
  },
] as const;

export const notes = [
  {
    author: "System",
    scope: "privacy",
    text: "Privacy baseline exists, but DPO/legal validation remains pending before formal compliance claims.",
  },
  {
    author: "Reviewer",
    scope: "context",
    text: "Do not treat intake material as evidence-ready until context boundary is resolved.",
  },
] as const;
