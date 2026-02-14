import nodemailer from "nodemailer";
import type { IntakeRecord, Notifier } from "@claritystructures/domain";

export class MailNotifier implements Notifier {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user, pass },
      });
    }
  }

  async notifyIntakeReceived(intake: IntakeRecord): Promise<void> {
    const summary = `Intake ${intake.id} from ${intake.email}`;

    if (!this.transporter) {
      console.info(
        `[MailNotifier] STUB: New intake received: ${summary}. (SMTP not configured)`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Clarity Triage" <${process.env.SMTP_USER}>`,
        to: process.env.INTERNAL_NOTICE_RECIPIENT || process.env.SMTP_USER,
        subject: `[TRIAGE ALERT] New Forensic Intake: ${intake.priority.toUpperCase()}`,
        text: `
A new intake has been received and requires triage.

ID: ${intake.id}
Email: ${intake.email}
Priority: ${intake.priority.toUpperCase()}
Tone: ${intake.tone}

Message Content:
${intake.message}

View in dashboard:
${process.env.NEXT_PUBLIC_SITE_URL}/triage
        `,
        html: `
          <h1>New Forensic Intake Received</h1>
          <p><strong>ID:</strong> ${intake.id}</p>
          <p><strong>Email:</strong> ${intake.email}</p>
          <p><strong>Priority:</strong> <span style="color: ${intake.priority === "critical" ? "red" : "black"}">${intake.priority.toUpperCase()}</span></p>
          <hr />
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f4f4f4; padding: 10px; border-left: 5px solid #ccc;">
            ${intake.message}
          </blockquote>
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/triage" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Open Triage Dashboard
            </a>
          </p>
        `,
      });
      console.info(
        `[MailNotifier] Success: Internal alert sent for ${intake.id}`,
      );
    } catch (error) {
      console.error(
        `[MailNotifier] Error sending email for ${intake.id}:`,
        error,
      );
    }
  }
}
