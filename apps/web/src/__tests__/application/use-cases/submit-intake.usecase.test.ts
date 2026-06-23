import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SubmitIntakeUseCase,
  MissingConsentError,
  NoActiveConsentVersionError,
  InactiveConsentVersionError,
} from "../../../application/use-cases/submit-intake.usecase";
import type {
  IntakeRepository,
  Notifier,
  AuditTrail,
  IntakeRecord,
  ContactIntakeInput,
  ConsentRepository,
} from "@claritystructures/domain";

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
    findExpiredBefore: vi.fn(),
    deleteById: vi.fn(),
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

function createMockConsent(): ConsentRepository {
  return {
    recordAcceptance: vi.fn(async () => {}),
    findActiveVersion: vi.fn(async () => ({ id: "cv-001", version: "v1" })),
  };
}

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

const CONSENT_META = {
  consentVersion: "v1",
  ipHash: "ip-hash",
  userAgent: "test-agent",
  locale: "es-ES",
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

describe("SubmitIntakeUseCase", () => {
  let repo: IntakeRepository;
  let notifier: Notifier;
  let audit: AuditTrail;
  let consent: ConsentRepository;
  let useCase: SubmitIntakeUseCase;

  beforeEach(() => {
    repo = createMockRepository();
    notifier = createMockNotifier();
    audit = createMockAudit();
    consent = createMockConsent();
    useCase = new SubmitIntakeUseCase(repo, notifier, audit, consent);
  });

  it("should persist intake with decision-engine computed priority and route", async () => {
    const { record, decision } = await useCase.execute(
      BASE_INPUT,
      CONSENT_META,
    );

    expect(repo.create).toHaveBeenCalledOnce();
    const createArg = (repo.create as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(createArg.priority).toBe(decision.decision.priority);
    expect(createArg.route).toBe(decision.decision.route);
    expect(record.id).toBe("intake-001");
    expect(record.email).toBe("test@example.com");
  });

  it("should record consent before returning success", async () => {
    await useCase.execute(BASE_INPUT, CONSENT_META);

    expect(consent.findActiveVersion).toHaveBeenCalledOnce();
    expect(consent.recordAcceptance).toHaveBeenCalledWith({
      intakeId: "intake-001",
      consentVersion: "v1",
      ipHash: "ip-hash",
      userAgent: "test-agent",
      locale: "es-ES",
    });
  });

  it("should fail before creating intake when consent metadata is missing", async () => {
    await expect(useCase.execute(BASE_INPUT)).rejects.toBeInstanceOf(
      MissingConsentError,
    );

    expect(repo.create).not.toHaveBeenCalled();
  });

  it("should fail before creating intake when no active consent version exists", async () => {
    vi.mocked(consent.findActiveVersion).mockResolvedValueOnce(null);

    await expect(
      useCase.execute(BASE_INPUT, CONSENT_META),
    ).rejects.toBeInstanceOf(NoActiveConsentVersionError);

    expect(repo.create).not.toHaveBeenCalled();
  });

  it("should fail before creating intake when submitted consent version is not active", async () => {
    vi.mocked(consent.findActiveVersion).mockResolvedValueOnce({
      id: "cv-002",
      version: "v2",
    });

    await expect(
      useCase.execute(BASE_INPUT, CONSENT_META),
    ).rejects.toBeInstanceOf(InactiveConsentVersionError);

    expect(repo.create).not.toHaveBeenCalled();
  });

  it("should suppress intake if consent recording fails after creation", async () => {
    vi.mocked(consent.recordAcceptance).mockRejectedValueOnce(
      new Error("Consent DB down"),
    );

    await expect(useCase.execute(BASE_INPUT, CONSENT_META)).rejects.toThrow(
      "Consent DB down",
    );

    expect(repo.create).toHaveBeenCalledOnce();
    expect(repo.deleteById).toHaveBeenCalledWith("intake-001");
    expect(notifier.notifyIntakeReceived).not.toHaveBeenCalled();
  });

  it("should return a frozen decision with model version", async () => {
    const { decision } = await useCase.execute(BASE_INPUT, CONSENT_META);

    expect(decision).toBeDefined();
    expect(decision.decision).toBeDefined();
    expect(decision.decision.priority).toBeDefined();
    expect(decision.decision.route).toBeDefined();
    expect(decision.decision.decisionModelVersion).toMatch(
      /^decision-model\/v/,
    );
  });

  it("should trigger notification after persisting and consent acceptance", async () => {
    await useCase.execute(BASE_INPUT, CONSENT_META);

    expect(notifier.notifyIntakeReceived).toHaveBeenCalledOnce();
    const notified = (notifier.notifyIntakeReceived as ReturnType<typeof vi.fn>)
      .mock.calls[0][0];
    expect(notified.id).toBe("intake-001");
  });

  it("should record audit event after persisting", async () => {
    await useCase.execute(BASE_INPUT, CONSENT_META);

    expect(audit.record).toHaveBeenCalledOnce();
    const event = (audit.record as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(event.action).toBe("intake_submitted");
    expect(event.intakeId).toBe("intake-001");
    expect(event.metadata).toHaveProperty("priority");
    expect(event.metadata).toHaveProperty("route");
    expect(event.metadata).toHaveProperty("modelVersion");
    expect(event.metadata).toHaveProperty("governanceEnvelope");
    expect(event.metadata).toHaveProperty("consentVersion", "v1");
  });

  it("should NOT fail when notification throws", async () => {
    (
      notifier.notifyIntakeReceived as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("SMTP down"));

    const { record } = await useCase.execute(BASE_INPUT, CONSENT_META);
    expect(record.id).toBe("intake-001");
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it("should NOT fail when audit throws", async () => {
    (audit.record as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Audit service unreachable"),
    );

    const { record } = await useCase.execute(BASE_INPUT, CONSENT_META);
    expect(record.id).toBe("intake-001");
  });

  it("should build fallback WizardResult when meta is null", async () => {
    const inputWithoutMeta = {
      ...BASE_INPUT,
      meta: undefined,
    };

    const { decision } = await useCase.execute(inputWithoutMeta, CONSENT_META);

    expect(decision.decision.priority).toBeDefined();
    expect(decision.decision.route).toBeDefined();
  });

  it("should propagate repository errors", async () => {
    (repo.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("DB connection lost"),
    );

    await expect(useCase.execute(BASE_INPUT, CONSENT_META)).rejects.toThrow(
      "DB connection lost",
    );
  });

  it("should handle critical intake with elevated priority", async () => {
    const { decision } = await useCase.execute(CRITICAL_INPUT, CONSENT_META);

    expect(["high", "critical"]).toContain(decision.decision.priority);
  });
});
