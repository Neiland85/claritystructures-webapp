import type { DecisionExplanation } from '@/domain/decision-explanation';
import type { IntakeDecision } from '@/domain/decision-engine';
import type { WizardResult } from '@/domain/wizard-result';

export type IntakeSubmissionRecord = {
  id?: string;
  wizardResult: WizardResult;
  decision: IntakeDecision;
  explanation: DecisionExplanation;
  createdAt: Date;
};

export const db = {
  async saveIntake(record: IntakeSubmissionRecord): Promise<void> {
    // Placeholder adapter for the `intakes` table.
    // In production this should persist to the real database.
    // Avoid logging full intake payload to prevent leaking sensitive data.
    console.info('[DB_SAVE_INTAKE]', {
      id: record.id,
      createdAt: record.createdAt,
    });
  },
};
