import type { JsonValue } from './json';

/**
 * Intake domain types
 */

export type IntakeTone = 'basic' | 'family' | 'legal' | 'critical';

export type IntakeStatus =
  | 'RECEIVED'
  | 'ALERT_QUEUED'
  | 'DONE';

export type IntakePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

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
