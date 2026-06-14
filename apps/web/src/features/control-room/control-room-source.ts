export type ControlRoomSourceTone = "ok" | "review" | "legal" | "blocked";

export type ControlRoomSourceStatus = {
  label: string;
  value: string;
  tone: Extract<ControlRoomSourceTone, "review" | "legal">;
};

export type ControlRoomSourceReadinessItem = {
  label: string;
  status: string;
  tone: ControlRoomSourceTone;
  detail: string;
};

export type ControlRoomSourceGovernanceDecision = {
  eyebrow: string;
  title: string;
  summary: string;
  allowed: string[];
  blocked: string[];
};

export type ControlRoomSourceBlockedAction = {
  action: string;
  reason: string;
  unlock: string;
};

export type ControlRoomSourceAssuranceEvent = {
  time: string;
  type: string;
  result: string;
};

export type ControlRoomSourceReviewNote = {
  author: string;
  scope: string;
  text: string;
};

export type ControlRoomSourcePrivacyBoundary = {
  title: string;
  text: string;
};

export type ControlRoomSource = {
  caseRef: string;
  title: string;
  subtitle: string;

  status: ControlRoomSourceStatus[];
  readiness: ControlRoomSourceReadinessItem[];
  governanceDecision: ControlRoomSourceGovernanceDecision;
  allowedActions: string[];
  blockedActions: ControlRoomSourceBlockedAction[];
  assuranceTrail: ControlRoomSourceAssuranceEvent[];
  privacyBoundary: ControlRoomSourcePrivacyBoundary;
  reviewNotes: ControlRoomSourceReviewNote[];
};
