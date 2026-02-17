import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteUserDataUseCase } from "@/application/use-cases/delete-user-data.usecase";
import type { IntakeRepository, AuditTrail } from "@claritystructures/domain";

describe("DeleteUserDataUseCase", () => {
  const mockRepo: IntakeRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
    findAll: vi.fn(),
    findByEmail: vi.fn(),
    deleteByEmail: vi.fn(),
  };

  const mockAudit: AuditTrail = {
    record: vi.fn(),
  };

  let useCase: DeleteUserDataUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DeleteUserDataUseCase(mockRepo, mockAudit);
  });

  it("should delete records and return count", async () => {
    vi.mocked(mockRepo.deleteByEmail).mockResolvedValue(3);

    const result = await useCase.execute("user@test.com");

    expect(result).toEqual({ deleted: 3 });
    expect(mockRepo.deleteByEmail).toHaveBeenCalledWith("user@test.com");
  });

  it("should return zero when no records found", async () => {
    vi.mocked(mockRepo.deleteByEmail).mockResolvedValue(0);

    const result = await useCase.execute("nobody@test.com");

    expect(result).toEqual({ deleted: 0 });
  });

  it("should record an audit event", async () => {
    vi.mocked(mockRepo.deleteByEmail).mockResolvedValue(5);

    await useCase.execute("user@test.com");

    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "arcopol_deletion_completed",
        metadata: { email: "user@test.com", intakesDeleted: 5 },
      }),
    );
  });
});
