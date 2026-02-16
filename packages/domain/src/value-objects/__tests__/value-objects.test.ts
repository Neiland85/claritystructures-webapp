import { describe, it, expect } from "vitest";
import { IntakeId, Email, Priority, Status } from "../index";

describe("Value Objects", () => {
  describe("IntakeId", () => {
    it("should generate valid ID", () => {
      const id = IntakeId.generate();
      expect(id.toString()).toMatch(/^intake_[a-z0-9_]+$/i);
    });

    it("should create from valid string", () => {
      const id = IntakeId.create("intake_abc123_xyz");
      expect(id.toString()).toBe("intake_abc123_xyz");
    });

    it("should reject invalid format", () => {
      expect(() => IntakeId.create("invalid")).toThrow();
    });

    it("should check equality", () => {
      const id1 = IntakeId.create("intake_123_abc");
      const id2 = IntakeId.create("intake_123_abc");
      const id3 = IntakeId.create("intake_456_def");

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
    });
  });

  describe("Email", () => {
    it("should create valid email", () => {
      const email = Email.create("test@example.com");
      expect(email.toString()).toBe("test@example.com");
    });

    it("should normalize email", () => {
      const email = Email.create("  TEST@EXAMPLE.COM  ");
      expect(email.toString()).toBe("test@example.com");
    });

    it("should reject invalid email", () => {
      expect(() => Email.create("invalid")).toThrow();
      expect(() => Email.create("@example.com")).toThrow();
      expect(() => Email.create("test@")).toThrow();
    });

    it("should extract domain", () => {
      const email = Email.create("user@example.com");
      expect(email.getDomain()).toBe("example.com");
    });

    it("should check equality", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("TEST@EXAMPLE.COM");
      const email3 = Email.create("other@example.com");

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });
  });

  describe("Priority", () => {
    it("should create valid priorities", () => {
      expect(Priority.low().toString()).toBe("low");
      expect(Priority.medium().toString()).toBe("medium");
      expect(Priority.high().toString()).toBe("high");
      expect(Priority.critical().toString()).toBe("critical");
    });

    it("should reject invalid priority", () => {
      expect(() => Priority.create("invalid")).toThrow();
    });

    it("should compare priorities", () => {
      const low = Priority.low();
      const high = Priority.high();

      expect(high.isHigherThan(low)).toBe(true);
      expect(low.isHigherThan(high)).toBe(false);
    });

    it("should check equality", () => {
      const p1 = Priority.high();
      const p2 = Priority.high();
      const p3 = Priority.low();

      expect(p1.equals(p2)).toBe(true);
      expect(p1.equals(p3)).toBe(false);
    });
  });

  describe("Status", () => {
    it("should create valid statuses", () => {
      expect(Status.pending().toString()).toBe("pending");
      expect(Status.inProgress().toString()).toBe("in_progress");
      expect(Status.resolved().toString()).toBe("resolved");
      expect(Status.closed().toString()).toBe("closed");
      expect(Status.spam().toString()).toBe("spam");
    });

    it("should reject invalid status", () => {
      expect(() => Status.create("invalid")).toThrow();
    });

    it("should check status states", () => {
      expect(Status.pending().isPending()).toBe(true);
      expect(Status.closed().isClosed()).toBe(true);
      expect(Status.spam().isClosed()).toBe(true);
      expect(Status.inProgress().isClosed()).toBe(false);
    });
  });
});
