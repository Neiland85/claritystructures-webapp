import type {
  ContactIntakeInput,
  IntakeRecord,
  IntakeRepository,
  Notifier,
  AuditTrail,
  ConsentRepository,
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
 * - Record consent acceptance (if consent repository provided)
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

// Optional consent metadata attached at submission time
export type ConsentMeta = {
  consentVersion: string;
  ipHash?: string;
  userAgent?: string;
  locale?: string;
};

/** Type guard to verify meta is a valid WizardResult structure */
function isWizardResult(meta: unknown): meta is WizardResult {
  if (!meta || typeof meta !== "object") return false;
  const m = meta as Record<string, unknown>;
  return typeof m.objective === "string" && typeof m.incident === "string";
}

export class SubmitIntakeUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly notifier: Notifier,
    private readonly audit: AuditTrail,
    private readonly consent?: ConsentRepository,
  ) {}

  async execute(
    input: SubmitIntakeInput,
    consentMeta?: ConsentMeta,
  ): Promise<{
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

    // 3. Record consent acceptance (if consent repository is available)
    if (this.consent && consentMeta) {
      try {
        await this.consent.recordAcceptance({
          intakeId: record.id,
          consentVersion: consentMeta.consentVersion,
          ipHash: consentMeta.ipHash,
          userAgent: consentMeta.userAgent,
          locale: consentMeta.locale,
        });
      } catch (error) {
        console.error("[SubmitIntakeUseCase] Consent recording failed:", error);
      }
    }

    // 4. Trigger notification (infrastructure)
    // Wrapped in try/catch to ensure failure here doesn't block the main flow
    try {
      await this.notifier.notifyIntakeReceived(record);
    } catch (error) {
      console.error("[SubmitIntakeUseCase] Notification failed:", error);
      // We do not rethrow; the intake is saved, which is the primary goal.
    }

    // 5. Record audit event (infrastructure)
    try {
      await this.audit.record({
        action: "intake_submitted",
        intakeId: record.id,
        metadata: {
          priority: decision.decision.priority,
          route: decision.decision.route,
          modelVersion: decision.decision.decisionModelVersion,
          consentVersion: consentMeta?.consentVersion,
        },
        occurredAt: new Date(),
      });
    } catch (error) {
      console.error("[SubmitIntakeUseCase] Audit failed:", error);
    }

    return { record, decision };
  }
}
