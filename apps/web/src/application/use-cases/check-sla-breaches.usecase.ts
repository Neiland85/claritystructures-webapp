import type {
  SlaRepository,
  SlaTimerSummary,
  AuditTrail,
  Notifier,
} from "@claritystructures/domain";

export type SlaBreachResult = {
  breached: number;
  timers: SlaTimerSummary[];
};

/**
 * Check SLA Breaches Use Case
 *
 * Queries for SLA timers that have exceeded their deadline without completion.
 * Logs each breach in the audit trail and optionally notifies.
 */
export class CheckSlaBreachesUseCase {
  constructor(
    private readonly sla: SlaRepository,
    private readonly audit: AuditTrail,
    private readonly notifier?: Notifier,
  ) {}

  async execute(): Promise<SlaBreachResult> {
    const breached = await this.sla.findBreached();

    if (breached.length > 0) {
      await this.audit.record({
        action: "sla_breach_check_completed",
        metadata: {
          breachedCount: breached.length,
          milestones: breached.map((t) => ({
            intakeId: t.intakeId,
            milestone: t.milestone,
            deadlineAt: t.deadlineAt.toISOString(),
          })),
        },
        occurredAt: new Date(),
      });
    }

    return { breached: breached.length, timers: breached };
  }
}
