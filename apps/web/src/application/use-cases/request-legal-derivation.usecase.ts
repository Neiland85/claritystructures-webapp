import type {
  IntakeRepository,
  LegalDerivationRepository,
  AuditTrail,
} from "@claritystructures/domain";
import {
  eventDispatcher,
  LegalDerivationRequestedEvent,
} from "@claritystructures/domain";
import { createLogger } from "@/lib/logger";

const logger = createLogger("RequestLegalDerivationUseCase");

export type RequestDerivationInput = {
  intakeId: string;
  recipientEntity: string;
  ipHash?: string;
  userAgent?: string;
};

export class RequestLegalDerivationUseCase {
  constructor(
    private readonly intakes: IntakeRepository,
    private readonly derivation: LegalDerivationRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(input: RequestDerivationInput): Promise<{ consentId: string }> {
    // 1. Verify intake exists
    const intake = await this.intakes.findById(input.intakeId);
    if (!intake) {
      throw new Error(`Intake not found: ${input.intakeId}`);
    }

    // 2. Check for existing active consent (prevent duplicates)
    const existing = await this.derivation.findByIntakeId(input.intakeId);
    if (existing && !existing.revokedAt) {
      return { consentId: existing.id };
    }

    // 3. Record consent
    const consentId = await this.derivation.recordConsent({
      intakeId: input.intakeId,
      recipientEntity: input.recipientEntity,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    });

    // 4. Dispatch domain event
    const event = new LegalDerivationRequestedEvent(
      input.intakeId,
      input.recipientEntity,
      consentId,
    );
    await eventDispatcher.dispatch(event);

    // 5. Audit trail
    try {
      await this.audit.record({
        action: "legal_derivation_consented",
        intakeId: input.intakeId,
        metadata: {
          consentId,
          recipientEntity: input.recipientEntity,
        },
      });
    } catch {
      logger.error("Audit trail recording failed — non-blocking");
    }

    return { consentId };
  }
}
