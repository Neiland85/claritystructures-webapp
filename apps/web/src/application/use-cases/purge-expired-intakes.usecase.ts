import type {
  IntakeRepository,
  LegalHoldRepository,
  DeletionLogRepository,
  AuditTrail,
  RetentionCategory,
} from "@claritystructures/domain";
import {
  computeRetentionCutoff,
  eventDispatcher,
  IntakePurgedEvent,
} from "@claritystructures/domain";

export type PurgeResult = {
  purged: number;
  skippedLegalHold: number;
  category: RetentionCategory;
};

/**
 * Purge Expired Intakes Use Case
 *
 * Enforces the retention policy by deleting intakes older than the
 * configured retention period, respecting legal holds.
 *
 * For each eligible intake:
 *   1. Check legal hold — skip if active
 *   2. Record deletion in DeletionLog (audit trail)
 *   3. Delete the intake and cascade-delete related records
 *   4. Dispatch IntakePurgedEvent
 */
export class PurgeExpiredIntakesUseCase {
  constructor(
    private readonly intakes: IntakeRepository,
    private readonly legalHolds: LegalHoldRepository,
    private readonly deletionLog: DeletionLogRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(
    category: RetentionCategory = "intake_data",
    now?: Date,
  ): Promise<PurgeResult> {
    const cutoff = computeRetentionCutoff(category, now);
    const expired = await this.intakes.findExpiredBefore(cutoff);

    let purged = 0;
    let skippedLegalHold = 0;

    for (const intake of expired) {
      // Check legal hold — never purge held intakes
      const hold = await this.legalHolds.findActiveByIntakeId(intake.id);
      if (hold) {
        skippedLegalHold++;
        continue;
      }

      // Record deletion before actually deleting
      await this.deletionLog.record({
        intakeId: intake.id,
        reason: `retention_policy:${category}`,
        trigger: "retention_policy",
      });

      // Cascade delete intake + related records
      await this.intakes.deleteById(intake.id);

      // Dispatch domain event
      const event = new IntakePurgedEvent(
        intake.id,
        `retention_policy:${category}`,
      );
      await eventDispatcher.dispatch(event);

      purged++;
    }

    // Audit the purge run
    await this.audit.record({
      action: "retention_purge_completed",
      metadata: {
        category,
        cutoff: cutoff.toISOString(),
        purged,
        skippedLegalHold,
        totalExpired: expired.length,
      },
      occurredAt: now ?? new Date(),
    });

    return { purged, skippedLegalHold, category };
  }
}
