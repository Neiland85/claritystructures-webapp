import type { WizardResult } from './wizard-result';

export const INTAKE_STATUSES = [
  'pending',
  'accepted',
  'rejected',
] as const;

export type IntakeStatus = typeof INTAKE_STATUSES[number];

export type IntakeTone =
  | 'basic'
  | 'family'
  | 'legal'
  | 'critical';

export type IntakePriority = 'low' | 'medium' | 'high' | 'critical';

export type IntakeActionCode =
  | 'IMMEDIATE_HUMAN_CONTACT'
  | 'PRIORITY_REVIEW_24_48H'
  | 'STANDARD_REVIEW'
  | 'DEFERRED_INFORMATIONAL_RESPONSE';

export type IntakeFlag =
  | 'family_conflict'
  | 'active_procedure'
  | 'legal_professional'
  | 'emotional_distress';

export interface IntakeRecord {
  id: string;
  email: string;
  message: string;
  tone: IntakeTone;
  status: IntakeStatus;
  createdAt: Date;
}
