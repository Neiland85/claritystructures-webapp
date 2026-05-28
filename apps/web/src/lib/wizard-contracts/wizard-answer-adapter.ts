import type {
  AnswerValue,
  CanonicalFieldKey,
  WizardAnswerMap,
} from "@claritystructures/domain";

export type WizardUiAnswerState = Partial<{
  clientProfile: string | null;
  urgency: string | null;
  hasEmotionalDistress: boolean | null;
  physicalSafetyRisk: boolean | null;
  financialAssetRisk: boolean | null;
  attackerHasPasswords: boolean | null;
  evidenceIsAutoDeleted: boolean | null;
  perceivedOmnipotence: boolean | null;
  isVerifiable: boolean | null;
  distortionIndicator: boolean | null;
  shockLevel: string | number | null;
  isOngoing: boolean | null;
  hasAccessToDevices: boolean | null;
  dataSensitivityLevel: string | null;
  estimatedIncidentStart: string | null;
  thirdPartiesInvolved: boolean | null;
  incident: string | null;
  devices: string[];
  evidenceSources: string[];
  actionsTaken: string[];
  objective: string | null;
}>;

function hasValue(value: AnswerValue | undefined): value is AnswerValue {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

function setIfPresent(
  answers: WizardAnswerMap,
  field: CanonicalFieldKey,
  value: AnswerValue | undefined,
): void {
  if (hasValue(value)) {
    answers[field] = value;
  }
}

export function toWizardAnswerMap(state: WizardUiAnswerState): WizardAnswerMap {
  const answers: WizardAnswerMap = {};

  setIfPresent(answers, "clientProfile", state.clientProfile ?? undefined);
  setIfPresent(answers, "urgency", state.urgency ?? undefined);
  setIfPresent(
    answers,
    "hasEmotionalDistress",
    state.hasEmotionalDistress ?? undefined,
  );
  setIfPresent(
    answers,
    "physicalSafetyRisk",
    state.physicalSafetyRisk ?? undefined,
  );
  setIfPresent(
    answers,
    "financialAssetRisk",
    state.financialAssetRisk ?? undefined,
  );
  setIfPresent(
    answers,
    "attackerHasPasswords",
    state.attackerHasPasswords ?? undefined,
  );
  setIfPresent(
    answers,
    "evidenceIsAutoDeleted",
    state.evidenceIsAutoDeleted ?? undefined,
  );
  setIfPresent(
    answers,
    "perceivedOmnipotence",
    state.perceivedOmnipotence ?? undefined,
  );
  setIfPresent(answers, "isVerifiable", state.isVerifiable ?? undefined);
  setIfPresent(
    answers,
    "distortionIndicator",
    state.distortionIndicator ?? undefined,
  );
  setIfPresent(answers, "shockLevel", state.shockLevel ?? undefined);
  setIfPresent(answers, "isOngoing", state.isOngoing ?? undefined);
  setIfPresent(
    answers,
    "hasAccessToDevices",
    state.hasAccessToDevices ?? undefined,
  );
  setIfPresent(
    answers,
    "dataSensitivityLevel",
    state.dataSensitivityLevel ?? undefined,
  );
  setIfPresent(
    answers,
    "estimatedIncidentStart",
    state.estimatedIncidentStart ?? undefined,
  );
  setIfPresent(
    answers,
    "thirdPartiesInvolved",
    state.thirdPartiesInvolved ?? undefined,
  );
  setIfPresent(answers, "incident", state.incident ?? undefined);
  setIfPresent(answers, "devices", state.devices);
  setIfPresent(answers, "evidenceSources", state.evidenceSources);
  setIfPresent(answers, "actionsTaken", state.actionsTaken);
  setIfPresent(answers, "objective", state.objective ?? undefined);

  return answers;
}
