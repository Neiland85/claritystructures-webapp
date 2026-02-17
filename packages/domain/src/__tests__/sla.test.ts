import { describe, it, expect } from "vitest";
import {
  SLA_MILESTONES,
  SLA_THRESHOLDS,
  computeDeadline,
  resolveSlaStatus,
} from "../sla";

describe("SLA Domain", () => {
  const BASE_TIME = new Date("2026-02-17T12:00:00Z");

  describe("SLA_THRESHOLDS", () => {
    it("should define acknowledgment at 15 minutes", () => {
      expect(SLA_THRESHOLDS.acknowledgment).toBe(15);
    });

    it("should define first_contact at 60 minutes", () => {
      expect(SLA_THRESHOLDS.first_contact).toBe(60);
    });

    it("should define containment_guidance at 120 minutes", () => {
      expect(SLA_THRESHOLDS.containment_guidance).toBe(120);
    });

    it("should define legal_escalation at 240 minutes", () => {
      expect(SLA_THRESHOLDS.legal_escalation).toBe(240);
    });
  });

  describe("SLA_MILESTONES", () => {
    it("should define exactly 4 milestones", () => {
      expect(SLA_MILESTONES).toHaveLength(4);
    });
  });

  describe("computeDeadline", () => {
    it("should compute acknowledgment deadline as +15 min", () => {
      const deadline = computeDeadline(BASE_TIME, "acknowledgment");
      expect(deadline).toEqual(new Date("2026-02-17T12:15:00Z"));
    });

    it("should compute first_contact deadline as +60 min", () => {
      const deadline = computeDeadline(BASE_TIME, "first_contact");
      expect(deadline).toEqual(new Date("2026-02-17T13:00:00Z"));
    });

    it("should compute containment_guidance deadline as +120 min", () => {
      const deadline = computeDeadline(BASE_TIME, "containment_guidance");
      expect(deadline).toEqual(new Date("2026-02-17T14:00:00Z"));
    });

    it("should compute legal_escalation deadline as +240 min", () => {
      const deadline = computeDeadline(BASE_TIME, "legal_escalation");
      expect(deadline).toEqual(new Date("2026-02-17T16:00:00Z"));
    });
  });

  describe("resolveSlaStatus", () => {
    const deadline = new Date("2026-02-17T12:15:00Z");

    it("should return 'met' when completed before deadline", () => {
      const completed = new Date("2026-02-17T12:10:00Z");
      expect(resolveSlaStatus(deadline, completed)).toBe("met");
    });

    it("should return 'met' when completed exactly at deadline", () => {
      const completed = new Date("2026-02-17T12:15:00Z");
      expect(resolveSlaStatus(deadline, completed)).toBe("met");
    });

    it("should return 'breached' when completed after deadline", () => {
      const completed = new Date("2026-02-17T12:20:00Z");
      expect(resolveSlaStatus(deadline, completed)).toBe("breached");
    });

    it("should return 'pending' when not completed and before deadline", () => {
      const now = new Date("2026-02-17T12:10:00Z");
      expect(resolveSlaStatus(deadline, null, now)).toBe("pending");
    });

    it("should return 'breached' when not completed and past deadline", () => {
      const now = new Date("2026-02-17T12:30:00Z");
      expect(resolveSlaStatus(deadline, null, now)).toBe("breached");
    });
  });
});
