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
