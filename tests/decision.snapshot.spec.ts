import test from "node:test";
import assert from "node:assert/strict";

import {
  DECISION_MODEL_VERSION_V1,
  DECISION_MODEL_VERSION_V2,
  decideIntake,
  decideIntakeV2,
  type IntakeDecision,
} from "@claritystructures/domain";
import { canonicalDecisionCases } from "./decision-scenarios/canonical-cases.js";

const expectedDecisionSnapshots: Record<
  string,
  { v1: IntakeDecision; v2: IntakeDecision }
> = {
  "low informational baseline": {
    v1: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "medium time sensitive baseline": {
    v1: {
      route: "/contact/basic",
      priority: "medium",
      flags: ["emotional_distress"],
      actionCode: "STANDARD_REVIEW",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "medium",
      flags: ["emotional_distress"],
      actionCode: "STANDARD_REVIEW",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "high legal risk baseline": {
    v1: {
      route: "/contact/legal",
      priority: "high",
      flags: ["legal_professional", "legal_risk"],
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/legal",
      priority: "high",
      flags: ["legal_professional", "legal_risk"],
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "critical urgency route override": {
    v1: {
      route: "/contact/critical",
      priority: "critical",
      flags: ["family_conflict"],
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/critical",
      priority: "critical",
      flags: ["family_conflict"],
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "high data sensitivity refinement": {
    v1: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "critical",
      flags: [],
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "ongoing incident exposure refinement": {
    v1: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "high",
      flags: [],
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "no device access with messages only evidence": {
    v1: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "medium",
      flags: [],
      actionCode: "STANDARD_REVIEW",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "long duration incident months": {
    v1: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/basic",
      priority: "low",
      flags: [],
      actionCode: "DEFERRED_INFORMATIONAL_RESPONSE",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "family conflict profile": {
    v1: {
      route: "/contact/family",
      priority: "high",
      flags: ["family_conflict"],
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/family",
      priority: "high",
      flags: ["family_conflict"],
      actionCode: "PRIORITY_REVIEW_24_48H",
      decisionModelVersion: "decision-model/v2",
    },
  },
  "court related legal escalation": {
    v1: {
      route: "/contact/legal",
      priority: "critical",
      flags: ["active_procedure", "legal_risk"],
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: "decision-model/v1",
    },
    v2: {
      route: "/contact/legal",
      priority: "critical",
      flags: ["active_procedure", "legal_risk"],
      actionCode: "IMMEDIATE_HUMAN_CONTACT",
      decisionModelVersion: "decision-model/v2",
    },
  },
};

test("canonical scenario snapshots are stable for V1 and V2", () => {
  for (const scenario of canonicalDecisionCases) {
    const expected = expectedDecisionSnapshots[scenario.name];

    assert.ok(expected, `missing snapshot for scenario: ${scenario.name}`);
    assert.deepEqual(decideIntake(scenario.input), expected.v1);
    assert.deepEqual(decideIntakeV2(scenario.input), expected.v2);
  }
});

test("decision engines are deterministic for repeated identical input", () => {
  for (const scenario of canonicalDecisionCases) {
    const v1First = decideIntake(scenario.input);
    const v1Second = decideIntake(scenario.input);
    const v2First = decideIntakeV2(scenario.input);
    const v2Second = decideIntakeV2(scenario.input);

    assert.deepEqual(v1First, v1Second);
    assert.deepEqual(v2First, v2Second);
  }
});

test("decision model versions remain distinct and V1 behavior is snapshot-locked", () => {
  assert.notEqual(DECISION_MODEL_VERSION_V1, DECISION_MODEL_VERSION_V2);

  for (const scenario of canonicalDecisionCases) {
    const expected = expectedDecisionSnapshots[scenario.name];
    assert.deepEqual(decideIntake(scenario.input), expected.v1);
  }
});
// pega aquí el JSON actualizado correctamente
