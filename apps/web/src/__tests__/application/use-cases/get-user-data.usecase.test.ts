import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetUserDataUseCase } from "@/application/use-cases/get-user-data.usecase";
import type { IntakeRepository, AuditTrail } from "@claritystructures/domain";

describe("GetUserDataUseCase", () => {
  const mockRepo: IntakeRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
    findAll: vi.fn(),
    findByEmail: vi.fn(),
    deleteByEmail: vi.fn(),
    findExpiredBefore: vi.fn(),
    deleteById: vi.fn(),
  };

  const mockAudit: AuditTrail = {
    record: vi.fn(),
  };

  let useCase: GetUserDataUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetUserDataUseCase(mockRepo, mockAudit);
  });

  it("should return intakes for the given email", async () => {
    const intakes = [
      {
        id: "i-1",
        email: "user@test.com",
        createdAt: new Date(),
        tone: "basic" as const,
        route: "/contact/basic",
        priority: "medium" as const,
        message: "Help",
        status: "pending" as const,
      },
    ];
    vi.mocked(mockRepo.findByEmail).mockResolvedValue(intakes);

    const result = await useCase.execute("user@test.com");

    expect(result).toEqual(intakes);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("user@test.com");
  });

  it("should return empty array when no data found", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([]);

    const result = await useCase.execute("nobody@test.com");

    expect(result).toEqual([]);
  });

  it("should record an audit event", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([]);

    await useCase.execute("user@test.com");

    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "arcopol_access_requested",
        metadata: { email: "user@test.com", recordsFound: 0 },
      }),
    );
  });
});
