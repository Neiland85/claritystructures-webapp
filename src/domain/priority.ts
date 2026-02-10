import type { WizardResult } from '@/types/wizard';

import { decideIntake } from './decision';
import type { IntakeActionCode, IntakeFlag, IntakePriority } from './intake-records';

export type IntakeAssessment = {
  priority: IntakePriority;
  flags: IntakeFlag[];
  actionCode: IntakeActionCode;
};

export function assessIntake(result: WizardResult): IntakeAssessment {
  const decision = decideIntake(result);
  return {
    priority: decision.priority,
    flags: decision.flags,
    actionCode: decision.actionCode,
  };
}
