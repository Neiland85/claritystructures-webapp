import { describe, it, expect } from "vitest";
import {
  IntakeReceivedEvent,
  IntakePriorityAssessedEvent,
  IntakeAssignedEvent,
  IntakeClosedEvent,
} from "../IntakeEvents";

describe("IntakeEvents — full coverage", () => {
  describe("IntakeAssignedEvent", () => {
    it("should create event with intakeId and assignedTo", () => {
      const event = new IntakeAssignedEvent("intake_1", "analyst@team.com");
      expect(event.intakeId).toBe("intake_1");
      expect(event.assignedTo).toBe("analyst@team.com");
      expect(event.eventName).toBe("IntakeAssigned");
      expect(event.occurredAt).toBeInstanceOf(Date);
      expect(event.eventId).toBeDefined();
    });

    it("should serialize to JSON", () => {
      const event = new IntakeAssignedEvent("intake_1", "analyst@team.com");
      const json = event.toJSON();
      expect(json).toMatchObject({
        eventName: "IntakeAssigned",
        intakeId: "intake_1",
        assignedTo: "analyst@team.com",
      });
      expect(json).toHaveProperty("eventId");
      expect(json).toHaveProperty("occurredAt");
    });
  });

  describe("IntakeClosedEvent", () => {
    it("should create event with intakeId and reason", () => {
      const event = new IntakeClosedEvent("intake_2", "resolved");
      expect(event.intakeId).toBe("intake_2");
      expect(event.reason).toBe("resolved");
      expect(event.eventName).toBe("IntakeClosed");
    });

    it("should serialize to JSON", () => {
      const event = new IntakeClosedEvent("intake_2", "no response");
      const json = event.toJSON();
      expect(json).toMatchObject({
        eventName: "IntakeClosed",
        intakeId: "intake_2",
        reason: "no response",
      });
      expect(json).toHaveProperty("eventId");
      expect(json).toHaveProperty("occurredAt");
    });
  });

  describe("IntakePriorityAssessedEvent — eventData", () => {
    it("should include all fields in JSON", () => {
      const event = new IntakePriorityAssessedEvent(
        "intake_3",
        "critical",
        "decision-engine-v2",
      );
      const json = event.toJSON();
      expect(json).toMatchObject({
        eventName: "IntakePriorityAssessed",
        intakeId: "intake_3",
        priority: "critical",
        assessedBy: "decision-engine-v2",
      });
    });
  });

  describe("IntakeReceivedEvent — eventData", () => {
    it("should include all fields in JSON", () => {
      const event = new IntakeReceivedEvent(
        "intake_4",
        "user@example.com",
        "time_sensitive",
      );
      const json = event.toJSON();
      expect(json).toMatchObject({
        eventName: "IntakeReceived",
        intakeId: "intake_4",
        email: "user@example.com",
        urgency: "time_sensitive",
      });
    });
  });
});
