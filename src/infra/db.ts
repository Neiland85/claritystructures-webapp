import type { DecisionExplanation } from '@/domain/decision-explanation';
import type { IntakeDecision } from '@/domain/decision-engine';
import type { WizardResult } from '@/domain/wizard-result';

export type IntakeSubmitRecord = {
  id?: string;
  wizardResult: WizardResult;
  decision: IntakeDecision;
  explanation: DecisionExplanation;
  createdAt: Date;
};

export const db = {
  async saveIntake(record: IntakeSubmitRecord): Promise<void> {
    // Placeholder adapter for the `intakes` table.
    // In production this should persist to the real database.
    console.info('[DB_SAVE_INTAKE]', record);
  },
};
