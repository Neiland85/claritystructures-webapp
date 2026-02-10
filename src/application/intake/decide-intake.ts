import { resolveIntakeRoute } from '@/domain/flow';
import { assessIntake } from '@/domain/priority';
import type { WizardResult } from '@/types/wizard';

import type { IntakeDecision } from './submit-intake.usecase';

export type SubmitIntakePayload = WizardResult & {
  email: string;
  message: string;
  consent: boolean;
};

export function decideIntake(payload: SubmitIntakePayload): IntakeDecision {
  const assessment = assessIntake(payload);

  return {
    nextRoute: resolveIntakeRoute(payload),
    priority: assessment.priority,
    flags: assessment.flags,
    recommendedAction: assessment.recommendedAction,
  };
}
