import type { GovernedCaseFile } from "./types";

export const governedCaseFileFixture: GovernedCaseFile = {
  id: "case_demo_001",
  caseRef: "EV-2026-DEMO",
  title: "Governed Case File",
  createdAt: "2026-06-15T00:00:00.000Z",
  updatedAt: "2026-06-15T00:00:00.000Z",

  readinessState: "under_review",
  contextBoundaryState: "unclear",
  sensitivity: "legal_sensitive",

  scopeMatrix: [
    {
      key: "context",
      label: "Context boundary",
      state: "unclear",
      rationale:
        "Context boundary requires human review before evidence handling.",
    },
    {
      key: "evidence",
      label: "Evidence scope",
      state: "scoped",
      rationale:
        "Candidate evidence has been scoped but is not transfer-ready.",
    },
  ],

  reviewNotes: [
    {
      id: "note_privacy_001",
      author: "System",
      scope: "privacy",
      text: "Privacy baseline exists, but review remains required before formal transfer readiness.",
      createdAt: "2026-06-15T00:01:00.000Z",
    },
  ],

  assuranceTrail: [
    {
      id: "event_case_created_001",
      occurredAt: "2026-06-15T00:00:00.000Z",
      type: "CASE_FILE_CREATED",
      summary: "Governed case file initialized.",
    },
    {
      id: "event_gate_blocked_001",
      occurredAt: "2026-06-15T00:02:00.000Z",
      type: "CONTROL_GATE_BLOCKED",
      summary: "Transfer gate blocked because authorization is missing.",
    },
  ],

  governanceSummary: {
    decisionRef: "guardian_demo_001",
    status: "blocked",
    allowedActions: [
      "persist_intake",
      "classify_context",
      "record_audit_event",
      "request_review",
    ],
    blockedActions: [
      {
        gate: "external_transfer",
        status: "blocked",
        reason: "Missing active authorization record.",
        unlock: "Register consent and close scope matrix.",
      },
    ],
  },

  privacyBoundary: {
    status: "review_required",
    rationale: "Sensitive/legal indicators require review.",
  },

  transferReadiness: {
    status: "not_ready",
    rationale: "Transfer package cannot be generated while consent is missing.",
  },
};
