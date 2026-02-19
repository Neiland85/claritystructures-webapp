import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaTransferLogRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

const SAMPLE_TRANSFER_ROW = {
  id: "transfer-001",
  intakeId: "intake-001",
  recipientEntity: "Legal Corp SLU",
  manifestHash: "sha256-abc123",
  payloadSizeBytes: 4096,
  legalBasis: "GDPR Art. 6(1)(b)",
  transferredAt: BASE_TIME,
  acknowledgedAt: null as Date | null,
};

function createMockPrisma() {
  return {
    transferPacket: {
      create: vi.fn(async () => SAMPLE_TRANSFER_ROW),
      update: vi.fn(async () => ({
        ...SAMPLE_TRANSFER_ROW,
        acknowledgedAt: new Date(),
      })),
      findMany: vi.fn(async () => [SAMPLE_TRANSFER_ROW]),
    },
  };
}

describe("PrismaTransferLogRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaTransferLogRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaTransferLogRepository(mockPrisma as any);
  });

  describe("recordTransfer", () => {
    it("should create a transfer packet and return the id", async () => {
      const id = await repo.recordTransfer({
        intakeId: "intake-001",
        recipientEntity: "Legal Corp SLU",
        manifestHash: "sha256-abc123",
        payloadSizeBytes: 4096,
        legalBasis: "GDPR Art. 6(1)(b)",
      });

      expect(id).toBe("transfer-001");
      expect(mockPrisma.transferPacket.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-001",
          recipientEntity: "Legal Corp SLU",
          manifestHash: "sha256-abc123",
          payloadSizeBytes: 4096,
          legalBasis: "GDPR Art. 6(1)(b)",
        },
      });
    });
  });

  describe("recordAcknowledgment", () => {
    it("should set acknowledgedAt timestamp on the transfer", async () => {
      await repo.recordAcknowledgment("transfer-001");

      expect(mockPrisma.transferPacket.update).toHaveBeenCalledWith({
        where: { id: "transfer-001" },
        data: { acknowledgedAt: expect.any(Date) },
      });
    });
  });

  describe("findByIntakeId", () => {
    it("should return transfer log summaries for an intake", async () => {
      const results = await repo.findByIntakeId("intake-001");

      expect(mockPrisma.transferPacket.findMany).toHaveBeenCalledWith({
        where: { intakeId: "intake-001" },
        orderBy: { transferredAt: "desc" },
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe("transfer-001");
      expect(results[0]?.recipientEntity).toBe("Legal Corp SLU");
      expect(results[0]?.manifestHash).toBe("sha256-abc123");
      expect(results[0]?.legalBasis).toBe("GDPR Art. 6(1)(b)");
    });

    it("should return empty array when no transfers exist", async () => {
      mockPrisma.transferPacket.findMany.mockResolvedValueOnce([]);

      const results = await repo.findByIntakeId("intake-999");

      expect(results).toEqual([]);
    });
  });
});
