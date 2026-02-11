export type IntakeListItem = {
  id: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  needsReview: boolean;
  decision: unknown;
  explanation: unknown;
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
    const decision = intake.decision as { priority?: string };
    const explanation = intake.explanation as { reasons?: string[] };

    return {
      id: intake.id,
      contactEmail: intake.contactEmail,
      contactPhone: intake.contactPhone,
      createdAtIso: intake.createdAt.toISOString(),
      priority: decision.priority ?? 'unknown',
      reasons: Array.isArray(explanation.reasons) ? explanation.reasons : [],
      needsReview: intake.needsReview,
    };
  });
}
