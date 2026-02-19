import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaLegalHoldRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

const SAMPLE_HOLD_ROW = {
  id: "hold-001",
  intakeId: "intake-001",
  reason: "Ongoing litigation – case ref 2026/1234",
  placedBy: "legal-team@claritystructures.com",
  createdAt: BASE_TIME,
  liftedAt: null as Date | null,
};

function createMockPrisma() {
  return {
    legalHold: {
      create: vi.fn(async () => SAMPLE_HOLD_ROW),
      update: vi.fn(async () => ({
        ...SAMPLE_HOLD_ROW,
        liftedAt: new Date(),
      })),
      findFirst: vi.fn(async () => SAMPLE_HOLD_ROW),
      findMany: vi.fn(async () => [SAMPLE_HOLD_ROW]),
    },
  };
}

describe("PrismaLegalHoldRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaLegalHoldRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaLegalHoldRepository(mockPrisma as any);
  });

  describe("place", () => {
    it("should create a legal hold and return the id", async () => {
      const id = await repo.place({
        intakeId: "intake-001",
        reason: "Ongoing litigation – case ref 2026/1234",
        placedBy: "legal-team@claritystructures.com",
      });

      expect(id).toBe("hold-001");
      expect(mockPrisma.legalHold.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-001",
          reason: "Ongoing litigation – case ref 2026/1234",
          placedBy: "legal-team@claritystructures.com",
        },
      });
    });
  });

  describe("lift", () => {
    it("should set liftedAt timestamp on the hold", async () => {
      await repo.lift("hold-001");

      expect(mockPrisma.legalHold.update).toHaveBeenCalledWith({
        where: { id: "hold-001" },
        data: { liftedAt: expect.any(Date) },
      });
    });
  });

  describe("findActiveByIntakeId", () => {
    it("should return the active hold for an intake", async () => {
      const result = await repo.findActiveByIntakeId("intake-001");

      expect(mockPrisma.legalHold.findFirst).toHaveBeenCalledWith({
        where: { intakeId: "intake-001", liftedAt: null },
        orderBy: { createdAt: "desc" },
      });
      expect(result?.id).toBe("hold-001");
      expect(result?.reason).toBe("Ongoing litigation – case ref 2026/1234");
      expect(result?.placedBy).toBe("legal-team@claritystructures.com");
    });

    it("should return null when no active hold exists", async () => {
      mockPrisma.legalHold.findFirst.mockResolvedValueOnce(null as never);

      const result = await repo.findActiveByIntakeId("intake-999");

      expect(result).toBeNull();
    });
  });

  describe("findAllActive", () => {
    it("should return all active holds", async () => {
      const results = await repo.findAllActive();

      expect(mockPrisma.legalHold.findMany).toHaveBeenCalledWith({
        where: { liftedAt: null },
        orderBy: { createdAt: "desc" },
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe("hold-001");
    });

    it("should return empty array when no active holds exist", async () => {
      mockPrisma.legalHold.findMany.mockResolvedValueOnce([]);

      const results = await repo.findAllActive();

      expect(results).toEqual([]);
    });
  });
});
