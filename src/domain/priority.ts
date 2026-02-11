import type { WizardResult } from './wizard-result';

import { decideIntake, DECISION_MODEL_VERSION_V2, decideIntakeV2 } from './decision';
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
  decisionModelVersion?: string;
};

export type AssessIntakeWithSignalsOptions = {
  useDecisionModelV2?: boolean;
  includeDecisionModelVersion?: boolean;
};

export function assessIntake(result: WizardResult): IntakeAssessment {
  const decision = decideIntake(result);
  return {
    priority: decision.priority,
    flags: decision.flags,
    actionCode: decision.actionCode,
  };
}


export function assessIntakeV2(result: WizardResult): IntakeAssessment {
  const decision = decideIntakeV2(result);
  return {
    priority: decision.priority,
    flags: decision.flags,
    actionCode: decision.actionCode,
  };
}

export function assessIntakeWithSignals(
  result: WizardResult,
  options: AssessIntakeWithSignalsOptions = {}
): IntakeAssessmentWithSignals {
  const useDecisionModelV2 = options.useDecisionModelV2 ?? false;
  const includeDecisionModelVersion = options.includeDecisionModelVersion ?? false;
  const decision = useDecisionModelV2 ? decideIntakeV2(result) : decideIntake(result);
  const signals = mapWizardToSignals(result);

  return {
    priority: decision.priority,
    flags: decision.flags,
    actionCode: decision.actionCode,
    signals,
    summary: buildSummary(signals),
    ...(includeDecisionModelVersion
      ? {
          decisionModelVersion: useDecisionModelV2
            ? DECISION_MODEL_VERSION_V2
            : decision.decisionModelVersion,
        }
      : {}),
  };
}
