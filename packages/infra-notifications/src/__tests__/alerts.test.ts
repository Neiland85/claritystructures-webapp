import { describe, it, expect, vi, afterEach } from "vitest";
import { sendForensicIntakeEmail } from "../alerts";
import type { WizardResult, IntakeDecision } from "@claritystructures/domain";

// Mock nodemailer — vi.hoisted ensures mockSendMail is available before vi.mock hoists
const { mockSendMail } = vi.hoisted(() => ({
  mockSendMail: vi.fn().mockResolvedValue({ messageId: "alert-id" }),
}));
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({ sendMail: mockSendMail }),
  },
}));

const SAMPLE_WIZARD_RESULT: WizardResult = {
  clientProfile: "private_individual",
  urgency: "critical",
  physicalSafetyRisk: true,
  financialAssetRisk: false,
  attackerHasPasswords: true,
  evidenceIsAutoDeleted: false,
  hasEmotionalDistress: true,
  cognitiveProfile: {
    coherenceScore: 4,
    cognitiveDistortion: false,
    perceivedOmnipotenceOfAttacker: true,
    isInformationVerifiable: true,
    emotionalShockLevel: "medium",
  },
  narrativeTracing: {
    whatsappControlLoss: true,
    familySuspects: false,
    perceivedSurveillance: true,
  },
  incident: "Someone accessed my phone without permission",
  devices: 2,
  actionsTaken: ["changed_passwords"],
  evidenceSources: ["phone_screenshots"],
  objective: "forensic_analysis",
};

const SAMPLE_DECISION: IntakeDecision = {
  priority: "critical",
  route: "/contact/critical",
  actionCode: "IMMEDIATE_HUMAN_CONTACT",
  flags: ["emotional_distress", "family_conflict"],
  decisionModelVersion: "decision-model/v2",
};

describe("sendForensicIntakeEmail", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  it("should send an email with the forensic intake report as attachment", async () => {
    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
      userPhone: "+34 600 123 456",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining("Clarity Structures Engine"),
        to: expect.any(String),
        replyTo: "victim@example.com",
        subject: expect.stringContaining("CRITICAL"),
        text: expect.stringContaining("victim@example.com"),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            filename: expect.stringMatching(/^Informe_Forense_CRI-/),
            content: expect.stringContaining("CLARITY STRUCTURES"),
          }),
        ]),
      }),
    );
  });

  it("should use ALERT_EMAIL env var when set", async () => {
    process.env.ALERT_EMAIL = "perito@legal-firm.com";

    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "perito@legal-firm.com",
      }),
    );
  });

  it("should default to admin@claritystructures.com when ALERT_EMAIL is not set", async () => {
    delete process.env.ALERT_EMAIL;

    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@claritystructures.com",
      }),
    );
  });

  it("should include physical safety risk in the report when present", async () => {
    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    const attachment = mockSendMail.mock.calls[0]?.[0]?.attachments?.[0];
    expect(attachment?.content).toContain("NIVEL ALTO");
    expect(attachment?.content).toContain("CAMBIO CLAVES RECOMENDADO");
  });

  it("should handle missing optional phone gracefully", async () => {
    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    const attachment = mockSendMail.mock.calls[0]?.[0]?.attachments?.[0];
    expect(attachment?.content).toContain("No proporcionado");
  });

  it("should handle SMTP failure silently", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("Connection refused"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[CRITICAL]"),
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("should include cognitive profile in the report", async () => {
    await sendForensicIntakeEmail({
      result: SAMPLE_WIZARD_RESULT,
      decision: SAMPLE_DECISION,
      userEmail: "victim@example.com",
    });

    const attachment = mockSendMail.mock.calls[0]?.[0]?.attachments?.[0];
    expect(attachment?.content).toContain("Coherencia Inicial: 4");
    expect(attachment?.content).toContain("MEDIUM");
  });
});
