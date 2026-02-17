import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaConsentRepository } from "@claritystructures/infra-persistence";

function createMockPrisma() {
  return {
    consentAcceptance: {
      create: vi.fn(async () => ({
        id: "ca-001",
        consentVersionId: "cv-001",
        intakeId: "intake-001",
        acceptedAt: new Date(),
        ipHash: null,
        userAgent: null,
        locale: null,
      })),
    },
    consentVersion: {
      findUnique: vi.fn(async () => ({
        id: "cv-001",
        version: "v1",
      })),
      findFirst: vi.fn(async () => ({
        id: "cv-001",
        version: "v1",
      })),
    },
  };
}

describe("PrismaConsentRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaConsentRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaConsentRepository(mockPrisma as any);
  });

  describe("recordAcceptance", () => {
    it("should look up consent version and create acceptance record", async () => {
      await repo.recordAcceptance({
        intakeId: "intake-001",
        consentVersion: "v1",
        ipHash: "abc123",
        userAgent: "Mozilla/5.0",
        locale: "es-ES",
      });

      expect(mockPrisma.consentVersion.findUnique).toHaveBeenCalledWith({
        where: { version: "v1" },
        select: { id: true },
      });

      expect(mockPrisma.consentAcceptance.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-001",
          consentVersionId: "cv-001",
          ipHash: "abc123",
          userAgent: "Mozilla/5.0",
          locale: "es-ES",
        },
      });
    });

    it("should handle optional fields as null", async () => {
      await repo.recordAcceptance({
        intakeId: "intake-002",
        consentVersion: "v1",
      });

      expect(mockPrisma.consentAcceptance.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-002",
          consentVersionId: "cv-001",
          ipHash: null,
          userAgent: null,
          locale: null,
        },
      });
    });

    it("should skip recording when consent version is unknown", async () => {
      mockPrisma.consentVersion.findUnique.mockResolvedValueOnce(null as never);
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      await repo.recordAcceptance({
        intakeId: "intake-003",
        consentVersion: "v999",
      });

      expect(mockPrisma.consentAcceptance.create).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "[ConsentRepository] Unknown consent version: v999",
      );
      consoleSpy.mockRestore();
    });
  });

  describe("findActiveVersion", () => {
    it("should return the active consent version", async () => {
      const result = await repo.findActiveVersion();

      expect(result).toEqual({ id: "cv-001", version: "v1" });
      expect(mockPrisma.consentVersion.findFirst).toHaveBeenCalledWith({
        where: { isActive: true },
        select: { id: true, version: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return null when no active version exists", async () => {
      mockPrisma.consentVersion.findFirst.mockResolvedValueOnce(null as never);

      const result = await repo.findActiveVersion();

      expect(result).toBeNull();
    });
  });
});
