/**
 * DomainEvent - Base class for all domain events
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }

  abstract get eventName(): string;

  toJSON() {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      ...this.eventData(),
    };
  }

  protected abstract eventData(): Record<string, unknown>;
}
