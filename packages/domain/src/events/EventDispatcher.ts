import { DomainEvent } from "./DomainEvent";

type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T,
) => void | Promise<void>;

/**
 * EventDispatcher - Simple in-memory event dispatcher
 */
export class EventDispatcher {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventName, handlers);
  }

  async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventName}:`, error);
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  getHandlerCount(eventName: string): number {
    return this.handlers.get(eventName)?.length || 0;
  }
}

// Singleton instance
export const eventDispatcher = new EventDispatcher();
