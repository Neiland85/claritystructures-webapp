import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequestLegalDerivationUseCase } from "@/application/use-cases/request-legal-derivation.usecase";

function createMocks() {
  return {
    intakes: {
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAll: vi.fn(),
      findByEmail: vi.fn(),
      deleteByEmail: vi.fn(),
      findExpiredBefore: vi.fn(),
      deleteById: vi.fn(),
    },
    derivation: {
      recordConsent: vi.fn(),
      revokeConsent: vi.fn(),
      findByIntakeId: vi.fn(),
    },
    audit: { record: vi.fn() },
  };
}

describe("RequestLegalDerivationUseCase", () => {
  let mocks: ReturnType<typeof createMocks>;
  let useCase: RequestLegalDerivationUseCase;

  beforeEach(() => {
    mocks = createMocks();
    useCase = new RequestLegalDerivationUseCase(
      mocks.intakes,
      mocks.derivation,
      mocks.audit,
    );
  });

  it("should record consent and return consentId", async () => {
    mocks.intakes.findById.mockResolvedValue({
      id: "intake-001",
      tone: "critical",
    });
    mocks.derivation.findByIntakeId.mockResolvedValue(null);
    mocks.derivation.recordConsent.mockResolvedValue("consent-123");

    const result = await useCase.execute({
      intakeId: "intake-001",
      recipientEntity: "Ospina Abogados",
    });

    expect(result.consentId).toBe("consent-123");
    expect(mocks.derivation.recordConsent).toHaveBeenCalledWith({
      intakeId: "intake-001",
      recipientEntity: "Ospina Abogados",
      ipHash: undefined,
      userAgent: undefined,
    });
    expect(mocks.audit.record).toHaveBeenCalled();
  });

  it("should return existing consent if already active", async () => {
    mocks.intakes.findById.mockResolvedValue({ id: "intake-001" });
    mocks.derivation.findByIntakeId.mockResolvedValue({
      id: "existing-consent",
      revokedAt: null,
    });

    const result = await useCase.execute({
      intakeId: "intake-001",
      recipientEntity: "Ospina Abogados",
    });

    expect(result.consentId).toBe("existing-consent");
    expect(mocks.derivation.recordConsent).not.toHaveBeenCalled();
  });

  it("should throw when intake does not exist", async () => {
    mocks.intakes.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        intakeId: "nonexistent",
        recipientEntity: "Ospina Abogados",
      }),
    ).rejects.toThrow("Intake not found: nonexistent");
  });

  it("should not fail when audit throws", async () => {
    mocks.intakes.findById.mockResolvedValue({ id: "intake-001" });
    mocks.derivation.findByIntakeId.mockResolvedValue(null);
    mocks.derivation.recordConsent.mockResolvedValue("consent-456");
    mocks.audit.record.mockRejectedValue(new Error("Audit unreachable"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await useCase.execute({
      intakeId: "intake-001",
      recipientEntity: "Ospina Abogados",
    });

    expect(result.consentId).toBe("consent-456");
    consoleSpy.mockRestore();
  });
});
