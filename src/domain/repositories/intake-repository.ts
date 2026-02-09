import type {
  AuditEventInput,
  ConsentAcceptanceInput,
  ContactIntakeInput,
  InternalAlertInput,
  IntakeStatus,
} from '@/domain/intake-records';

export type CreatedId = { id: string };

export interface IntakeRepository {
  createIntake(input: ContactIntakeInput): Promise<CreatedId>;
  updateIntakeStatus(id: string, status: IntakeStatus): Promise<void>;
  createConsentAcceptance(input: ConsentAcceptanceInput): Promise<CreatedId>;
  createInternalAlert(input: InternalAlertInput): Promise<CreatedId>;
  createAuditEvent(input: AuditEventInput): Promise<CreatedId>;
}
