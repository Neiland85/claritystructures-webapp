export type ReadinessState =
  | "draft"
  | "under_review"
  | "blocked"
  | "ready"
  | "closed";

export type ContextBoundaryState =
  | "unclear"
  | "scoped"
  | "out_of_scope"
  | "approved";

export type SensitivityLevel = "standard" | "sensitive" | "legal_sensitive";

export type ControlGateStatus = "allowed" | "blocked" | "review_required";

export type ScopeMatrixItem = {
  key: string;
  label: string;
  state: ContextBoundaryState;
  rationale: string;
};

export type ReviewNote = {
  id: string;
  author: string;
  scope: string;
  text: string;
  createdAt: string;
};

export type AssuranceEvent = {
  id: string;
  occurredAt: string;
  type: string;
  summary: string;
};

export type ControlGateDecision = {
  gate: string;
  status: ControlGateStatus;
  reason: string;
  unlock?: string;
};

export type GovernanceSummary = {
  decisionRef: string;
  status: ControlGateStatus;
  allowedActions: string[];
  blockedActions: ControlGateDecision[];
};

export type PrivacyBoundary = {
  status: "clear" | "review_required" | "blocked";
  rationale: string;
};

export type TransferReadiness = {
  status: "not_ready" | "review_required" | "ready";
  rationale: string;
};

export type GovernedCaseFile = {
  id: string;
  caseRef: string;
  title: string;
  createdAt: string;
  updatedAt: string;

  readinessState: ReadinessState;
  contextBoundaryState: ContextBoundaryState;
  sensitivity: SensitivityLevel;

  scopeMatrix: ScopeMatrixItem[];
  reviewNotes: ReviewNote[];
  assuranceTrail: AssuranceEvent[];

  governanceSummary?: GovernanceSummary;
  privacyBoundary?: PrivacyBoundary;
  transferReadiness?: TransferReadiness;
};
