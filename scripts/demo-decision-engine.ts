import {
  decideIntake,
  decideIntakeV2,
  decideIntakeWithExplanation,
  type WizardResult,
} from "../src/domain/decision-engine.js";

type DemoCase = {
  name: string;
  input: WizardResult;
};

const demoCases: DemoCase[] = [
  {
    name: "baseline-private-informational",
    input: {
      clientProfile: "private_individual",
      urgency: "informational",
      hasEmotionalDistress: false,
      incident: "Unknown-device message access attempt",
      devices: 1,
      actionsTaken: ["changed_passwords"],
      evidenceSources: ["messages"],
      objective: "assess_exposure",
    },
  },
  {
    name: "v2-refinement-high-sensitivity-active",
    input: {
      clientProfile: "private_individual",
      urgency: "time_sensitive",
      hasEmotionalDistress: false,
      incident: "Ongoing unauthorized cloud backup sync",
      devices: 2,
      actionsTaken: ["revoked_sessions", "enabled_2fa"],
      evidenceSources: ["messages", "device_logs"],
      objective: "contain_and_preserve",
      isOngoing: true,
      hasAccessToDevices: true,
      dataSensitivityLevel: "high",
      estimatedIncidentStart: "weeks",
      thirdPartiesInvolved: true,
    },
  },
  {
    name: "v2-refinement-no-device-access",
    input: {
      clientProfile: "private_individual",
      urgency: "informational",
      hasEmotionalDistress: false,
      incident: "Potential impersonation via chat account",
      devices: 1,
      actionsTaken: ["captured_screenshots"],
      evidenceSources: ["messages"],
      objective: "prepare_report",
      isOngoing: false,
      hasAccessToDevices: false,
      dataSensitivityLevel: "low",
      estimatedIncidentStart: "recent",
      thirdPartiesInvolved: false,
    },
  },
];

for (const demoCase of demoCases) {
  const v1Decision = decideIntake(demoCase.input);
  const v2Decision = decideIntakeV2(demoCase.input);
  const { explanation } = decideIntakeWithExplanation(demoCase.input, true);

  console.log(`\n=== ${demoCase.name} ===`);
  console.log("V1 decision:");
  console.log(JSON.stringify(v1Decision, null, 2));
  console.log("V2 decision:");
  console.log(JSON.stringify(v2Decision, null, 2));
  console.log("V2 explanation reasons:");
  console.log(JSON.stringify(explanation.reasons, null, 2));
}
