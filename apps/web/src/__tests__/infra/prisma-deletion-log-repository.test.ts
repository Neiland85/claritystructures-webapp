import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaDeletionLogRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

const SAMPLE_DELETION_ROW = {
  id: "del-001",
  intakeId: "intake-001",
  reason: "Retention period expired (730 days)",
  trigger: "retention_policy" as const,
  deletedAt: BASE_TIME,
};

function createMockPrisma() {
  return {
    deletionLog: {
      create: vi.fn(async () => SAMPLE_DELETION_ROW),
      findMany: vi.fn(async () => [SAMPLE_DELETION_ROW]),
    },
  };
}

describe("PrismaDeletionLogRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaDeletionLogRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaDeletionLogRepository(mockPrisma as any);
  });

  describe("record", () => {
    it("should create a deletion log entry", async () => {
      await repo.record({
        intakeId: "intake-001",
        reason: "Retention period expired (730 days)",
        trigger: "retention_policy",
      });

      expect(mockPrisma.deletionLog.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-001",
          reason: "Retention period expired (730 days)",
          trigger: "retention_policy",
        },
      });
    });
  });

  describe("findByIntakeId", () => {
    it("should return deletion log summaries for an intake", async () => {
      const results = await repo.findByIntakeId("intake-001");

      expect(mockPrisma.deletionLog.findMany).toHaveBeenCalledWith({
        where: { intakeId: "intake-001" },
        orderBy: { deletedAt: "desc" },
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe("del-001");
      expect(results[0]?.reason).toBe("Retention period expired (730 days)");
      expect(results[0]?.trigger).toBe("retention_policy");
    });

    it("should return empty array when no deletion logs exist", async () => {
      mockPrisma.deletionLog.findMany.mockResolvedValueOnce([]);

      const results = await repo.findByIntakeId("intake-999");

      expect(results).toEqual([]);
    });
  });
});
