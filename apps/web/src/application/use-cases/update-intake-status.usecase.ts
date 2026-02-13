import type {
  IntakeRecord,
  IntakeRepository,
  IntakeStatus,
  AuditTrail,
} from "@claritystructures/domain";

/**
 * Update Intake Status Use Case
 *
 * Allows staff to transition intake states (e.g., from pending to closed).
 */
export class UpdateIntakeStatusUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(
    id: string,
    status: IntakeStatus,
  ): Promise<IntakeRecord | null> {
    const updated = await this.repository.updateStatus(id, status);

    if (updated) {
      await this.audit.record({
        action: "intake_status_updated",
        intakeId: id,
        metadata: { status },
        occurredAt: new Date(),
      });
    }

    return updated;
  }
}
