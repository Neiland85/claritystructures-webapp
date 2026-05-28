import { describe, expect, it } from "vitest";

import { toWizardAnswerMap } from "@/lib/wizard-contracts/wizard-answer-adapter";

describe("wizard answer adapter", () => {
  it("maps filled UI state into canonical wizard answers", () => {
    const answers = toWizardAnswerMap({
      clientProfile: "legal_professional",
      urgency: "legal_risk",
      hasEmotionalDistress: true,
      physicalSafetyRisk: false,
      financialAssetRisk: true,
      attackerHasPasswords: true,
      evidenceIsAutoDeleted: false,
      perceivedOmnipotence: false,
      isVerifiable: true,
      distortionIndicator: false,
      shockLevel: "medium",
      isOngoing: true,
      hasAccessToDevices: false,
      dataSensitivityLevel: "high",
      estimatedIncidentStart: "weeks",
      thirdPartiesInvolved: true,
      incident: "Unauthorized access to corporate devices",
      devices: ["phone", "laptop"],
      evidenceSources: ["messages", "email"],
      actionsTaken: ["changed_passwords"],
      objective: "legal_derivation",
    });

    expect(answers).toEqual({
      clientProfile: "legal_professional",
      urgency: "legal_risk",
      hasEmotionalDistress: true,
      physicalSafetyRisk: false,
      financialAssetRisk: true,
      attackerHasPasswords: true,
      evidenceIsAutoDeleted: false,
      perceivedOmnipotence: false,
      isVerifiable: true,
      distortionIndicator: false,
      shockLevel: "medium",
      isOngoing: true,
      hasAccessToDevices: false,
      dataSensitivityLevel: "high",
      estimatedIncidentStart: "weeks",
      thirdPartiesInvolved: true,
      incident: "Unauthorized access to corporate devices",
      devices: ["phone", "laptop"],
      evidenceSources: ["messages", "email"],
      actionsTaken: ["changed_passwords"],
      objective: "legal_derivation",
    });
  });

  it("keeps explicit false boolean values", () => {
    const answers = toWizardAnswerMap({
      physicalSafetyRisk: false,
      financialAssetRisk: false,
      attackerHasPasswords: false,
      evidenceIsAutoDeleted: false,
      isOngoing: false,
      hasAccessToDevices: false,
      thirdPartiesInvolved: false,
    });

    expect(answers).toEqual({
      physicalSafetyRisk: false,
      financialAssetRisk: false,
      attackerHasPasswords: false,
      evidenceIsAutoDeleted: false,
      isOngoing: false,
      hasAccessToDevices: false,
      thirdPartiesInvolved: false,
    });
  });

  it("skips null, undefined, empty strings and empty arrays", () => {
    const answers = toWizardAnswerMap({
      clientProfile: null,
      urgency: undefined,
      incident: "   ",
      objective: "",
      devices: [],
      evidenceSources: [],
      actionsTaken: [],
    });

    expect(answers).toEqual({});
  });

  it("preserves partial wizard state without forcing defaults", () => {
    const answers = toWizardAnswerMap({
      clientProfile: "private_individual",
      urgency: "time_sensitive",
      evidenceSources: ["phone_device"],
    });

    expect(answers).toEqual({
      clientProfile: "private_individual",
      urgency: "time_sensitive",
      evidenceSources: ["phone_device"],
    });
  });
});
