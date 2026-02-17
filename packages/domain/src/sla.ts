/**
 * SLA (Service Level Agreement) definitions for critical case handling.
 *
 * These are deterministic, policy-driven thresholds.
 * They derive from PHASE 2 risk controls in the acquisition funnel spec.
 */

export const SLA_MILESTONES = [
  "acknowledgment",
  "first_contact",
  "containment_guidance",
  "legal_escalation",
] as const;

export type SlaMilestone = (typeof SLA_MILESTONES)[number];

/**
 * Maximum elapsed time (in minutes) from the decision timestamp
 * for each milestone when priority === "critical".
 */
export const SLA_THRESHOLDS: Record<SlaMilestone, number> = {
  acknowledgment: 15,
  first_contact: 60,
  containment_guidance: 120,
  legal_escalation: 240,
} as const;

export const SLA_STATUSES = ["pending", "met", "breached"] as const;
export type SlaStatus = (typeof SLA_STATUSES)[number];

export type SlaTimerRecord = {
  id: string;
  intakeId: string;
  milestone: SlaMilestone;
  deadlineAt: Date;
  completedAt: Date | null;
  status: SlaStatus;
  createdAt: Date;
};

/**
 * Compute the deadline for a given milestone based on decision timestamp.
 */
export function computeDeadline(
  decisionTimestamp: Date,
  milestone: SlaMilestone,
): Date {
  const minutes = SLA_THRESHOLDS[milestone];
  return new Date(decisionTimestamp.getTime() + minutes * 60_000);
}

/**
 * Determine the SLA status for a timer.
 */
export function resolveSlaStatus(
  deadlineAt: Date,
  completedAt: Date | null,
  now: Date = new Date(),
): SlaStatus {
  if (completedAt) {
    return completedAt <= deadlineAt ? "met" : "breached";
  }
  return now > deadlineAt ? "breached" : "pending";
}
