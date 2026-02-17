import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListIntakesUseCase } from "../../../application/use-cases/list-intakes.usecase";
import type { IntakeRepository, IntakeRecord } from "@claritystructures/domain";

// ── Mock adapter ───────────────────────────────────────────────

const SAMPLE_RECORDS: IntakeRecord[] = [
  {
    id: "intake-001",
    tone: "basic",
    route: "/contact/basic",
    priority: "medium",
    email: "alice@example.com",
    message: "Need help with device forensics",
    status: "pending",
    createdAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    id: "intake-002",
    tone: "critical",
    route: "/contact/critical",
    priority: "critical",
    email: "bob@example.com",
    message: "Active court proceeding",
    status: "pending",
    createdAt: new Date("2026-01-16T08:30:00Z"),
  },
];

function createMockRepository(
  records: IntakeRecord[] = SAMPLE_RECORDS,
): IntakeRepository {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(async () => records),
    updateStatus: vi.fn(),
    findByEmail: vi.fn(),
    deleteByEmail: vi.fn(),
  };
}

// ── Tests ──────────────────────────────────────────────────────

describe("ListIntakesUseCase", () => {
  let repo: IntakeRepository;
  let useCase: ListIntakesUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    useCase = new ListIntakesUseCase(repo);
  });

  it("should return all intakes from repository", async () => {
    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledOnce();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("intake-001");
    expect(result[1].id).toBe("intake-002");
  });

  it("should return empty array when no intakes exist", async () => {
    repo = createMockRepository([]);
    useCase = new ListIntakesUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should propagate repository errors", async () => {
    (repo.findAll as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Database unavailable"),
    );

    await expect(useCase.execute()).rejects.toThrow("Database unavailable");
  });

  it("should preserve record structure from repository", async () => {
    const result = await useCase.execute();

    const record = result[0];
    expect(record).toHaveProperty("id");
    expect(record).toHaveProperty("tone");
    expect(record).toHaveProperty("priority");
    expect(record).toHaveProperty("email");
    expect(record).toHaveProperty("message");
    expect(record).toHaveProperty("status");
    expect(record).toHaveProperty("createdAt");
  });
});
