import type {
  IntakeRepository,
  LegalDerivationRepository,
  TransferLogRepository,
  AuditTrail,
  SlaRepository,
} from "@claritystructures/domain";
import {
  assembleTransferPacket,
  buildIdempotencyFingerprint,
  computeManifestHash,
  eventDispatcher,
  TransferPacketGeneratedEvent,
} from "@claritystructures/domain";
import type {
  TransferableDecision,
  TransferPacketPayload,
  ChronologyEntry,
} from "@claritystructures/domain";
import { createLogger } from "@/lib/logger";

const logger = createLogger("GenerateTransferPacketUseCase");

export type GenerateTransferInput = {
  intakeId: string;
  decision: TransferableDecision;
  chronology: ChronologyEntry[];
  generatedAt?: string;
  idempotencyKey?: string;
};

export type GenerateTransferOutput = {
  transferId: string;
  manifestHash: string;
  packet: TransferPacketPayload;
};

export class GenerateTransferPacketUseCase {
  constructor(
    private readonly intakes: IntakeRepository,
    private readonly derivation: LegalDerivationRepository,
    private readonly transferLog: TransferLogRepository,
    private readonly sla: SlaRepository,
    private readonly audit: AuditTrail,
  ) {}

  async execute(input: GenerateTransferInput): Promise<GenerateTransferOutput> {
    // 1. Verify intake exists
    const intake = await this.intakes.findById(input.intakeId);
    if (!intake) {
      throw new Error(`Intake not found: ${input.intakeId}`);
    }

    // 2. Verify active derivation consent exists
    const consent = await this.derivation.findByIntakeId(input.intakeId);
    if (!consent || consent.revokedAt) {
      throw new Error(
        `No active derivation consent for intake: ${input.intakeId}`,
      );
    }

    // 3. Gather SLA snapshot
    const slaTimers = await this.sla.findByIntakeId(input.intakeId);
    const slaSnapshot = slaTimers.map((t) => ({
      milestone: t.milestone,
      deadlineAt: t.deadlineAt.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
      status: t.status,
    }));

    // 4. Build deterministic transfer identity
    const fingerprint = buildIdempotencyFingerprint({
      scope: "transfer.generate",
      version: "transfer-packet/v1",
      explicitKey: input.idempotencyKey,
      payload: {
        intakeId: input.intakeId,
        recipientEntity: consent.recipientEntity,
        decision: input.decision,
        slaSnapshot,
        chronology: input.chronology,
      },
    });

    // 5. Assemble minimized transfer packet
    const packet = assembleTransferPacket(
      {
        intakeId: intake.id,
        tone: intake.tone,
        route: intake.route,
        priority: intake.priority,
        message: intake.message,
        createdAt: intake.createdAt,
      },
      input.decision,
      slaSnapshot,
      input.chronology,
      {
        generatedAt:
          input.generatedAt ?? input.decision.decidedAt.toISOString(),
        packetIdempotencyKey: fingerprint.key,
      },
    );

    // 6. Compute manifest hash
    const manifestHash = computeManifestHash(packet);

    // 6. Persist transfer log
    const payloadJson = JSON.stringify(packet);
    const transferId = await this.transferLog.recordTransfer({
      intakeId: input.intakeId,
      recipientEntity: consent.recipientEntity,
      manifestHash,
      payloadSizeBytes: Buffer.byteLength(payloadJson, "utf-8"),
      legalBasis: "explicit_consent",
      idempotencyKey: fingerprint.key,
      contentHash: fingerprint.requestHash,
    });

    // 7. Dispatch domain event
    const event = new TransferPacketGeneratedEvent(
      input.intakeId,
      manifestHash,
      consent.recipientEntity,
    );
    await eventDispatcher.dispatch(event);

    // 8. Audit
    try {
      await this.audit.record({
        action: "transfer_packet_generated",
        intakeId: input.intakeId,
        metadata: {
          transferId,
          manifestHash,
          recipientEntity: consent.recipientEntity,
          payloadSizeBytes: Buffer.byteLength(payloadJson, "utf-8"),
          idempotencyKey: fingerprint.key,
          contentHash: fingerprint.requestHash,
        },
      });
    } catch {
      logger.error("Audit trail recording failed — non-blocking");
    }

    return { transferId, manifestHash, packet };
  }
}
