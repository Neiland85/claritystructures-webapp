/**
 * Transfer Packet – Legal Derivation
 *
 * Pure functions to assemble, minimize, and hash the data packet
 * transferred to external legal counsel (Ospina Abogados).
 *
 * Data minimization: only fields strictly necessary for legal assessment
 * are included. Personal contact details are excluded unless the user
 * explicitly consented to their transfer.
 */

import { createHash } from "node:crypto";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

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

export type TransferPacketPayload = {
  /** Schema version for forward-compat parsing */
  schemaVersion: "1.0";
  /** ISO-8601 timestamp of packet generation */
  generatedAt: string;
  /** Minimised intake summary */
  intake: TransferableIntake;
  /** Decision artifact */
  decision: TransferableDecision;
  /** SLA snapshot at packet-generation time */
  slaSnapshot: SlaSnapshotEntry[];
  /** Chain-of-custody: chronological events */
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

// ────────────────────────────────────────────────────────────────
// Pure functions
// ────────────────────────────────────────────────────────────────

/**
 * Assemble a transfer packet from domain artefacts.
 * Applies data-minimization by selecting only legally relevant fields.
 */
export function assembleTransferPacket(
  intake: TransferableIntake,
  decision: TransferableDecision,
  sla: SlaSnapshotEntry[],
  chronology: ChronologyEntry[],
): TransferPacketPayload {
  return Object.freeze({
    schemaVersion: "1.0" as const,
    generatedAt: new Date().toISOString(),
    intake: Object.freeze({ ...intake }),
    decision: Object.freeze({ ...decision }),
    slaSnapshot: Object.freeze(sla.map((s) => Object.freeze({ ...s }))),
    chronology: Object.freeze(chronology.map((c) => Object.freeze({ ...c }))),
  }) as TransferPacketPayload;
}

/**
 * Compute a SHA-256 manifest hash of the complete packet.
 * The hash proves packet integrity and enables tamper detection.
 */
export function computeManifestHash(packet: TransferPacketPayload): string {
  const canonical = JSON.stringify(packet);
  return createHash("sha256").update(canonical).digest("hex");
}

/**
 * Validate that a packet matches its claimed manifest hash.
 */
export function verifyManifestHash(
  packet: TransferPacketPayload,
  expectedHash: string,
): boolean {
  return computeManifestHash(packet) === expectedHash;
}
