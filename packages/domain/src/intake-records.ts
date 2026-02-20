export const INTAKE_STATUSES = ["pending", "accepted", "rejected"] as const;

export type IntakeStatus = (typeof INTAKE_STATUSES)[number];

export const INTAKE_TONES = ["basic", "family", "legal", "critical"] as const;

export type IntakeTone = (typeof INTAKE_TONES)[number];

export const INTAKE_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export type IntakePriority = (typeof INTAKE_PRIORITIES)[number];

export type IntakeActionCode =
  | "IMMEDIATE_HUMAN_CONTACT"
  | "PRIORITY_REVIEW_24_48H"
  | "STANDARD_REVIEW"
  | "DEFERRED_INFORMATIONAL_RESPONSE";

export type IntakeFlag =
  | "family_conflict"
  | "active_procedure"
  | "legal_professional"
  | "emotional_distress"
  | "physical_risk"
  | "financial_risk"
  | "access_compromised"
  | "evidence_volatility"
  | "legal_risk";
