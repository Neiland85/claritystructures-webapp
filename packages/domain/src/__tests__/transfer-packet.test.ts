import { describe, it, expect } from "vitest";
import {
  assembleTransferPacket,
  computeManifestHash,
  verifyManifestHash,
} from "../transfer-packet";
import type {
  ChronologyEntry,
  SlaSnapshotEntry,
  TransferableDecision,
  TransferableIntake,
  TransferPacketAssemblyOptions,
} from "../transfer-packet";

const sampleIntake: TransferableIntake = {
  intakeId: "intake-001",
  tone: "critical",
  route: "/contact/critical",
  priority: "critical",
  message: "Urgent harassment case requiring legal derivation",
  createdAt: new Date("2026-02-18T10:00:00Z"),
};

const sampleDecision: TransferableDecision = {
  modelVersion: "v2",
  rulesTriggered: ["high_urgency", "immediate_threat"],
  outcome: "critical",
  explanation: "High urgency with immediate threat indicators",
  decidedAt: new Date("2026-02-18T10:00:05Z"),
};

const sampleSla: SlaSnapshotEntry[] = [
  {
    milestone: "acknowledgment",
    deadlineAt: "2026-02-18T10:15:00Z",
    completedAt: "2026-02-18T10:02:00Z",
    status: "completed",
  },
  {
    milestone: "first_contact",
    deadlineAt: "2026-02-18T11:00:00Z",
    completedAt: null,
    status: "pending",
  },
];

const sampleChronology: ChronologyEntry[] = [
  {
    action: "intake_received",
    occurredAt: "2026-02-18T10:00:00Z",
  },
  {
    action: "priority_assessed",
    occurredAt: "2026-02-18T10:00:05Z",
    metadata: { priority: "critical" },
  },
];

const packetOptions: TransferPacketAssemblyOptions = {
  generatedAt: "2026-02-18T10:00:06.000Z",
  packetIdempotencyKey: "transfer_intake_001_v1",
};

function buildPacket() {
  return assembleTransferPacket(
    sampleIntake,
    sampleDecision,
    sampleSla,
    sampleChronology,
    packetOptions,
  );
}

describe("Transfer Packet", () => {
  describe("assembleTransferPacket", () => {
    it("should produce a frozen packet with schemaVersion 1.0", () => {
      const packet = buildPacket();

      expect(packet.schemaVersion).toBe("1.0");
      expect(packet.generatedAt).toBe(packetOptions.generatedAt);
      expect(packet.packetIdempotencyKey).toBe(
        packetOptions.packetIdempotencyKey,
      );
      expect(Object.isFrozen(packet)).toBe(true);
    });

    it("should include minimized intake data", () => {
      const packet = assembleTransferPacket(
        sampleIntake,
        sampleDecision,
        [],
        [],
        packetOptions,
      );

      expect(packet.intake.intakeId).toBe("intake-001");
      expect(packet.intake.tone).toBe("critical");
      expect(packet.intake.priority).toBe("critical");

      expect(packet.intake).not.toHaveProperty("email");
      expect(packet.intake).not.toHaveProperty("phone");
      expect(packet.intake).not.toHaveProperty("name");
    });

    it("should include decision artifact", () => {
      const packet = assembleTransferPacket(
        sampleIntake,
        sampleDecision,
        [],
        [],
        packetOptions,
      );

      expect(packet.decision.modelVersion).toBe("v2");
      expect(packet.decision.rulesTriggered).toEqual([
        "high_urgency",
        "immediate_threat",
      ]);
      expect(packet.decision.outcome).toBe("critical");
    });

    it("should include SLA snapshot and chronology", () => {
      const packet = buildPacket();

      expect(packet.slaSnapshot).toHaveLength(2);
      expect(packet.chronology).toHaveLength(2);
      expect(packet.slaSnapshot[0].milestone).toBe("acknowledgment");
      expect(packet.chronology[1].action).toBe("priority_assessed");
    });
  });

  describe("computeManifestHash", () => {
    it("should return a 64-char hex SHA-256 hash", () => {
      const hash = computeManifestHash(buildPacket());

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should be deterministic across repeated assembly", () => {
      const first = buildPacket();
      const second = buildPacket();

      expect(computeManifestHash(first)).toBe(computeManifestHash(second));
    });

    it("should change hash when packet generation identity changes", () => {
      const first = buildPacket();

      const second = assembleTransferPacket(
        sampleIntake,
        sampleDecision,
        sampleSla,
        sampleChronology,
        {
          ...packetOptions,
          generatedAt: "2026-02-18T10:00:07.000Z",
        },
      );

      expect(computeManifestHash(first)).not.toBe(computeManifestHash(second));
    });
  });

  describe("verifyManifestHash", () => {
    it("should return true for matching hash", () => {
      const packet = buildPacket();
      const hash = computeManifestHash(packet);

      expect(verifyManifestHash(packet, hash)).toBe(true);
    });

    it("should return false for non-matching hash", () => {
      expect(verifyManifestHash(buildPacket(), "badhash")).toBe(false);
    });
  });
});
