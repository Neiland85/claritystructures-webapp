import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubmitIntakeUseCase } from "../../../application/use-cases/submit-intake.usecase";
import type {
  IntakeRepository,
  Notifier,
  AuditTrail,
  IntakeRecord,
  ContactIntakeInput,
} from "@claritystructures/domain";

// ── Mock adapters ──────────────────────────────────────────────

function createMockRepository(): IntakeRepository {
  return {
    create: vi.fn(
      async (input: ContactIntakeInput): Promise<IntakeRecord> => ({
        ...input,
        id: "intake-001",
        createdAt: new Date("2026-01-01T00:00:00Z"),
      }),
    ),
    findById: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(),
    findByEmail: vi.fn(),
    deleteByEmail: vi.fn(),
  };
}

function createMockNotifier(): Notifier {
  return {
    notifyIntakeReceived: vi.fn(async () => {}),
  };
}

function createMockAudit(): AuditTrail {
  return {
    record: vi.fn(async () => {}),
  };
}

// ── Fixtures ───────────────────────────────────────────────────

const BASE_INPUT = {
  tone: "basic" as const,
  email: "test@example.com",
  message: "I need legal help with a digital forensics case",
  phone: "+34600000000",
  status: "pending" as const,
  meta: {
    objective: "contact",
    incident: "I need legal help with a digital forensics case",
    clientProfile: "private_individual" as const,
    urgency: "informational" as const,
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
  },
};

const CRITICAL_INPUT = {
  tone: "critical" as const,
  email: "urgent@example.com",
  message: "Active court proceeding, evidence at risk",
  status: "pending" as const,
  meta: {
    objective: "urgent_action",
    incident: "Active court proceeding, evidence at risk",
    clientProfile: "court_related" as const,
    urgency: "critical" as const,
    devices: 5,
    actionsTaken: ["police_report"],
    evidenceSources: ["mobile", "cloud"],
  },
};

// ── Tests ──────────────────────────────────────────────────────

describe("SubmitIntakeUseCase", () => {
  let repo: IntakeRepository;
  let notifier: Notifier;
  let audit: AuditTrail;
  let useCase: SubmitIntakeUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    notifier = createMockNotifier();
    audit = createMockAudit();
    useCase = new SubmitIntakeUseCase(repo, notifier, audit);
  });

  it("should persist intake with decision-engine computed priority and route", async () => {
    const { record, decision } = await useCase.execute(BASE_INPUT);

    // Repository was called with decision-engine overrides
    expect(repo.create).toHaveBeenCalledOnce();
    const createArg = (repo.create as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(createArg.priority).toBe(decision.decision.priority);
    expect(createArg.route).toBe(decision.decision.route);

    // Record returned from repository
    expect(record.id).toBe("intake-001");
    expect(record.email).toBe("test@example.com");
  });

  it("should return a frozen decision with model version", async () => {
    const { decision } = await useCase.execute(BASE_INPUT);

    expect(decision).toBeDefined();
    expect(decision.decision).toBeDefined();
    expect(decision.decision.priority).toBeDefined();
    expect(decision.decision.route).toBeDefined();
    expect(decision.decision.decisionModelVersion).toMatch(
      /^decision-model\/v/,
    );
  });

  it("should trigger notification after persisting", async () => {
    await useCase.execute(BASE_INPUT);

    expect(notifier.notifyIntakeReceived).toHaveBeenCalledOnce();
    const notified = (notifier.notifyIntakeReceived as ReturnType<typeof vi.fn>)
      .mock.calls[0][0];
    expect(notified.id).toBe("intake-001");
  });

  it("should record audit event after persisting", async () => {
    await useCase.execute(BASE_INPUT);

    expect(audit.record).toHaveBeenCalledOnce();
    const event = (audit.record as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(event.action).toBe("intake_submitted");
    expect(event.intakeId).toBe("intake-001");
    expect(event.metadata).toHaveProperty("priority");
    expect(event.metadata).toHaveProperty("route");
    expect(event.metadata).toHaveProperty("modelVersion");
  });

  it("should NOT fail when notification throws", async () => {
    (
      notifier.notifyIntakeReceived as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("SMTP down"));

    // Should not throw — intake is the primary goal
    const { record } = await useCase.execute(BASE_INPUT);
    expect(record.id).toBe("intake-001");
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it("should NOT fail when audit throws", async () => {
    (audit.record as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Audit service unreachable"),
    );

    const { record } = await useCase.execute(BASE_INPUT);
    expect(record.id).toBe("intake-001");
  });

  it("should build fallback WizardResult when meta is null", async () => {
    const inputWithoutMeta = {
      ...BASE_INPUT,
      meta: undefined,
    };

    const { decision } = await useCase.execute(inputWithoutMeta);

    // Should still produce a valid decision (fallback wizard result)
    expect(decision.decision.priority).toBeDefined();
    expect(decision.decision.route).toBeDefined();
  });

  it("should propagate repository errors", async () => {
    (repo.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("DB connection lost"),
    );

    await expect(useCase.execute(BASE_INPUT)).rejects.toThrow(
      "DB connection lost",
    );
  });

  it("should handle critical intake with elevated priority", async () => {
    const { decision } = await useCase.execute(CRITICAL_INPUT);

    // Critical urgency + court_related should produce high/critical priority
    expect(["high", "critical"]).toContain(decision.decision.priority);
  });
});
