import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  IntakeRepository,
  LegalHoldRepository,
  DeletionLogRepository,
  AuditTrail,
  IntakeRecord,
} from "@claritystructures/domain";
import { eventDispatcher } from "@claritystructures/domain";
import { PurgeExpiredIntakesUseCase } from "../../../application/use-cases/purge-expired-intakes.usecase";

function createMockIntakeRepo(): IntakeRepository {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
    findAll: vi.fn(),
    findByEmail: vi.fn(),
    deleteByEmail: vi.fn(),
    findExpiredBefore: vi.fn(),
    deleteById: vi.fn(),
  };
}

function createMockLegalHoldRepo(): LegalHoldRepository {
  return {
    place: vi.fn(),
    lift: vi.fn(),
    findActiveByIntakeId: vi.fn(),
    findAllActive: vi.fn(),
  };
}

function createMockDeletionLogRepo(): DeletionLogRepository {
  return {
    record: vi.fn(),
    findByIntakeId: vi.fn(),
  };
}

function createMockAudit(): AuditTrail {
  return { record: vi.fn(async () => {}) };
}

const EXPIRED_INTAKE: IntakeRecord = {
  id: "intake-old-001",
  createdAt: new Date("2023-01-01"),
  tone: "basic",
  route: "/contact/basic",
  priority: "low",
  email: "old@example.com",
  message: "Old intake",
  status: "pending",
};

const EXPIRED_INTAKE_2: IntakeRecord = {
  id: "intake-old-002",
  createdAt: new Date("2023-06-15"),
  tone: "legal",
  route: "/contact/legal",
  priority: "medium",
  email: "old2@example.com",
  message: "Another old intake",
  status: "accepted",
};

describe("PurgeExpiredIntakesUseCase", () => {
  let intakes: IntakeRepository;
  let legalHolds: LegalHoldRepository;
  let deletionLog: DeletionLogRepository;
  let audit: AuditTrail;
  let useCase: PurgeExpiredIntakesUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    eventDispatcher.clear();
    intakes = createMockIntakeRepo();
    legalHolds = createMockLegalHoldRepo();
    deletionLog = createMockDeletionLogRepo();
    audit = createMockAudit();
    useCase = new PurgeExpiredIntakesUseCase(
      intakes,
      legalHolds,
      deletionLog,
      audit,
    );
  });

  it("should purge expired intakes without legal holds", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([EXPIRED_INTAKE]);
    vi.mocked(legalHolds.findActiveByIntakeId).mockResolvedValue(null);

    const result = await useCase.execute("intake_data");

    expect(result.purged).toBe(1);
    expect(result.skippedLegalHold).toBe(0);
    expect(result.category).toBe("intake_data");
    expect(deletionLog.record).toHaveBeenCalledWith({
      intakeId: "intake-old-001",
      reason: "retention_policy:intake_data",
      trigger: "retention_policy",
    });
    expect(intakes.deleteById).toHaveBeenCalledWith("intake-old-001");
  });

  it("should skip intakes under legal hold", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([EXPIRED_INTAKE]);
    vi.mocked(legalHolds.findActiveByIntakeId).mockResolvedValue({
      id: "hold-001",
      intakeId: "intake-old-001",
      reason: "Court order",
      placedBy: "admin@clarity.com",
      createdAt: new Date(),
      liftedAt: null,
    });

    const result = await useCase.execute("intake_data");

    expect(result.purged).toBe(0);
    expect(result.skippedLegalHold).toBe(1);
    expect(intakes.deleteById).not.toHaveBeenCalled();
    expect(deletionLog.record).not.toHaveBeenCalled();
  });

  it("should handle mixed purge and skip scenarios", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([
      EXPIRED_INTAKE,
      EXPIRED_INTAKE_2,
    ]);
    vi.mocked(legalHolds.findActiveByIntakeId)
      .mockResolvedValueOnce({
        id: "hold-001",
        intakeId: "intake-old-001",
        reason: "Investigation",
        placedBy: "admin@clarity.com",
        createdAt: new Date(),
        liftedAt: null,
      })
      .mockResolvedValueOnce(null);

    const result = await useCase.execute("intake_data");

    expect(result.purged).toBe(1);
    expect(result.skippedLegalHold).toBe(1);
    expect(intakes.deleteById).toHaveBeenCalledWith("intake-old-002");
    expect(intakes.deleteById).not.toHaveBeenCalledWith("intake-old-001");
  });

  it("should handle no expired intakes gracefully", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([]);

    const result = await useCase.execute("intake_data");

    expect(result.purged).toBe(0);
    expect(result.skippedLegalHold).toBe(0);
    expect(intakes.deleteById).not.toHaveBeenCalled();
  });

  it("should record audit event after purge run", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([EXPIRED_INTAKE]);
    vi.mocked(legalHolds.findActiveByIntakeId).mockResolvedValue(null);

    await useCase.execute("unqualified_leads");

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "retention_purge_completed",
        metadata: expect.objectContaining({
          category: "unqualified_leads",
          purged: 1,
          skippedLegalHold: 0,
          totalExpired: 1,
        }),
      }),
    );
  });

  it("should use correct retention category cutoff", async () => {
    vi.mocked(intakes.findExpiredBefore).mockResolvedValue([]);

    const now = new Date("2026-02-18T10:00:00Z");
    await useCase.execute("unqualified_leads", now);

    // unqualified_leads = 6 months, so cutoff should be ~2025-08-18
    const callArg = vi.mocked(intakes.findExpiredBefore).mock.calls[0][0];
    expect(callArg.getFullYear()).toBe(2025);
    expect(callArg.getMonth()).toBe(7); // August (0-indexed)
  });
});
