import { describe, expect, it } from "vitest";

import { evaluateCondition, evaluateConditions } from "../condition-evaluator";

describe("wizard condition evaluator", () => {
  it("matches answer equality", () => {
    expect(
      evaluateCondition(
        {
          field: "physicalSafetyRisk",
          operator: "equals",
          value: true,
        },
        {
          answers: {
            physicalSafetyRisk: true,
          },
        },
      ),
    ).toBe(true);
  });

  it("matches answer inequality", () => {
    expect(
      evaluateCondition(
        {
          field: "urgency",
          operator: "not_equals",
          value: "informational",
        },
        {
          answers: {
            urgency: "critical",
          },
        },
      ),
    ).toBe(true);
  });

  it("matches array includes", () => {
    expect(
      evaluateCondition(
        {
          field: "evidenceSources",
          operator: "includes",
          value: "phone_device",
        },
        {
          answers: {
            evidenceSources: ["phone_device", "screenshots"],
          },
        },
      ),
    ).toBe(true);
  });

  it("matches non-empty strings", () => {
    expect(
      evaluateCondition(
        {
          field: "incident",
          operator: "not_empty",
        },
        {
          answers: {
            incident: "Mensajes eliminados con posible valor probatorio",
          },
        },
      ),
    ).toBe(true);
  });

  it("matches active canonical signals", () => {
    expect(
      evaluateCondition(
        {
          field: "risk.evidence_volatility",
          operator: "equals",
          value: true,
        },
        {
          answers: {},
          signals: ["risk.evidence_volatility"],
        },
      ),
    ).toBe(true);
  });

  it("does not match inactive canonical signals", () => {
    expect(
      evaluateCondition(
        {
          field: "risk.evidence_volatility",
          operator: "equals",
          value: true,
        },
        {
          answers: {},
          signals: [],
        },
      ),
    ).toBe(false);
  });

  it("returns true for empty condition lists", () => {
    expect(
      evaluateConditions(undefined, {
        answers: {},
      }),
    ).toBe(true);

    expect(
      evaluateConditions([], {
        answers: {},
      }),
    ).toBe(true);
  });

  it("requires all conditions to pass", () => {
    expect(
      evaluateConditions(
        [
          {
            field: "urgency",
            operator: "equals",
            value: "critical",
          },
          {
            field: "risk.evidence_volatility",
            operator: "equals",
            value: true,
          },
        ],
        {
          answers: {
            urgency: "critical",
          },
          signals: ["risk.evidence_volatility"],
        },
      ),
    ).toBe(true);
  });

  it("fails when one condition does not pass", () => {
    expect(
      evaluateConditions(
        [
          {
            field: "urgency",
            operator: "equals",
            value: "critical",
          },
          {
            field: "risk.evidence_volatility",
            operator: "equals",
            value: true,
          },
        ],
        {
          answers: {
            urgency: "informational",
          },
          signals: ["risk.evidence_volatility"],
        },
      ),
    ).toBe(false);
  });
});
