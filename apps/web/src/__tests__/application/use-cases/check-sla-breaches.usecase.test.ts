import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  SlaRepository,
  SlaTimerSummary,
  AuditTrail,
} from "@claritystructures/domain";
import { CheckSlaBreachesUseCase } from "../../../application/use-cases/check-sla-breaches.usecase";

function createMockSlaRepo(): SlaRepository {
  return {
    createTimers: vi.fn(),
    completeMilestone: vi.fn(),
    findByIntakeId: vi.fn(),
    findBreached: vi.fn(),
  };
}

function createMockAudit(): AuditTrail {
  return { record: vi.fn(async () => {}) };
}

const BREACHED_TIMER: SlaTimerSummary = {
  id: "sla-001",
  intakeId: "intake-critical-001",
  milestone: "acknowledgment",
  deadlineAt: new Date("2026-02-18T10:15:00Z"),
  completedAt: null,
  status: "breached",
};

const BREACHED_TIMER_2: SlaTimerSummary = {
  id: "sla-002",
  intakeId: "intake-critical-001",
  milestone: "first_contact",
  deadlineAt: new Date("2026-02-18T11:00:00Z"),
  completedAt: null,
  status: "breached",
};

describe("CheckSlaBreachesUseCase", () => {
  let sla: SlaRepository;
  let audit: AuditTrail;
  let useCase: CheckSlaBreachesUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    sla = createMockSlaRepo();
    audit = createMockAudit();
    useCase = new CheckSlaBreachesUseCase(sla, audit);
  });

  it("should return breached timers", async () => {
    vi.mocked(sla.findBreached).mockResolvedValue([
      BREACHED_TIMER,
      BREACHED_TIMER_2,
    ]);

    const result = await useCase.execute();

    expect(result.breached).toBe(2);
    expect(result.timers).toHaveLength(2);
    expect(result.timers[0].milestone).toBe("acknowledgment");
  });

  it("should record audit when breaches found", async () => {
    vi.mocked(sla.findBreached).mockResolvedValue([BREACHED_TIMER]);

    await useCase.execute();

    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "sla_breach_check_completed",
        metadata: expect.objectContaining({
          breachedCount: 1,
        }),
      }),
    );
  });

  it("should not record audit when no breaches", async () => {
    vi.mocked(sla.findBreached).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.breached).toBe(0);
    expect(result.timers).toHaveLength(0);
    expect(audit.record).not.toHaveBeenCalled();
  });
});
