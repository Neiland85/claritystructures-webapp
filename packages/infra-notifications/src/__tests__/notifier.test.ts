import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MailNotifier } from "../mail/notifier";
import type { IntakeRecord } from "@claritystructures/domain";

// Mock nodemailer — vi.hoisted ensures mocks are available before vi.mock hoists
const { mockSendMail, mockCreateTransport } = vi.hoisted(() => ({
  mockSendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
  mockCreateTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
  }),
}));
vi.mock("nodemailer", () => ({
  default: {
    createTransport: (...args: unknown[]) => mockCreateTransport(...args),
  },
}));

// Wire the sendMail mock to the transport mock
mockCreateTransport.mockReturnValue({ sendMail: mockSendMail });

const SAMPLE_INTAKE: IntakeRecord = {
  id: "intake-001",
  createdAt: new Date("2026-02-17T12:00:00Z"),
  tone: "basic",
  route: "/contact/basic",
  priority: "medium",
  email: "alice@example.com",
  message: "Need forensic help with my device",
  status: "pending",
};

describe("MailNotifier", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create transporter when SMTP env vars are set", () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";
      process.env.SMTP_PORT = "465";
      process.env.SMTP_SECURE = "true";

      new MailNotifier();

      expect(mockCreateTransport).toHaveBeenCalledWith({
        host: "smtp.example.com",
        port: 465,
        secure: true,
        auth: { user: "user@example.com", pass: "secret" },
      });
    });

    it("should not create transporter when SMTP env vars are missing", () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      mockCreateTransport.mockClear();

      new MailNotifier();

      expect(mockCreateTransport).not.toHaveBeenCalled();
    });

    it("should default to port 587 when SMTP_PORT is not set", () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";
      delete process.env.SMTP_PORT;
      delete process.env.SMTP_SECURE;

      new MailNotifier();

      expect(mockCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({ port: 587, secure: false }),
      );
    });
  });

  describe("notifyIntakeReceived", () => {
    it("should send email when transporter is configured", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";

      const notifier = new MailNotifier();
      await notifier.notifyIntakeReceived(SAMPLE_INTAKE);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("MEDIUM"),
          text: expect.stringContaining("intake-001"),
          html: expect.stringContaining("intake-001"),
        }),
      );
    });

    it("should use INTERNAL_NOTICE_RECIPIENT when set", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";
      process.env.INTERNAL_NOTICE_RECIPIENT = "legal@claritystructures.com";

      const notifier = new MailNotifier();
      await notifier.notifyIntakeReceived(SAMPLE_INTAKE);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "legal@claritystructures.com",
        }),
      );
    });

    it("should log stub message when transporter is not configured", async () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      mockCreateTransport.mockClear();

      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
      const notifier = new MailNotifier();
      await notifier.notifyIntakeReceived(SAMPLE_INTAKE);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[MailNotifier] STUB"),
      );
      expect(mockSendMail).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should handle send errors gracefully", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";
      mockSendMail.mockRejectedValueOnce(new Error("SMTP timeout"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const notifier = new MailNotifier();
      await notifier.notifyIntakeReceived(SAMPLE_INTAKE);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[MailNotifier] Error"),
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });

    it("should highlight critical priority in red in HTML", async () => {
      process.env.SMTP_HOST = "smtp.example.com";
      process.env.SMTP_USER = "user@example.com";
      process.env.SMTP_PASS = "secret";

      const criticalIntake = {
        ...SAMPLE_INTAKE,
        priority: "critical" as const,
      };
      const notifier = new MailNotifier();
      await notifier.notifyIntakeReceived(criticalIntake);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("color: red"),
        }),
      );
    });
  });
});
