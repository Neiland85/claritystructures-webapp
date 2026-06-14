export type ControlRoomTone = "ok" | "review" | "legal" | "blocked";

export type ReadinessItemViewModel = {
  label: string;
  status: string;
  tone: ControlRoomTone;
  detail: string;
};

export type BlockedActionViewModel = {
  action: string;
  reason: string;
  unlock: string;
};

export type AssuranceEventViewModel = {
  time: string;
  type: string;
  result: string;
};

export type ReviewNoteViewModel = {
  author: string;
  scope: string;
  text: string;
};

export type GovernanceDecisionViewModel = {
  eyebrow: string;
  title: string;
  summary: string;
  allowed: string[];
  blocked: string[];
};

export type CaseStatusViewModel = {
  label: string;
  value: string;
  tone: Extract<ControlRoomTone, "review" | "legal">;
};

export type ControlRoomViewModel = {
  caseRef: string;
  title: string;
  subtitle: string;
  status: CaseStatusViewModel[];

  readiness: ReadinessItemViewModel[];
  governanceDecision: GovernanceDecisionViewModel;
  allowedActions: string[];
  blockedActions: BlockedActionViewModel[];
  assuranceTrail: AssuranceEventViewModel[];
  privacyBoundary: {
    title: string;
    text: string;
  };
  reviewNotes: ReviewNoteViewModel[];
};
