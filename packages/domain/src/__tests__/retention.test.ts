import { describe, it, expect } from "vitest";
import {
  RETENTION_POLICY,
  computeRetentionCutoff,
  isEligibleForPurge,
} from "../retention";

describe("Retention Policy", () => {
  describe("RETENTION_POLICY constants", () => {
    it("should define intake_data as 24 months", () => {
      expect(RETENTION_POLICY.intake_data).toBe(24);
    });

    it("should define audit_logs as 36 months", () => {
      expect(RETENTION_POLICY.audit_logs).toBe(36);
    });

    it("should define unqualified_leads as 6 months", () => {
      expect(RETENTION_POLICY.unqualified_leads).toBe(6);
    });
  });

  describe("computeRetentionCutoff", () => {
    const now = new Date("2026-02-18T12:00:00Z");

    it("should compute 24-month cutoff for intake_data", () => {
      const cutoff = computeRetentionCutoff("intake_data", now);
      expect(cutoff.getFullYear()).toBe(2024);
      expect(cutoff.getMonth()).toBe(1); // February (0-indexed)
    });

    it("should compute 36-month cutoff for audit_logs", () => {
      const cutoff = computeRetentionCutoff("audit_logs", now);
      expect(cutoff.getFullYear()).toBe(2023);
      expect(cutoff.getMonth()).toBe(1); // February
    });

    it("should compute 6-month cutoff for unqualified_leads", () => {
      const cutoff = computeRetentionCutoff("unqualified_leads", now);
      expect(cutoff.getFullYear()).toBe(2025);
      expect(cutoff.getMonth()).toBe(7); // August
    });
  });

  describe("isEligibleForPurge", () => {
    const now = new Date("2026-02-18T12:00:00Z");

    it("should return true for a 3-year-old intake under intake_data policy", () => {
      const createdAt = new Date("2023-01-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "intake_data", now)).toBe(true);
    });

    it("should return false for a 1-year-old intake under intake_data policy", () => {
      const createdAt = new Date("2025-06-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "intake_data", now)).toBe(false);
    });

    it("should return true for an 8-month-old unqualified lead", () => {
      const createdAt = new Date("2025-06-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "unqualified_leads", now)).toBe(
        true,
      );
    });

    it("should return false for a 3-month-old unqualified lead", () => {
      const createdAt = new Date("2025-12-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "unqualified_leads", now)).toBe(
        false,
      );
    });

    it("should return false for a 2-year-old audit log (36-month retention)", () => {
      const createdAt = new Date("2024-06-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "audit_logs", now)).toBe(false);
    });

    it("should return true for a 4-year-old audit log", () => {
      const createdAt = new Date("2022-01-01T00:00:00Z");
      expect(isEligibleForPurge(createdAt, "audit_logs", now)).toBe(true);
    });
  });
});
