import type { IntakeDecision } from '@/domain/decision';
import type { DecisionExplanation } from '@/domain/decision-explanation';

export type IntakeListItem = {
  id: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  needsReview: boolean;
  decision: IntakeDecision;
  explanation: DecisionExplanation;
};

export type AdminIntakeRow = {
  id: string;
  contactEmail: string;
  contactPhone: string;
  createdAtIso: string;
  priority: string;
  reasons: string[];
  needsReview: boolean;
};

export function toAdminIntakeRows(intakes: IntakeListItem[]): AdminIntakeRow[] {
  return intakes.map((intake) => {
    return {
      id: intake.id,
      contactEmail: intake.contactEmail,
      contactPhone: intake.contactPhone,
      createdAtIso: intake.createdAt.toISOString(),
      priority: intake.decision.priority ?? 'unknown',
      reasons: Array.isArray(intake.explanation.reasons) ? intake.explanation.reasons : [],
      needsReview: intake.needsReview,
    };
  });
}
