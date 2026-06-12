/**
 * Transfer Packet – Legal Derivation
 *
 * Pure functions to assemble, minimize, and hash the data packet
 * transferred to external legal counsel.
 *
 * Data minimization: only fields strictly necessary for legal assessment
 * are included.
 */

import { createHash } from "node:crypto";
import { stableCanonicalJson } from "./idempotency";

export type TransferableIntake = {
  intakeId: string;
  tone: string;
  route: string;
  priority: string;
  message: string;
  createdAt: Date;
};

export type TransferableDecision = {
  modelVersion: string;
  rulesTriggered: string[];
  outcome: string;
  explanation: string;
  decidedAt: Date;
};

export type TransferPacketAssemblyOptions = {
  generatedAt: string;
  packetIdempotencyKey?: string;
};

export type TransferPacketPayload = {
  schemaVersion: "1.0";
  generatedAt: string;
  packetIdempotencyKey?: string;
  intake: TransferableIntake;
  decision: TransferableDecision;
  slaSnapshot: SlaSnapshotEntry[];
  chronology: ChronologyEntry[];
};

export type SlaSnapshotEntry = {
  milestone: string;
  deadlineAt: string;
  completedAt: string | null;
  status: string;
};

export type ChronologyEntry = {
  action: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
};

export function assembleTransferPacket(
  intake: TransferableIntake,
  decision: TransferableDecision,
  sla: SlaSnapshotEntry[],
  chronology: ChronologyEntry[],
  options: TransferPacketAssemblyOptions,
): TransferPacketPayload {
  if (!options?.generatedAt) {
    throw new Error(
      "Transfer packet generatedAt is required for deterministic assembly",
    );
  }

  return Object.freeze({
    schemaVersion: "1.0" as const,
    generatedAt: options.generatedAt,
    packetIdempotencyKey: options.packetIdempotencyKey,
    intake: Object.freeze({ ...intake }),
    decision: Object.freeze({ ...decision }),
    slaSnapshot: Object.freeze(sla.map((s) => Object.freeze({ ...s }))),
    chronology: Object.freeze(chronology.map((c) => Object.freeze({ ...c }))),
  }) as TransferPacketPayload;
}

export function computeManifestHash(packet: TransferPacketPayload): string {
  const canonical = stableCanonicalJson(packet);

  return createHash("sha256").update(canonical).digest("hex");
}

export function verifyManifestHash(
  packet: TransferPacketPayload,
  expectedHash: string,
): boolean {
  return computeManifestHash(packet) === expectedHash;
}
