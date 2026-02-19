import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaLegalDerivationRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

const SAMPLE_CONSENT_ROW = {
  id: "consent-001",
  intakeId: "intake-001",
  recipientEntity: "Legal Corp SLU",
  consentedAt: BASE_TIME,
  revokedAt: null as Date | null,
  ipHash: "abc123",
  userAgent: "Mozilla/5.0",
};

function createMockPrisma() {
  return {
    derivationConsent: {
      create: vi.fn(async () => SAMPLE_CONSENT_ROW),
      update: vi.fn(async () => ({
        ...SAMPLE_CONSENT_ROW,
        revokedAt: new Date(),
      })),
      findFirst: vi.fn(async () => SAMPLE_CONSENT_ROW),
    },
  };
}

describe("PrismaLegalDerivationRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaLegalDerivationRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaLegalDerivationRepository(mockPrisma as any);
  });

  describe("recordConsent", () => {
    it("should create a consent record and return the id", async () => {
      const id = await repo.recordConsent({
        intakeId: "intake-001",
        recipientEntity: "Legal Corp SLU",
        ipHash: "abc123",
        userAgent: "Mozilla/5.0",
      });

      expect(id).toBe("consent-001");
      expect(mockPrisma.derivationConsent.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-001",
          recipientEntity: "Legal Corp SLU",
          ipHash: "abc123",
          userAgent: "Mozilla/5.0",
        },
      });
    });

    it("should handle missing optional fields as null", async () => {
      await repo.recordConsent({
        intakeId: "intake-002",
        recipientEntity: "Another Corp",
      });

      expect(mockPrisma.derivationConsent.create).toHaveBeenCalledWith({
        data: {
          intakeId: "intake-002",
          recipientEntity: "Another Corp",
          ipHash: null,
          userAgent: null,
        },
      });
    });
  });

  describe("revokeConsent", () => {
    it("should set revokedAt timestamp on the consent", async () => {
      await repo.revokeConsent("consent-001");

      expect(mockPrisma.derivationConsent.update).toHaveBeenCalledWith({
        where: { id: "consent-001" },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("findByIntakeId", () => {
    it("should return the active consent for an intake", async () => {
      const result = await repo.findByIntakeId("intake-001");

      expect(mockPrisma.derivationConsent.findFirst).toHaveBeenCalledWith({
        where: { intakeId: "intake-001", revokedAt: null },
        orderBy: { consentedAt: "desc" },
      });
      expect(result?.id).toBe("consent-001");
      expect(result?.recipientEntity).toBe("Legal Corp SLU");
    });

    it("should return null when no active consent exists", async () => {
      mockPrisma.derivationConsent.findFirst.mockResolvedValueOnce(
        null as never,
      );

      const result = await repo.findByIntakeId("intake-999");

      expect(result).toBeNull();
    });
  });
});
