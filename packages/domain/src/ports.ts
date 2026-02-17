import type { ContactIntakeInput, IntakeStatus } from "./index";

export type IntakeRecord = ContactIntakeInput & {
  id: string;
  createdAt: Date;
};

export interface IntakeRepository {
  create(input: ContactIntakeInput): Promise<IntakeRecord>;
  findById(id: string): Promise<IntakeRecord | null>;
  updateStatus(id: string, status: IntakeStatus): Promise<IntakeRecord | null>;
  findAll(): Promise<IntakeRecord[]>;
  findByEmail(email: string): Promise<IntakeRecord[]>;
  deleteByEmail(email: string): Promise<number>;
}

export interface Notifier {
  notifyIntakeReceived(intake: IntakeRecord): Promise<void>;
}

export type AuditEvent = {
  action: string;
  intakeId?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: Date;
};

export interface AuditTrail {
  record(event: AuditEvent): Promise<void> | void;
}

export type ConsentRecord = {
  intakeId: string;
  consentVersion: string;
  ipHash?: string;
  userAgent?: string;
  locale?: string;
};

export interface ConsentRepository {
  recordAcceptance(record: ConsentRecord): Promise<void>;
  findActiveVersion(): Promise<{ id: string; version: string } | null>;
}

export interface SlaRepository {
  createTimers(intakeId: string, decisionTimestamp: Date): Promise<void>;
  completeMilestone(intakeId: string, milestone: string): Promise<void>;
  findByIntakeId(intakeId: string): Promise<SlaTimerSummary[]>;
  findBreached(): Promise<SlaTimerSummary[]>;
}

export type SlaTimerSummary = {
  id: string;
  intakeId: string;
  milestone: string;
  deadlineAt: Date;
  completedAt: Date | null;
  status: string;
};
