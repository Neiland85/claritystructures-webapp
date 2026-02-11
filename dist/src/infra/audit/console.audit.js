"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleAuditTrail = void 0;
class ConsoleAuditTrail {
    record(event) {
        const payload = {
            action: event.action,
            intakeId: event.intakeId,
            metadata: event.metadata,
            occurredAt: (event.occurredAt ?? new Date()).toISOString(),
        };
        console.info('[AuditTrail]', JSON.stringify(payload));
    }
}
exports.ConsoleAuditTrail = ConsoleAuditTrail;
