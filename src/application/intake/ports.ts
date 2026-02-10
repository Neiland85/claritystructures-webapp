import type {
  ContactIntakeInput,
  IntakeStatus,
} from '@/domain/intake-records';

export type IntakeRecord = ContactIntakeInput & {
  id: string;
  createdAt: Date;
};

export interface IntakeRepository {
  create(input: ContactIntakeInput): Promise<IntakeRecord>;
  findById(id: string): Promise<IntakeRecord | null>;
  updateStatus(id: string, status: IntakeStatus): Promise<IntakeRecord | null>;
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
