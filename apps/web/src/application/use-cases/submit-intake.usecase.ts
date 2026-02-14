import type {
  ContactIntakeInput,
  IntakeRecord,
  IntakeRepository,
  Notifier,
  AuditTrail,
  WizardResult,
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
// Input for this use case: priority and route are optional as they are computed by the decision engine
export type SubmitIntakeInput = Omit<
  ContactIntakeInput,
  "priority" | "route"
> & {
  priority?: ContactIntakeInput["priority"];
  route?: ContactIntakeInput["route"];
};

// Type guard for WizardResult if needed, or simple assertion if we trust the API layer sanitization
function isWizardResult(meta: unknown): meta is WizardResult {
  // Basic structural check - in a real app, use Zod or similar
  const m = meta as any;
  return (
    m &&
    typeof m === "object" &&
    typeof m.objective === "string" &&
    typeof m.incident === "string"
  );
}

export class SubmitIntakeUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly notifier: Notifier,
    private readonly audit: AuditTrail,
  ) {}

  async execute(input: SubmitIntakeInput): Promise<{
    record: IntakeRecord;
    decision: ReturnType<typeof decideIntakeWithExplanation>;
  }> {
    // 1. Execute domain decision logic (pure function)
    const meta = input.meta;
    let wizardResult: WizardResult;

    if (isWizardResult(meta)) {
      wizardResult = meta;
    } else {
      // Fallback for when meta is null/undefined or not a full wizard result
      // This ensures decideIntakeWithExplanation receives a valid structure
      wizardResult = {
        objective: "contact",
        incident: input.message,
        clientProfile: "other",
        urgency: "informational",
        devices: 0,
        actionsTaken: [],
        evidenceSources: [],
      };
    }

    const decision = decideIntakeWithExplanation(wizardResult, true);

    // 2. Persist intake record (infrastructure)
    // CRITICAL: We use the *computed* priority and route from the decision engine,
    // overriding whatever default might have been passed in the input.
    const record = await this.repository.create({
      ...input,
      priority: decision.decision.priority,
      route: decision.decision.route,
    });

    // 3. Trigger notification (infrastructure)
    // Wrapped in try/catch to ensure failure here doesn't block the main flow
    try {
      await this.notifier.notifyIntakeReceived(record);
    } catch (error) {
      console.error("[SubmitIntakeUseCase] Notification failed:", error);
      // We do not rethrow; the intake is saved, which is the primary goal.
    }

    // 4. Record audit event (infrastructure)
    try {
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
    } catch (error) {
      console.error("[SubmitIntakeUseCase] Audit failed:", error);
    }

    return { record, decision };
  }
}
