import type { AuditEvent, AuditTrail } from '@/application/intake/ports';

export class ConsoleAuditTrail implements AuditTrail {
  record(event: AuditEvent): void {
    const payload = {
      action: event.action,
      intakeId: event.intakeId,
      metadata: event.metadata,
      occurredAt: (event.occurredAt ?? new Date()).toISOString(),
    };

    console.info('[AuditTrail]', JSON.stringify(payload));
  }
}
