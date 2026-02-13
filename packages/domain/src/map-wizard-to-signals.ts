import type { WizardResult } from "./wizard-result";

import type {
  EvidenceLevel,
  ExposureState,
  IncidentType,
  IntakeSignals,
  RiskLevel,
  SensitivityFlag,
} from "./intake-signals";

function deriveIncidentType(result: WizardResult): IncidentType {
  switch (result.clientProfile) {
    case "family_inheritance_conflict":
      return "family_dispute";
    case "legal_professional":
      return "legal_professional_case";
    case "court_related":
      return "court_proceeding";
    case "private_individual":
      return "private_case";
    default:
      return "unknown";
  }
}

function deriveRiskLevel(result: WizardResult): RiskLevel {
  switch (result.urgency) {
    case "time_sensitive":
      return "medium";
    case "legal_risk":
      return "high";
    case "critical":
      return "imminent";
    default:
      return "low";
  }
}

function containsAnyKeyword(values: string[], keywords: string[]): boolean {
  return values.some((value: string): boolean => {
    const normalized: string = value.toLowerCase();
    return keywords.some((keyword: string): boolean =>
      normalized.includes(keyword),
    );
  });
}

function deriveEvidenceLevel(result: WizardResult): EvidenceLevel {
  const normalizedSources: string[] = result.evidenceSources.map(
    (source: string): string => source.toLowerCase(),
  );

  if (normalizedSources.length === 0) {
    return result.devices > 0 ? "full_device" : "none";
  }

  const hasDeviceEvidence: boolean = containsAnyKeyword(normalizedSources, [
    "device",
    "phone",
    "computer",
    "laptop",
    "tablet",
    "forensic",
  ]);
  const hasScreenshotEvidence: boolean = containsAnyKeyword(normalizedSources, [
    "screenshot",
    "screen capture",
    "screen recording",
  ]);
  const hasMessageEvidence: boolean = containsAnyKeyword(normalizedSources, [
    "message",
    "chat",
    "sms",
    "whatsapp",
    "email",
    "dm",
  ]);

  if (hasDeviceEvidence || result.devices > 0) {
    return "full_device";
  }

  if (hasScreenshotEvidence && !hasMessageEvidence) {
    return "screenshots";
  }

  if (hasMessageEvidence && !hasScreenshotEvidence) {
    return "messages_only";
  }

  return "mixed";
}

function deriveExposureState(result: WizardResult): ExposureState {
  const actions: string[] = result.actionsTaken.map((action: string): string =>
    action.toLowerCase(),
  );
  const objective: string = result.objective.toLowerCase();

  if (
    containsAnyKeyword(actions, ["secured", "contained", "blocked", "reset"]) ||
    objective.includes("prevent")
  ) {
    return "contained";
  }

  if (containsAnyKeyword(actions, ["monitor", "review", "collect"])) {
    return "potential";
  }

  if (
    containsAnyKeyword(actions, ["report", "escalate", "contact authority"])
  ) {
    return "active";
  }

  return "unknown";
}

function deriveSensitivityFlags(result: WizardResult): SensitivityFlag[] {
  const flags: SensitivityFlag[] = [];
  if (result.hasEmotionalDistress) {
    flags.push("emotional_distress");
  }
  if (result.physicalSafetyRisk) {
    flags.push("physical_risk");
  }
  if (result.financialAssetRisk) {
    flags.push("financial_risk");
  }
  if (result.attackerHasPasswords) {
    flags.push("access_compromised");
  }
  if (result.evidenceIsAutoDeleted) {
    flags.push("evidence_volatility");
  }

  if (result.cognitiveProfile) {
    if (
      result.cognitiveProfile.cognitiveDistortion === true ||
      result.cognitiveProfile.perceivedOmnipotenceOfAttacker === true
    ) {
      flags.push("cognitive_distortion");
    }
    if (result.cognitiveProfile.emotionalShockLevel === "high") {
      flags.push("severe_shock");
    }
  }

  return flags;
}

function refineRiskLevel(
  riskLevel: RiskLevel,
  result: WizardResult,
): RiskLevel {
  if (
    result.dataSensitivityLevel === "high" &&
    (riskLevel === "low" || riskLevel === "medium")
  ) {
    return "high";
  }

  return riskLevel;
}

function refineEvidenceLevel(
  evidenceLevel: EvidenceLevel,
  result: WizardResult,
): EvidenceLevel {
  if (result.hasAccessToDevices === false && evidenceLevel !== "none") {
    return "messages_only";
  }

  return evidenceLevel;
}

function refineExposureState(
  exposureState: ExposureState,
  result: WizardResult,
): ExposureState {
  if (result.isOngoing) {
    return "active";
  }

  if (
    exposureState === "unknown" &&
    (result.estimatedIncidentStart === "weeks" ||
      result.estimatedIncidentStart === "months")
  ) {
    return "potential";
  }

  return exposureState;
}

export function mapWizardToSignals(result: WizardResult): IntakeSignals {
  const riskLevel: RiskLevel = refineRiskLevel(deriveRiskLevel(result), result);
  const evidenceLevel: EvidenceLevel = refineEvidenceLevel(
    deriveEvidenceLevel(result),
    result,
  );
  const exposureState: ExposureState = refineExposureState(
    deriveExposureState(result),
    result,
  );

  return {
    incidentType: deriveIncidentType(result),
    riskLevel,
    evidenceLevel,
    exposureState,
    sensitivityFlags: deriveSensitivityFlags(result),
    devicesCount: result.devices,
    actionsTaken: result.actionsTaken,
    evidenceSources: result.evidenceSources,
    objective: result.objective,
    incidentSummary: result.incident,
    thirdPartiesInvolved: Boolean(result.thirdPartiesInvolved),
  };
}
