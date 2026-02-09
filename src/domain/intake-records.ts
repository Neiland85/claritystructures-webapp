export type IntakeTone = 'basic' | 'family' | 'legal' | 'critical';

export type IntakeStatus = 'RECEIVED' | 'ALERT_QUEUED' | 'DONE';

export type IntakePriority = 'low' | 'medium' | 'high' | 'critical';

export type InternalAlertType = 'CRITICAL_EMAIL';

export type InternalAlertStatus = 'PENDING' | 'SENT' | 'FAILED';

export type AuditEntityType = 'intake' | 'consent' | 'alert';

export type AuditEventType =
  | 'INTAKE_CREATED'
  | 'CONSENT_ACCEPTED'
  | 'ALERT_QUEUED';

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
  meta?: Record<string, unknown> | null;
};

export type ConsentAcceptanceInput = {
  consentVersion: string;
  consentContent?: string | null;
  intakeId: string;
  acceptedAt: Date;
  ipHash?: string | null;
  userAgent?: string | null;
  locale?: string | null;
};

export type InternalAlertInput = {
  intakeId: string;
  type: InternalAlertType;
  status: InternalAlertStatus;
  createdAt: Date;
  sentAt?: Date | null;
  error?: string | null;
};

export type AuditEventInput = {
  entityType: AuditEntityType;
  entityId: string;
  eventType: AuditEventType;
  createdAt: Date;
  payload: Record<string, unknown>;
};
