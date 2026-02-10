import type { JsonValue } from './json';

/**
 * Intake domain types
 */

export const INTAKE_TONES = [
  'basic',
  'family',
  'legal',
  'critical',
] as const;

export type IntakeTone = (typeof INTAKE_TONES)[number];

export const INTAKE_STATUSES = [
  'RECEIVED',
  'ALERT_QUEUED',
  'DONE',
] as const;

export type IntakeStatus = (typeof INTAKE_STATUSES)[number];

export const INTAKE_PRIORITIES = [
  'low',
  'medium',
  'high',
  'critical',
] as const;

export type IntakePriority = (typeof INTAKE_PRIORITIES)[number];

export const INTAKE_FLAGS = [
  'family_conflict',
  'active_procedure',
  'legal_professional',
  'emotional_distress',
] as const;

export type IntakeFlag = (typeof INTAKE_FLAGS)[number];

export const INTAKE_ACTION_CODES = [
  'IMMEDIATE_HUMAN_CONTACT',
  'PRIORITY_REVIEW_24_48H',
  'STANDARD_REVIEW',
  'DEFERRED_INFORMATIONAL_RESPONSE',
] as const;

export type IntakeActionCode = (typeof INTAKE_ACTION_CODES)[number];

/**
 * Core intake input
 */
export type ContactIntakeInput = {
  tone: IntakeTone;
  route: string;
  priority: IntakePriority;
  name?: string | null;
  email: string;
  message: string;
  phone?: string | null;
  status: IntakeStatus;
  spamScore?: number | null;
  meta?: JsonValue | null;
};
