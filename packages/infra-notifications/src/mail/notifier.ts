import type { IntakeRecord, Notifier } from "@claritystructures/domain";

export class MailNotifier implements Notifier {
  async notifyIntakeReceived(intake: IntakeRecord): Promise<void> {
    const summary = `${intake.id} (${intake.email})`;

    console.info(
      `[MailNotifier] Stub notification sent for intake ${summary}.`,
    );
  }
}
