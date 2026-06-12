import type {
  ContactIntakeInput,
  IntakeRecord,
  IntakeRepository,
  Notifier,
  AuditTrail,
  ConsentRepository,
  WizardResult,
  IdempotencyFingerprint,
  IdempotencyRepository,
} from "@claritystructures/domain";
import {
  buildResponseHash,
  decideIntakeWithExplanation,
} from "@claritystructures/domain";
import { createLogger } from "@/lib/logger";
import { createIntakeGovernanceEnvelope } from "@/lib/governance/wizard-result-to-governance-envelope";
import { buildGuardianDecision } from "@/lib/governance/guardian-decision-builder";

const logger = createLogger("SubmitIntakeUseCase");

type IntakeDecisionExplanation = ReturnType<typeof decideIntakeWithExplanation>;

export type SubmitIntakeOutput = {
  record: IntakeRecord;
  decision: IntakeDecisionExplanation;
  idempotencyStatus?: "created" | "replayed";
};

export class IdempotencyConflictError extends Error {
  readonly statusCode = 409;

  constructor(readonly key: string) {
    super("Idempotency key was already used with a different request body");
    this.name = "IdempotencyConflictError";
  }
}

export class IdempotencyInProgressError extends Error {
  readonly statusCode = 409;

  constructor(readonly key: string) {
    super("Idempotent operation is already in progress");
    this.name = "IdempotencyInProgressError";
  }
}

export type SubmitIntakeInput = Omit<
  ContactIntakeInput,
  "priority" | "route"
> & {
  priority?: ContactIntakeInput["priority"];
  route?: ContactIntakeInput["route"];
};

export type ConsentMeta = {
  consentVersion: string;
  ipHash?: string;
  userAgent?: string;
  locale?: string;
};

function isWizardResult(meta: unknown): meta is WizardResult {
  if (!meta || typeof meta !== "object") return false;
  const m = meta as Record<string, unknown>;

  return typeof m.objective === "string" && typeof m.incident === "string";
}

function isSubmitIntakeOutput(value: unknown): value is SubmitIntakeOutput {
  if (!value || typeof value !== "object") return false;

  const record = (value as { record?: unknown }).record;
  const decision = (value as { decision?: unknown }).decision;

  return Boolean(record && typeof record === "object" && decision);
}

function reviveOutput(value: SubmitIntakeOutput): SubmitIntakeOutput {
  return {
    ...value,
    record: {
      ...value.record,
      createdAt: new Date(value.record.createdAt),
    },
    idempotencyStatus: "replayed",
  };
}

export class SubmitIntakeUseCase {
  constructor(
    private readonly repository: IntakeRepository,
    private readonly notifier: Notifier,
    private readonly audit: AuditTrail,
    private readonly consent?: ConsentRepository,
    private readonly idempotency?: IdempotencyRepository,
  ) {}

  async execute(
    input: SubmitIntakeInput,
    consentMeta?: ConsentMeta,
    idempotencyFingerprint?: IdempotencyFingerprint,
  ): Promise<SubmitIntakeOutput> {
    const guard =
      this.idempotency && idempotencyFingerprint
        ? await this.idempotency.begin({
            scope: idempotencyFingerprint.scope,
            key: idempotencyFingerprint.key,
            requestHash: idempotencyFingerprint.requestHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          })
        : null;

    if (guard?.state === "replayed") {
      if (isSubmitIntakeOutput(guard.record.responseBody)) {
        return reviveOutput(guard.record.responseBody);
      }

      throw new Error("Stored idempotent response is malformed");
    }

    if (guard?.state === "conflict") {
      throw new IdempotencyConflictError(idempotencyFingerprint?.key ?? "");
    }

    if (guard?.state === "in_progress") {
      throw new IdempotencyInProgressError(idempotencyFingerprint?.key ?? "");
    }

    try {
      const meta = input.meta;
      let wizardResult: WizardResult;

      if (isWizardResult(meta)) {
        wizardResult = meta;
      } else {
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

      const governanceEnvelope = createIntakeGovernanceEnvelope({
        wizardResult,
        requestId: idempotencyFingerprint?.key ?? "non-idempotent-intake",
        consentVersion: consentMeta?.consentVersion ?? "unknown",
        policyBundleVersion: "wizard-guardian-policy/v0",
        ipHash: consentMeta?.ipHash,
        userAgent: consentMeta?.userAgent,
      });

      const guardianDecision = buildGuardianDecision({
        requestId: governanceEnvelope.requestId,
        schemaVersion: governanceEnvelope.schemaVersion,
        riskLevel: governanceEnvelope.governanceContext.riskLevel,
        requiresHumanReview:
          governanceEnvelope.governanceContext.requiresHumanReview,
        allowsAutomatedPreclassification:
          governanceEnvelope.governanceContext.allowsAutomatedPreclassification,
        allowsEvidenceHandling:
          governanceEnvelope.governanceContext.allowsEvidenceHandling,
        policyBundleVersion: governanceEnvelope.integrity.policyBundleVersion,
      });

      const record = await this.repository.create({
        ...input,
        priority: decision.decision.priority,
        route: decision.decision.route,
      });

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
          logger.error("Consent recording failed", error);
        }
      }

      try {
        await this.notifier.notifyIntakeReceived(record);
      } catch (error) {
        logger.error("Notification failed", error);
      }

      try {
        await this.audit.record({
          action: "intake_submitted",
          intakeId: record.id,
          metadata: {
            priority: decision.decision.priority,
            route: decision.decision.route,
            modelVersion: decision.decision.decisionModelVersion,
            consentVersion: consentMeta?.consentVersion,
            idempotencyKey: idempotencyFingerprint?.key,
            requestHash: idempotencyFingerprint?.requestHash,
            governanceEnvelope: {
              riskLevel: governanceEnvelope.governanceContext.riskLevel,
              requiresHumanReview:
                governanceEnvelope.governanceContext.requiresHumanReview,
              requiresLegalDerivation:
                governanceEnvelope.governanceContext.requiresLegalDerivation,
              allowsAutomatedPreclassification:
                governanceEnvelope.governanceContext
                  .allowsAutomatedPreclassification,
              allowsEvidenceHandling:
                governanceEnvelope.governanceContext.allowsEvidenceHandling,
              wizardResultHash: governanceEnvelope.integrity.wizardResultHash,
              policyBundleVersion:
                governanceEnvelope.integrity.policyBundleVersion,
            },
            guardianDecision,
          },
          occurredAt: new Date(),
        });
      } catch (error) {
        logger.error("Audit trail recording failed", error);
      }

      const output: SubmitIntakeOutput = {
        record,
        decision,
        idempotencyStatus: guard ? "created" : undefined,
      };

      if (this.idempotency && guard?.state === "started") {
        await this.idempotency.complete(
          guard.record.id,
          output,
          buildResponseHash(output),
        );
      }

      return output;
    } catch (error) {
      if (this.idempotency && guard?.state === "started") {
        await this.idempotency.fail(
          guard.record.id,
          error instanceof Error ? error.message : "unknown_error",
        );
      }

      throw error;
    }
  }
}
