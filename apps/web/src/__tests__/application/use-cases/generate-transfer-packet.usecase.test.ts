import { describe, it, expect, vi, beforeEach } from "vitest";
import { GenerateTransferPacketUseCase } from "@/application/use-cases/generate-transfer-packet.usecase";

function createMocks() {
  return {
    intakes: {
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAll: vi.fn(),
      findByEmail: vi.fn(),
      deleteByEmail: vi.fn(),
      findExpiredBefore: vi.fn(),
      deleteById: vi.fn(),
    },
    derivation: {
      recordConsent: vi.fn(),
      revokeConsent: vi.fn(),
      findByIntakeId: vi.fn(),
    },
    transferLog: {
      recordTransfer: vi.fn(),
      recordAcknowledgment: vi.fn(),
      findByIntakeId: vi.fn(),
    },
    sla: {
      createTimers: vi.fn(),
      completeMilestone: vi.fn(),
      findByIntakeId: vi.fn(),
      findBreached: vi.fn(),
    },
    audit: { record: vi.fn() },
  };
}

const sampleIntake = {
  id: "intake-001",
  tone: "critical",
  route: "/contact/critical",
  priority: "critical",
  message: "Harassment case",
  email: "victim@example.com",
  name: "Jane Doe",
  phone: "+34600000000",
  createdAt: new Date("2026-02-18T10:00:00Z"),
};

const sampleDecision = {
  modelVersion: "v2",
  rulesTriggered: ["high_urgency"],
  outcome: "critical",
  explanation: "High urgency detected",
  decidedAt: new Date("2026-02-18T10:00:05Z"),
};

describe("GenerateTransferPacketUseCase", () => {
  let mocks: ReturnType<typeof createMocks>;
  let useCase: GenerateTransferPacketUseCase;

  beforeEach(() => {
    mocks = createMocks();
    useCase = new GenerateTransferPacketUseCase(
      mocks.intakes,
      mocks.derivation,
      mocks.transferLog,
      mocks.sla,
      mocks.audit,
    );
  });

  it("should generate a transfer packet with manifest hash", async () => {
    mocks.intakes.findById.mockResolvedValue(sampleIntake);
    mocks.derivation.findByIntakeId.mockResolvedValue({
      id: "consent-001",
      recipientEntity: "Ospina Abogados",
      revokedAt: null,
    });
    mocks.sla.findByIntakeId.mockResolvedValue([
      {
        milestone: "acknowledgment",
        deadlineAt: new Date("2026-02-18T10:15:00Z"),
        completedAt: new Date("2026-02-18T10:02:00Z"),
        status: "completed",
      },
    ]);
    mocks.transferLog.recordTransfer.mockResolvedValue("transfer-001");

    const result = await useCase.execute({
      intakeId: "intake-001",
      decision: sampleDecision,
      chronology: [
        { action: "intake_received", occurredAt: "2026-02-18T10:00:00Z" },
      ],
    });

    expect(result.transferId).toBe("transfer-001");
    expect(result.manifestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.packet.schemaVersion).toBe("1.0");
    expect(result.packet.intake.intakeId).toBe("intake-001");
    // PII must NOT leak into packet
    expect(result.packet.intake).not.toHaveProperty("email");
    expect(result.packet.intake).not.toHaveProperty("name");
    expect(result.packet.intake).not.toHaveProperty("phone");
  });

  it("should throw when intake does not exist", async () => {
    mocks.intakes.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        intakeId: "nonexistent",
        decision: sampleDecision,
        chronology: [],
      }),
    ).rejects.toThrow("Intake not found");
  });

  it("should throw when no active derivation consent", async () => {
    mocks.intakes.findById.mockResolvedValue(sampleIntake);
    mocks.derivation.findByIntakeId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        intakeId: "intake-001",
        decision: sampleDecision,
        chronology: [],
      }),
    ).rejects.toThrow("No active derivation consent");
  });

  it("should throw when consent was revoked", async () => {
    mocks.intakes.findById.mockResolvedValue(sampleIntake);
    mocks.derivation.findByIntakeId.mockResolvedValue({
      id: "consent-001",
      revokedAt: new Date(),
    });

    await expect(
      useCase.execute({
        intakeId: "intake-001",
        decision: sampleDecision,
        chronology: [],
      }),
    ).rejects.toThrow("No active derivation consent");
  });

  it("should record transfer log with correct payload size", async () => {
    mocks.intakes.findById.mockResolvedValue(sampleIntake);
    mocks.derivation.findByIntakeId.mockResolvedValue({
      id: "consent-001",
      recipientEntity: "Ospina Abogados",
      revokedAt: null,
    });
    mocks.sla.findByIntakeId.mockResolvedValue([]);
    mocks.transferLog.recordTransfer.mockResolvedValue("transfer-002");

    await useCase.execute({
      intakeId: "intake-001",
      decision: sampleDecision,
      chronology: [],
    });

    expect(mocks.transferLog.recordTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        intakeId: "intake-001",
        recipientEntity: "Ospina Abogados",
        legalBasis: "explicit_consent",
        manifestHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        payloadSizeBytes: expect.any(Number),
      }),
    );
  });
});
