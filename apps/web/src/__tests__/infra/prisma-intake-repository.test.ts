import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaIntakeRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

const SAMPLE_ROW = {
  id: "intake-001",
  createdAt: BASE_TIME,
  tone: "basic" as const,
  route: "/contact/basic",
  priority: "medium" as const,
  name: null,
  email: "alice@example.com",
  message: "Need help with forensics",
  phone: null,
  status: "pending" as const,
  spamScore: null,
  meta: null,
  suppressedAt: null,
  suppressionReason: null,
  suppressionTrigger: null,
};

function createMockPrisma() {
  return {
    contactIntake: {
      create: vi.fn(async () => SAMPLE_ROW),
      findUnique: vi.fn(async () => SAMPLE_ROW),
      findMany: vi.fn(async () => [SAMPLE_ROW]),
      update: vi.fn(async () => ({ ...SAMPLE_ROW, status: "accepted" })),
      deleteMany: vi.fn(async () => ({ count: 1 })),
      delete: vi.fn(async () => SAMPLE_ROW),
    },
  };
}

describe("PrismaIntakeRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaIntakeRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaIntakeRepository(mockPrisma as any);
  });

  describe("create", () => {
    it("should persist an intake and return a mapped record", async () => {
      const result = await repo.create({
        tone: "basic",
        route: "/contact/basic",
        priority: "medium",
        email: "alice@example.com",
        message: "Need help",
        status: "pending",
      });

      expect(mockPrisma.contactIntake.create).toHaveBeenCalledOnce();
      expect(result.id).toBe("intake-001");
      expect(result.email).toBe("alice@example.com");
    });

    it("should map null name/phone to undefined in the record", async () => {
      const result = await repo.create({
        tone: "basic",
        route: "/contact/basic",
        priority: "medium",
        email: "test@test.com",
        message: "Test",
        status: "pending",
      });

      expect(result.name).toBeUndefined();
      expect(result.phone).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("should return a mapped record when found", async () => {
      const result = await repo.findById("intake-001");

      expect(mockPrisma.contactIntake.findUnique).toHaveBeenCalledWith({
        where: { id: "intake-001" },
      });
      expect(result?.id).toBe("intake-001");
    });

    it("should return null when not found", async () => {
      mockPrisma.contactIntake.findUnique.mockResolvedValueOnce(null as never);

      const result = await repo.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return active records ordered by createdAt desc", async () => {
      const result = await repo.findAll();

      expect(mockPrisma.contactIntake.findMany).toHaveBeenCalledWith({
        where: { suppressedAt: null },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("updateStatus", () => {
    it("should update and return the modified record", async () => {
      const result = await repo.updateStatus("intake-001", "accepted");

      expect(result?.status).toBe("accepted");
      expect(mockPrisma.contactIntake.update).toHaveBeenCalledWith({
        where: { id: "intake-001" },
        data: { status: "accepted" },
      });
    });

    it("should return null when intake does not exist", async () => {
      mockPrisma.contactIntake.findUnique.mockResolvedValueOnce(null as never);

      const result = await repo.updateStatus("nonexistent", "accepted");

      expect(result).toBeNull();
      expect(mockPrisma.contactIntake.update).not.toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("should return active records matching the email", async () => {
      const result = await repo.findByEmail("alice@example.com");

      expect(mockPrisma.contactIntake.findMany).toHaveBeenCalledWith({
        where: { email: "alice@example.com", suppressedAt: null },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("deleteByEmail", () => {
    it("should suppress active intakes for an email", async () => {
      const count = await repo.deleteByEmail("alice@example.com");

      expect(mockPrisma.contactIntake.findMany).toHaveBeenCalledWith({
        where: { email: "alice@example.com", suppressedAt: null },
        select: { id: true },
      });

      expect(mockPrisma.contactIntake.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "intake-001" },
          data: expect.objectContaining({
            name: null,
            email: "suppressed+intake-001@suppressed.local",
            phone: null,
            message: "[suppressed]",
            suppressedAt: expect.any(Date),
            suppressionReason: "privacy_suppression",
            suppressionTrigger: "deleteById",
          }),
        }),
      );

      expect(mockPrisma.contactIntake.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.contactIntake.delete).not.toHaveBeenCalled();
      expect(count).toBe(1);
    });

    it("should return 0 when no active intakes found for email", async () => {
      mockPrisma.contactIntake.findMany.mockResolvedValueOnce([]);

      const count = await repo.deleteByEmail("nobody@example.com");

      expect(count).toBe(0);
      expect(mockPrisma.contactIntake.update).not.toHaveBeenCalled();
    });
  });

  describe("findExpiredBefore", () => {
    it("should query active intakes created before cutoff date", async () => {
      const cutoff = new Date("2025-01-01");

      await repo.findExpiredBefore(cutoff);

      expect(mockPrisma.contactIntake.findMany).toHaveBeenCalledWith({
        where: { createdAt: { lt: cutoff }, suppressedAt: null },
        orderBy: { createdAt: "asc" },
      });
    });

    it("should return mapped records", async () => {
      const cutoff = new Date("2027-01-01");
      const results = await repo.findExpiredBefore(cutoff);

      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe("intake-001");
      expect(results[0]?.name).toBeUndefined();
    });
  });

  describe("deleteById", () => {
    it("should suppress/anonymize the intake instead of physically deleting it", async () => {
      await repo.deleteById("intake-001");

      expect(mockPrisma.contactIntake.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "intake-001" },
          data: expect.objectContaining({
            name: null,
            email: "suppressed+intake-001@suppressed.local",
            phone: null,
            message: "[suppressed]",
            suppressedAt: expect.any(Date),
            suppressionReason: "privacy_suppression",
            suppressionTrigger: "deleteById",
          }),
        }),
      );

      expect(mockPrisma.contactIntake.delete).not.toHaveBeenCalled();
      expect(mockPrisma.contactIntake.deleteMany).not.toHaveBeenCalled();
    });
  });
});
