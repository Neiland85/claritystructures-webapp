import type { IntakeRepository, AuditTrail } from "@claritystructures/domain";

/**
 * Delete User Data Use Case (ARCO-POL: Supresión / Derecho al Olvido)
 *
 * Deletes all intake records and related consent acceptances for a given email.
 * Logs an audit event for compliance.
 */
export class DeleteUserDataUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(email: string): Promise<{ deleted: number }> {
    const count = await this.repository.deleteByEmail(email);

    await this.audit.record({
      action: "arcopol_deletion_completed",
      metadata: { email, intakesDeleted: count },
      occurredAt: new Date(),
    });

    return { deleted: count };
  }
}
