import type {
  IntakeRepository,
  AuditTrail,
  LegalHoldRepository,
  DeletionLogRepository,
} from "@claritystructures/domain";

export type DeleteUserDataResult = {
  suppressed: number;
  skippedLegalHold: number;
};

export class DeleteUserDataUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly legalHolds: LegalHoldRepository,
    private readonly deletionLog: DeletionLogRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(email: string): Promise<DeleteUserDataResult> {
    const intakes = await this.repository.findByEmail(email);

    let suppressed = 0;
    let skippedLegalHold = 0;

    for (const intake of intakes) {
      const hold = await this.legalHolds.findActiveByIntakeId(intake.id);

      if (hold) {
        skippedLegalHold++;
        continue;
      }

      await this.deletionLog.record({
        intakeId: intake.id,
        reason: "data_subject_request",
        trigger: "user_request",
      });

      await this.repository.deleteById(intake.id);
      suppressed++;
    }

    await this.audit.record({
      action: "arcopol_suppression_completed",
      metadata: {
        email,
        recordsFound: intakes.length,
        suppressed,
        skippedLegalHold,
      },
      occurredAt: new Date(),
    });

    return { suppressed, skippedLegalHold };
  }
}
