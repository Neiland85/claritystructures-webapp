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

// ── Legal Derivation ──────────────────────────────────────────

export type DerivationConsentRecord = {
  intakeId: string;
  recipientEntity: string;
  ipHash?: string;
  userAgent?: string;
};

export type DerivationConsentSummary = {
  id: string;
  intakeId: string;
  recipientEntity: string;
  consentedAt: Date;
  revokedAt: Date | null;
};

export interface LegalDerivationRepository {
  recordConsent(record: DerivationConsentRecord): Promise<string>;
  revokeConsent(consentId: string): Promise<void>;
  findByIntakeId(intakeId: string): Promise<DerivationConsentSummary | null>;
}

export type TransferLogEntry = {
  intakeId: string;
  recipientEntity: string;
  manifestHash: string;
  payloadSizeBytes: number;
  legalBasis: string;
};

export type TransferLogSummary = {
  id: string;
  intakeId: string;
  recipientEntity: string;
  manifestHash: string;
  legalBasis: string;
  transferredAt: Date;
  acknowledgedAt: Date | null;
};

export interface TransferLogRepository {
  recordTransfer(entry: TransferLogEntry): Promise<string>;
  recordAcknowledgment(transferId: string): Promise<void>;
  findByIntakeId(intakeId: string): Promise<TransferLogSummary[]>;
}

// ── Retention & Legal Hold ────────────────────────────────────

export type LegalHoldRecord = {
  intakeId: string;
  reason: string;
  placedBy: string;
};

export type LegalHoldSummary = {
  id: string;
  intakeId: string;
  reason: string;
  placedBy: string;
  createdAt: Date;
  liftedAt: Date | null;
};

export interface LegalHoldRepository {
  place(record: LegalHoldRecord): Promise<string>;
  lift(holdId: string): Promise<void>;
  findActiveByIntakeId(intakeId: string): Promise<LegalHoldSummary | null>;
  findAllActive(): Promise<LegalHoldSummary[]>;
}

export type DeletionLogEntry = {
  intakeId: string;
  reason: string;
  trigger: "retention_policy" | "user_request" | "manual";
};

export type DeletionLogSummary = {
  id: string;
  intakeId: string;
  reason: string;
  trigger: string;
  deletedAt: Date;
};

export interface DeletionLogRepository {
  record(entry: DeletionLogEntry): Promise<void>;
  findByIntakeId(intakeId: string): Promise<DeletionLogSummary[]>;
}
