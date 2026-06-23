import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteUserDataUseCase } from "@/application/use-cases/delete-user-data.usecase";
import type {
  IntakeRepository,
  AuditTrail,
  LegalHoldRepository,
  DeletionLogRepository,
  IntakeRecord,
} from "@claritystructures/domain";

const INTAKE: IntakeRecord = {
  id: "intake-001",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  tone: "basic",
  route: "/contact/basic",
  priority: "medium",
  email: "user@test.com",
  message: "message",
  status: "pending",
};

describe("DeleteUserDataUseCase", () => {
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

  const mockLegalHolds: LegalHoldRepository = {
    place: vi.fn(),
    lift: vi.fn(),
    findActiveByIntakeId: vi.fn(),
    findAllActive: vi.fn(),
  };

  const mockDeletionLog: DeletionLogRepository = {
    record: vi.fn(),
    findByIntakeId: vi.fn(),
  };

  const mockAudit: AuditTrail = {
    record: vi.fn(),
  };

  let useCase: DeleteUserDataUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DeleteUserDataUseCase(
      mockRepo,
      mockLegalHolds,
      mockDeletionLog,
      mockAudit,
    );
  });

  it("should suppress matching records and return count", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([INTAKE]);
    vi.mocked(mockLegalHolds.findActiveByIntakeId).mockResolvedValue(null);

    const result = await useCase.execute("user@test.com");

    expect(result).toEqual({ suppressed: 1, skippedLegalHold: 0 });
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("user@test.com");
    expect(mockDeletionLog.record).toHaveBeenCalledWith({
      intakeId: "intake-001",
      reason: "data_subject_request",
      trigger: "user_request",
    });
    expect(mockRepo.deleteById).toHaveBeenCalledWith("intake-001");
    expect(mockRepo.deleteByEmail).not.toHaveBeenCalled();
  });

  it("should return zero when no records found", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([]);

    const result = await useCase.execute("nobody@test.com");

    expect(result).toEqual({ suppressed: 0, skippedLegalHold: 0 });
    expect(mockRepo.deleteById).not.toHaveBeenCalled();
    expect(mockDeletionLog.record).not.toHaveBeenCalled();
  });

  it("should skip records under active legal hold", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([INTAKE]);
    vi.mocked(mockLegalHolds.findActiveByIntakeId).mockResolvedValue({
      id: "hold-001",
      intakeId: "intake-001",
      reason: "court_order",
      placedBy: "admin",
      createdAt: new Date(),
      liftedAt: null,
    });

    const result = await useCase.execute("user@test.com");

    expect(result).toEqual({ suppressed: 0, skippedLegalHold: 1 });
    expect(mockRepo.deleteById).not.toHaveBeenCalled();
    expect(mockDeletionLog.record).not.toHaveBeenCalled();
  });

  it("should record an audit event", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue([INTAKE]);
    vi.mocked(mockLegalHolds.findActiveByIntakeId).mockResolvedValue(null);

    await useCase.execute("user@test.com");

    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "arcopol_suppression_completed",
        metadata: {
          email: "user@test.com",
          recordsFound: 1,
          suppressed: 1,
          skippedLegalHold: 0,
        },
      }),
    );
  });
});
