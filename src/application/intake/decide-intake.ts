import { assessIntake, resolveIntakeRoute } from '@/domain';
import type { IntakePriority } from '@/domain/intake-records';
import type { WizardResult } from '@/types/wizard';

import type { IntakeDecision } from './submit-intake.usecase';

export type SubmitIntakePayload = WizardResult & {
  email: string;
  phone?: string;
  message: string;
  consent: boolean;
};

type AssessmentBase = {
  priority: IntakePriority;
  flags: string[];
} & Record<string, unknown>;

function defaultRecommendedAction(priority: IntakePriority): string {
  if (priority === 'critical') {
    return 'Immediate human contact and evidence preservation guidance';
  }

  if (priority === 'high') {
    return 'Priority review within 24–48h';
  }

  if (priority === 'medium') {
    return 'Standard review';
  }

  return 'Deferred or informational response';
}

function hasRecommendedAction(
  assessment: AssessmentBase
): assessment is AssessmentBase & { recommendedAction: string } {
  return (
    typeof assessment.recommendedAction === 'string' &&
    assessment.recommendedAction.length > 0
  );
}

export function decideIntake(payload: SubmitIntakePayload): IntakeDecision {
  const assessment: AssessmentBase = assessIntake(payload);

  return {
    nextRoute: resolveIntakeRoute(payload),
    priority: assessment.priority,
    flags: assessment.flags,
    recommendedAction: hasRecommendedAction(assessment)
      ? assessment.recommendedAction
      : defaultRecommendedAction(assessment.priority),
  };
}
