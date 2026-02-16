import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateIntakeStatusUseCase } from "../../../application/use-cases/update-intake-status.usecase";
import type {
  IntakeRepository,
  AuditTrail,
  IntakeRecord,
} from "@claritystructures/domain";

// ── Mock adapters ──────────────────────────────────────────────

const EXISTING_RECORD: IntakeRecord = {
  id: "intake-001",
  tone: "basic",
  route: "/contact/basic",
  priority: "medium",
  email: "alice@example.com",
  message: "Need help with device forensics",
  status: "pending",
  createdAt: new Date("2026-01-15T10:00:00Z"),
};

function createMockRepository(): IntakeRepository {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(
      async (id: string, status: string): Promise<IntakeRecord | null> => {
        if (id === "intake-001") {
          return {
            ...EXISTING_RECORD,
            status: status as IntakeRecord["status"],
          };
        }
        return null;
      },
    ),
  };
}

function createMockAudit(): AuditTrail {
  return {
    record: vi.fn(async () => {}),
  };
}

// ── Tests ──────────────────────────────────────────────────────

describe("UpdateIntakeStatusUseCase", () => {
  let repo: IntakeRepository;
  let audit: AuditTrail;
  let useCase: UpdateIntakeStatusUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    audit = createMockAudit();
    useCase = new UpdateIntakeStatusUseCase(repo, audit);
  });

  it("should update status and return updated record", async () => {
    const result = await useCase.execute("intake-001", "accepted");

    expect(result).not.toBeNull();
    expect(result!.status).toBe("accepted");
    expect(repo.updateStatus).toHaveBeenCalledWith("intake-001", "accepted");
  });

  it("should record audit event on successful update", async () => {
    await useCase.execute("intake-001", "accepted");

    expect(audit.record).toHaveBeenCalledOnce();
    const event = (audit.record as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(event.action).toBe("intake_status_updated");
    expect(event.intakeId).toBe("intake-001");
    expect(event.metadata).toEqual({ status: "accepted" });
  });

  it("should return null when intake not found", async () => {
    const result = await useCase.execute("nonexistent-id", "accepted");

    expect(result).toBeNull();
  });

  it("should NOT record audit when intake not found", async () => {
    await useCase.execute("nonexistent-id", "accepted");

    expect(audit.record).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    (repo.updateStatus as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("DB write failed"),
    );

    await expect(useCase.execute("intake-001", "accepted")).rejects.toThrow(
      "DB write failed",
    );
  });

  it("should handle transition to rejected status", async () => {
    const result = await useCase.execute("intake-001", "rejected");

    expect(result).not.toBeNull();
    expect(result!.status).toBe("rejected");
  });
});
