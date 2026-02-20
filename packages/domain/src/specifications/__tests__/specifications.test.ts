import { describe, it, expect } from "vitest";
import {
  HighPrioritySpecification,
  CriticalPrioritySpecification,
  HasFlagSpecification,
  RequiresImmediateActionSpecification,
} from "../index";
import type { IntakeDecision } from "../../decision";

describe("Specifications", () => {
  const createIntake = (
    overrides: Partial<IntakeDecision> = {},
  ): IntakeDecision => ({
    priority: "low",
    flags: [],
    route: "/contact/basic",
    actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
    decisionModelVersion: "decision-model/v1",
    ...overrides,
  });

  describe("HighPrioritySpecification", () => {
    const spec = new HighPrioritySpecification();

    it("should match high priority", () => {
      const intake = createIntake({ priority: "high" });
      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should match critical priority", () => {
      const intake = createIntake({ priority: "critical" });
      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should not match low priority", () => {
      const intake = createIntake({ priority: "low" });
      expect(spec.isSatisfiedBy(intake)).toBe(false);
    });

    it("should not match medium priority", () => {
      const intake = createIntake({ priority: "medium" });
      expect(spec.isSatisfiedBy(intake)).toBe(false);
    });
  });

  describe("CriticalPrioritySpecification", () => {
    const spec = new CriticalPrioritySpecification();

    it("should match critical priority", () => {
      const intake = createIntake({ priority: "critical" });
      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should not match high priority", () => {
      const intake = createIntake({ priority: "high" });
      expect(spec.isSatisfiedBy(intake)).toBe(false);
    });
  });

  describe("HasFlagSpecification", () => {
    it("should match when flag is present", () => {
      const spec = new HasFlagSpecification("legal_risk");
      const intake = createIntake({
        flags: ["legal_risk", "emotional_distress"],
      });

      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should not match when flag is absent", () => {
      const spec = new HasFlagSpecification("legal_risk");
      const intake = createIntake({ flags: ["emotional_distress"] });

      expect(spec.isSatisfiedBy(intake)).toBe(false);
    });
  });

  describe("RequiresImmediateActionSpecification", () => {
    const spec = new RequiresImmediateActionSpecification();

    it("should match critical priority", () => {
      const intake = createIntake({ priority: "critical" });
      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should match legal risk flag", () => {
      const intake = createIntake({
        priority: "low",
        flags: ["legal_risk"],
      });
      expect(spec.isSatisfiedBy(intake)).toBe(true);
    });

    it("should not match normal intake", () => {
      const intake = createIntake({
        priority: "low",
        flags: [],
      });
      expect(spec.isSatisfiedBy(intake)).toBe(false);
    });
  });

  describe("Specification Composition", () => {
    it("should combine with AND", () => {
      const highPriority = new HighPrioritySpecification();
      const hasLegalRisk = new HasFlagSpecification("legal_risk");
      const combined = highPriority.and(hasLegalRisk);

      const intake1 = createIntake({
        priority: "high",
        flags: ["legal_risk"],
      });
      expect(combined.isSatisfiedBy(intake1)).toBe(true);

      const intake2 = createIntake({
        priority: "high",
        flags: [],
      });
      expect(combined.isSatisfiedBy(intake2)).toBe(false);
    });

    it("should combine with OR", () => {
      const critical = new CriticalPrioritySpecification();
      const hasLegalRisk = new HasFlagSpecification("legal_risk");
      const combined = critical.or(hasLegalRisk);

      const intake1 = createIntake({ priority: "critical" });
      expect(combined.isSatisfiedBy(intake1)).toBe(true);

      const intake2 = createIntake({ flags: ["legal_risk"] });
      expect(combined.isSatisfiedBy(intake2)).toBe(true);

      const intake3 = createIntake({ priority: "low", flags: [] });
      expect(combined.isSatisfiedBy(intake3)).toBe(false);
    });

    it("should negate with NOT", () => {
      const highPriority = new HighPrioritySpecification();
      const notHighPriority = highPriority.not();

      const intake1 = createIntake({ priority: "high" });
      expect(notHighPriority.isSatisfiedBy(intake1)).toBe(false);

      const intake2 = createIntake({ priority: "low" });
      expect(notHighPriority.isSatisfiedBy(intake2)).toBe(true);
    });
  });
});
