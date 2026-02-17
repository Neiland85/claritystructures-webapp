/**
 * Decision Replay Test Suite
 *
 * Verifies that the decision engine is fully deterministic:
 * identical WizardResult inputs MUST always produce identical outputs.
 *
 * PHASE 4 exit criteria:
 *   "replay test confirms identical outputs for identical inputs"
 *
 * These test vectors are frozen reference cases.
 * DO NOT modify expected outputs without a versioned ADR.
 */

import { describe, it, expect } from "vitest";
import {
  decideIntakeWithExplanation,
  DECISION_MODEL_VERSION_V2,
} from "../decision";
import type { WizardResult } from "../wizard-result";

// ── Frozen test vectors ──────────────────────────────────────────

const VECTORS: Array<{
  label: string;
  input: WizardResult;
  expected: {
    priority: string;
    route: string;
  };
}> = [
  {
    label: "basic informational — private individual, low urgency",
    input: {
      objective: "contact",
      incident: "I want to know my options regarding a harassment case",
      clientProfile: "private_individual",
      urgency: "informational",
      devices: 0,
      actionsTaken: [],
      evidenceSources: [],
    },
    expected: {
      priority: "low",
      route: "/contact/basic",
    },
  },
  {
    label: "time-sensitive — private individual with evidence",
    input: {
      objective: "urgent_assessment",
      incident: "Someone is sharing my photos online",
      clientProfile: "private_individual",
      urgency: "time_sensitive",
      devices: 1,
      actionsTaken: ["screenshots"],
      evidenceSources: ["mobile"],
    },
    expected: {
      priority: "low",
      route: "/contact/basic",
    },
  },
  {
    label: "legal risk — legal professional with multiple devices",
    input: {
      objective: "legal_consultation",
      incident: "Client's corporate email compromised",
      clientProfile: "legal_professional",
      urgency: "legal_risk",
      devices: 3,
      actionsTaken: ["police_report"],
      evidenceSources: ["email", "cloud"],
    },
    expected: {
      priority: "high",
      route: "/contact/legal",
    },
  },
  {
    label: "critical — court-related with physical safety risk",
    input: {
      objective: "urgent_action",
      incident: "Active court proceeding, threats received, evidence at risk",
      clientProfile: "court_related",
      urgency: "critical",
      devices: 5,
      actionsTaken: ["police_report", "legal_complaint"],
      evidenceSources: ["mobile", "cloud", "social_media"],
      physicalSafetyRisk: true,
      financialAssetRisk: true,
      attackerHasPasswords: true,
    },
    expected: {
      priority: "critical",
      route: "/contact/critical",
    },
  },
  {
    label: "family inheritance conflict — elevated urgency",
    input: {
      objective: "family_dispute",
      incident: "Suspicious access to family shared drives",
      clientProfile: "family_inheritance_conflict",
      urgency: "time_sensitive",
      devices: 2,
      actionsTaken: [],
      evidenceSources: ["cloud"],
    },
    expected: {
      priority: "high",
      route: "/contact/family",
    },
  },
  {
    label: "critical with cognitive profile — high shock",
    input: {
      objective: "urgent_action",
      incident: "I am being surveilled, they know everything I do",
      clientProfile: "private_individual",
      urgency: "critical",
      devices: 2,
      actionsTaken: [],
      evidenceSources: ["mobile"],
      hasEmotionalDistress: true,
      physicalSafetyRisk: true,
      cognitiveProfile: {
        coherenceScore: 2,
        cognitiveDistortion: true,
        perceivedOmnipotenceOfAttacker: true,
        isInformationVerifiable: false,
        emotionalShockLevel: "high",
      },
    },
    expected: {
      priority: "critical",
      route: "/contact/critical",
    },
  },
];

// ── Replay tests ─────────────────────────────────────────────────

describe("Decision Engine — Replay Determinism", () => {
  for (const vector of VECTORS) {
    describe(`Vector: ${vector.label}`, () => {
      it("should produce identical output on every replay", () => {
        // Run the decision engine N times with the same input
        const REPLAY_COUNT = 10;
        const results = Array.from({ length: REPLAY_COUNT }, () =>
          decideIntakeWithExplanation(vector.input, true),
        );

        // All runs must produce the exact same output
        const first = results[0];
        for (let i = 1; i < results.length; i++) {
          expect(results[i].decision.priority).toBe(first.decision.priority);
          expect(results[i].decision.route).toBe(first.decision.route);
          expect(results[i].decision.actionCode).toBe(
            first.decision.actionCode,
          );
          expect(results[i].decision.flags).toEqual(first.decision.flags);
          expect(results[i].decision.decisionModelVersion).toBe(
            first.decision.decisionModelVersion,
          );
        }
      });

      it("should match the frozen expected output", () => {
        const result = decideIntakeWithExplanation(vector.input, true);

        expect(result.decision.priority).toBe(vector.expected.priority);
        expect(result.decision.route).toBe(vector.expected.route);
      });

      it("should use the V2 model version", () => {
        const result = decideIntakeWithExplanation(vector.input, true);
        expect(result.decision.decisionModelVersion).toBe(
          DECISION_MODEL_VERSION_V2,
        );
      });

      it("should produce a frozen (immutable) decision object", () => {
        const result = decideIntakeWithExplanation(vector.input, true);
        expect(Object.isFrozen(result.decision)).toBe(true);
      });
    });
  }

  describe("Cross-vector isolation", () => {
    it("should produce different outputs for different inputs", () => {
      const basic = decideIntakeWithExplanation(VECTORS[0].input, true);
      const critical = decideIntakeWithExplanation(VECTORS[3].input, true);

      expect(basic.decision.priority).not.toBe(critical.decision.priority);
      expect(basic.decision.route).not.toBe(critical.decision.route);
    });
  });
});
