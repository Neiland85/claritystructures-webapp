import type { WizardResult } from '@/types/wizard';

import { decideIntake } from './decision';
import type { IntakeSignalSummary, IntakeSignals } from './intake-signals';
import { buildSummary } from './intake-signals';
import type { IntakeActionCode, IntakeFlag, IntakePriority } from './intake-records';
import { mapWizardToSignals } from './map-wizard-to-signals';

export type IntakeAssessment = {
  priority: IntakePriority;
  flags: IntakeFlag[];
  actionCode: IntakeActionCode;
};

export type IntakeAssessmentWithSignals = IntakeAssessment & {
  signals: IntakeSignals;
  summary: IntakeSignalSummary;
};

export function assessIntake(result: WizardResult): IntakeAssessment {
  const decision = decideIntake(result);
  return {
    priority: decision.priority,
    flags: decision.flags,
    actionCode: decision.actionCode,
  };
}

export function assessIntakeWithSignals(result: WizardResult): IntakeAssessmentWithSignals {
  const assessment = assessIntake(result);
  const signals = mapWizardToSignals(result);

  return {
    ...assessment,
    signals,
    summary: buildSummary(signals),
  };
}
