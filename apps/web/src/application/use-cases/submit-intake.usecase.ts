import type {
  ContactIntakeInput,
  IntakeRecord,
  IntakeRepository,
  Notifier,
  AuditTrail,
} from "@claritystructures/domain";
import { decideIntakeWithExplanation } from "@claritystructures/domain";

/**
 * Submit Intake Use Case
 *
 * Canonical business orchestration for intake submission.
 * Coordinates domain logic with infrastructure adapters.
 *
 * Responsibilities:
 * - Execute decision logic
 * - Persist intake record
 * - Trigger notifications
 * - Record audit events
 *
 * Dependencies injected via constructor (Dependency Inversion Principle)
 */
export class SubmitIntakeUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly notifier: Notifier,
    private readonly audit: AuditTrail,
  ) {}

  async execute(input: ContactIntakeInput): Promise<{
    record: IntakeRecord;
    decision: ReturnType<typeof decideIntakeWithExplanation>;
  }> {
    // 1. Execute domain decision logic (pure function)
    const decision = decideIntakeWithExplanation(input.meta as any, true);

    // 2. Persist intake record (infrastructure)
    const record = await this.repository.create(input);

    // 3. Trigger notification (infrastructure)
    await this.notifier.notifyIntakeReceived(record);

    // 4. Record audit event (infrastructure)
    await this.audit.record({
      action: "intake_submitted",
      intakeId: record.id,
      metadata: {
        priority: decision.decision.priority,
        route: decision.decision.route,
        modelVersion: decision.decision.decisionModelVersion,
      },
      occurredAt: new Date(),
    });

    return { record, decision };
  }
}
