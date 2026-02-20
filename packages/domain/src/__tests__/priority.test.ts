import { describe, it, expect } from "vitest";
import {
  assessIntake,
  assessIntakeV2,
  assessIntakeWithSignals,
} from "../priority";
import type { WizardResult } from "../wizard-result";
import { DECISION_MODEL_VERSION_V2 } from "../decision";
import { baseWizard } from "./test-utils";

describe("assessIntake (V1 wrapper)", () => {
  it("should return priority, flags, and actionCode", () => {
    const result = assessIntake(baseWizard());
    expect(result).toHaveProperty("priority");
    expect(result).toHaveProperty("flags");
    expect(result).toHaveProperty("actionCode");
  });

  it("should return low for informational private_individual", () => {
    const result = assessIntake(baseWizard());
    expect(result.priority).toBe("low");
  });

  it("should return high for critical urgency alone (score 6)", () => {
    const result = assessIntake(baseWizard({ urgency: "critical" }));
    expect(result.priority).toBe("high");
  });

  it("should return critical when urgency=critical + distress (score 8)", () => {
    const result = assessIntake(
      baseWizard({ urgency: "critical", hasEmotionalDistress: true }),
    );
    expect(result.priority).toBe("critical");
  });

  it("should return flags for family_inheritance_conflict", () => {
    const result = assessIntake(
      baseWizard({ clientProfile: "family_inheritance_conflict" }),
    );
    expect(result.flags).toContain("family_conflict");
  });
});

describe("assessIntakeV2 (V2 wrapper)", () => {
  it("should return assessment using V2 engine", () => {
    const result = assessIntakeV2(baseWizard());
    expect(result).toHaveProperty("priority");
    expect(result).toHaveProperty("flags");
    expect(result).toHaveProperty("actionCode");
  });

  it("should escalate for physicalSafetyRisk", () => {
    const result = assessIntakeV2(baseWizard({ physicalSafetyRisk: true }));
    expect(result.priority).toBe("critical");
  });
});

describe("assessIntakeWithSignals", () => {
  it("should return signals and summary", () => {
    const result = assessIntakeWithSignals(baseWizard());
    expect(result).toHaveProperty("signals");
    expect(result).toHaveProperty("summary");
    expect(result.signals).toHaveProperty("incidentType");
    expect(result.signals).toHaveProperty("riskLevel");
    expect(result.signals).toHaveProperty("evidenceLevel");
    expect(result.summary).toHaveProperty("headline");
    expect(result.summary).toHaveProperty("bullets");
    expect(result.summary).toHaveProperty("recommendedNextStep");
  });

  it("should NOT include decisionModelVersion by default", () => {
    const result = assessIntakeWithSignals(baseWizard());
    expect(result.decisionModelVersion).toBeUndefined();
  });

  it("should include V1 decisionModelVersion when requested", () => {
    const result = assessIntakeWithSignals(baseWizard(), {
      includeDecisionModelVersion: true,
    });
    expect(result.decisionModelVersion).toBeDefined();
    expect(result.decisionModelVersion).not.toBe(DECISION_MODEL_VERSION_V2);
  });

  it("should include V2 decisionModelVersion when both flags set", () => {
    const result = assessIntakeWithSignals(baseWizard(), {
      useDecisionModelV2: true,
      includeDecisionModelVersion: true,
    });
    expect(result.decisionModelVersion).toBe(DECISION_MODEL_VERSION_V2);
  });

  it("should use V2 decision model when useDecisionModelV2=true", () => {
    // V1: physicalSafetyRisk alone scores 5 → high (not critical)
    const v1 = assessIntakeWithSignals(
      baseWizard({ physicalSafetyRisk: true }),
    );
    expect(v1.priority).toBe("high");

    // V2: physicalSafetyRisk escalates directly to critical via signal refinements
    const v2 = assessIntakeWithSignals(
      baseWizard({ physicalSafetyRisk: true }),
      {
        useDecisionModelV2: true,
      },
    );
    expect(v2.priority).toBe("critical");
  });
});
