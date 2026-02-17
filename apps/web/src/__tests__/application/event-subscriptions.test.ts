import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  eventDispatcher,
  IntakeReceivedEvent,
  IntakePriorityAssessedEvent,
  IntakeAssignedEvent,
  IntakeClosedEvent,
} from "@claritystructures/domain";
import type { AuditTrail } from "@claritystructures/domain";
import {
  registerEventSubscriptions,
  resetEventSubscriptions,
} from "../../application/event-subscriptions";

function createMockAudit(): AuditTrail {
  return { record: vi.fn(async () => {}) };
}

describe("Event Subscriptions", () => {
  let audit: AuditTrail;

  beforeEach(() => {
    eventDispatcher.clear();
    resetEventSubscriptions();
    audit = createMockAudit();
    registerEventSubscriptions(audit);
  });

  afterEach(() => {
    eventDispatcher.clear();
    resetEventSubscriptions();
  });

  it("should record audit on IntakeReceived event", async () => {
    const event = new IntakeReceivedEvent(
      "intake-001",
      "test@example.com",
      "critical",
    );

    await eventDispatcher.dispatch(event);

    expect(audit.record).toHaveBeenCalledOnce();
    expect(audit.record).toHaveBeenCalledWith({
      action: "domain_event:IntakeReceived",
      intakeId: "intake-001",
      metadata: { email: "test@example.com", urgency: "critical" },
      occurredAt: event.occurredAt,
    });
  });

  it("should record audit on IntakePriorityAssessed event", async () => {
    const event = new IntakePriorityAssessedEvent(
      "intake-002",
      "high",
      "decision-engine-v2",
    );

    await eventDispatcher.dispatch(event);

    expect(audit.record).toHaveBeenCalledOnce();
    expect(audit.record).toHaveBeenCalledWith({
      action: "domain_event:IntakePriorityAssessed",
      intakeId: "intake-002",
      metadata: { priority: "high", assessedBy: "decision-engine-v2" },
      occurredAt: event.occurredAt,
    });
  });

  it("should record audit on IntakeAssigned event", async () => {
    const event = new IntakeAssignedEvent("intake-003", "analyst@clarity.com");

    await eventDispatcher.dispatch(event);

    expect(audit.record).toHaveBeenCalledOnce();
    expect(audit.record).toHaveBeenCalledWith({
      action: "domain_event:IntakeAssigned",
      intakeId: "intake-003",
      metadata: { assignedTo: "analyst@clarity.com" },
      occurredAt: event.occurredAt,
    });
  });

  it("should record audit on IntakeClosed event", async () => {
    const event = new IntakeClosedEvent("intake-004", "resolved");

    await eventDispatcher.dispatch(event);

    expect(audit.record).toHaveBeenCalledOnce();
    expect(audit.record).toHaveBeenCalledWith({
      action: "domain_event:IntakeClosed",
      intakeId: "intake-004",
      metadata: { reason: "resolved" },
      occurredAt: event.occurredAt,
    });
  });

  it("should be idempotent — calling register twice only subscribes once", async () => {
    // registerEventSubscriptions was already called in beforeEach
    registerEventSubscriptions(audit);

    const event = new IntakeReceivedEvent("intake-005", "dupe@test.com", "low");
    await eventDispatcher.dispatch(event);

    // Should only be called once, not twice
    expect(audit.record).toHaveBeenCalledTimes(1);
  });

  it("should subscribe all four event types", () => {
    expect(eventDispatcher.getHandlerCount("IntakeReceived")).toBe(1);
    expect(eventDispatcher.getHandlerCount("IntakePriorityAssessed")).toBe(1);
    expect(eventDispatcher.getHandlerCount("IntakeAssigned")).toBe(1);
    expect(eventDispatcher.getHandlerCount("IntakeClosed")).toBe(1);
  });
});
