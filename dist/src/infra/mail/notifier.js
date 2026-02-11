"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailNotifier = void 0;
class MailNotifier {
    async notifyIntakeReceived(intake) {
        const summary = `${intake.id} (${intake.email})`;
        console.info(`[MailNotifier] Stub notification sent for intake ${summary}.`);
    }
}
exports.MailNotifier = MailNotifier;
