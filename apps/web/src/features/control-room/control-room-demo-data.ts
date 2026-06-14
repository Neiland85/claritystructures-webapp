import type { ControlRoomViewModel } from "./control-room-view-model";

export const controlRoomDemoViewModel: ControlRoomViewModel = {
  caseRef: "EV-2026-DEMO",
  title: "Governed Case File",
  subtitle:
    "Operational surface for a sensitive case context. This mock route visualizes readiness, blocked actions, governance decision, privacy boundary, transfer state and assurance trail.",

  status: [
    {
      label: "Readiness",
      value: "Under review",
      tone: "review",
    },
    {
      label: "Sensitivity",
      value: "Legal / sensitive",
      tone: "legal",
    },
  ],

  readiness: [
    {
      label: "Context",
      status: "Unclear",
      tone: "review",
      detail:
        "Context boundary requires human review before evidence handling.",
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
  ],

  governanceDecision: {
    eyebrow: "Governance decision",
    title: "Transfer and legal derivation are blocked",
    summary:
      "The system can persist, classify, audit and request review. It cannot generate an external transfer package while consent is missing and the context boundary remains unclear.",
    allowed: [
      "persist_intake",
      "classify_context",
      "record_audit_event",
      "request_review",
    ],
    blocked: [
      "evidence_handling",
      "legal_derivation",
      "external_transfer",
      "transfer_packet_generation",
    ],
  },

  allowedActions: [
    "Add review note",
    "Run readiness check",
    "Classify scope",
    "Request legal/privacy review",
    "Export internal summary",
  ],

  blockedActions: [
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
  ],

  assuranceTrail: [
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
  ],

  privacyBoundary: {
    title: "Privacy boundary",
    text: "Privacy baseline exists, but this case requires review before any claim of transfer readiness or legal derivation.",
  },

  reviewNotes: [
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
  ],
};
