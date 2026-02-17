import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaSlaRepository } from "@claritystructures/infra-persistence";

const BASE_TIME = new Date("2026-02-17T12:00:00Z");

function createMockPrisma() {
  return {
    slaTimer: {
      createMany: vi.fn(async () => ({ count: 4 })),
      findUnique: vi.fn(async () => ({
        id: "sla-001",
        intakeId: "intake-001",
        milestone: "acknowledgment",
        deadlineAt: new Date("2026-02-17T12:15:00Z"),
        completedAt: null as Date | null,
        status: "pending",
        createdAt: BASE_TIME,
      })),
      update: vi.fn(async () => ({})),
      findMany: vi.fn(async () => [
        {
          id: "sla-001",
          intakeId: "intake-001",
          milestone: "acknowledgment",
          deadlineAt: new Date("2026-02-17T12:15:00Z"),
          completedAt: null as Date | null,
          status: "pending",
          createdAt: BASE_TIME,
        },
        {
          id: "sla-002",
          intakeId: "intake-001",
          milestone: "first_contact",
          deadlineAt: new Date("2026-02-17T13:00:00Z"),
          completedAt: null as Date | null,
          status: "pending",
          createdAt: BASE_TIME,
        },
      ]),
    },
  };
}

describe("PrismaSlaRepository", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let repo: PrismaSlaRepository;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    repo = new PrismaSlaRepository(mockPrisma as any);
  });

  describe("createTimers", () => {
    it("should create 4 SLA milestone timers", async () => {
      await repo.createTimers("intake-001", BASE_TIME);

      expect(mockPrisma.slaTimer.createMany).toHaveBeenCalledOnce();
      const call = (mockPrisma.slaTimer.createMany as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as {
        data: Array<{ milestone: string; intakeId: string; status: string }>;
      };
      expect(call.data).toHaveLength(4);
      expect(call.data[0].milestone).toBe("acknowledgment");
      expect(call.data[0].intakeId).toBe("intake-001");
      expect(call.data[0].status).toBe("pending");
    });

    it("should compute correct deadlines from decision timestamp", async () => {
      await repo.createTimers("intake-001", BASE_TIME);

      const call = (mockPrisma.slaTimer.createMany as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as { data: Array<{ deadlineAt: Date }> };
      const data = call.data;
      // acknowledgment: +15 min
      expect(data[0].deadlineAt).toEqual(new Date("2026-02-17T12:15:00Z"));
      // first_contact: +60 min
      expect(data[1].deadlineAt).toEqual(new Date("2026-02-17T13:00:00Z"));
      // containment_guidance: +120 min
      expect(data[2].deadlineAt).toEqual(new Date("2026-02-17T14:00:00Z"));
      // legal_escalation: +240 min
      expect(data[3].deadlineAt).toEqual(new Date("2026-02-17T16:00:00Z"));
    });
  });

  describe("completeMilestone", () => {
    it("should update timer with completedAt and resolved status", async () => {
      await repo.completeMilestone("intake-001", "acknowledgment");

      expect(mockPrisma.slaTimer.findUnique).toHaveBeenCalledWith({
        where: {
          intakeId_milestone: {
            intakeId: "intake-001",
            milestone: "acknowledgment",
          },
        },
      });
      expect(mockPrisma.slaTimer.update).toHaveBeenCalledWith({
        where: { id: "sla-001" },
        data: {
          completedAt: expect.any(Date),
          status: expect.stringMatching(/^(met|breached)$/),
        },
      });
    });

    it("should do nothing when timer is not found", async () => {
      mockPrisma.slaTimer.findUnique.mockResolvedValueOnce(null as never);

      await repo.completeMilestone("intake-999", "acknowledgment");

      expect(mockPrisma.slaTimer.update).not.toHaveBeenCalled();
    });
  });

  describe("findByIntakeId", () => {
    it("should return timers with resolved statuses", async () => {
      const result = await repo.findByIntakeId("intake-001");

      expect(result).toHaveLength(2);
      expect(result[0].milestone).toBe("acknowledgment");
      expect(result[1].milestone).toBe("first_contact");
    });
  });

  describe("findBreached", () => {
    it("should query for pending timers past their deadline", async () => {
      await repo.findBreached();

      expect(mockPrisma.slaTimer.findMany).toHaveBeenCalledWith({
        where: {
          status: "pending",
          deadlineAt: { lt: expect.any(Date) },
        },
        orderBy: { deadlineAt: "asc" },
      });
    });
  });
});
