import type {
  IntakeRecord,
  IntakeRepository,
  AuditTrail,
} from "@claritystructures/domain";

/**
 * Get User Data Use Case (ARCO-POL: Acceso)
 *
 * Returns all intake records associated with a given email.
 * Logs an audit event for compliance.
 */
export class GetUserDataUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(email: string): Promise<IntakeRecord[]> {
    const intakes = await this.repository.findByEmail(email);

    await this.audit.record({
      action: "arcopol_access_requested",
      metadata: { email, recordsFound: intakes.length },
      occurredAt: new Date(),
    });

    return intakes;
  }
}
