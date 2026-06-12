import type { WizardResult } from "@claritystructures/domain";

export type GovernanceRiskLevel = "low" | "medium" | "high";

export type IntakeGovernanceEnvelope = {
  schemaVersion: "0.1";
  source: "clarity-webapp";
  createdAt: string;
  requestId: string;
  wizardResult: WizardResult;
  governanceContext: {
    riskLevel: GovernanceRiskLevel;
    requiresHumanReview: boolean;
    requiresLegalDerivation: boolean;
    allowsAutomatedPreclassification: boolean;
    allowsEvidenceHandling: boolean;
  };
  evidenceScope: {
    hasDeviceAccess: boolean;
    evidenceSources: string[];
    devices: number;
    dataSensitivityLevel?: "low" | "medium" | "high";
    thirdPartiesInvolved?: boolean;
  };
  consent: {
    consentVersion: string;
    ipHash?: string;
    userAgent?: string;
  };
  integrity: {
    wizardResultHash: string;
    hashAlgorithm: "stable-json-djb2-v0";
    policyBundleVersion: string;
  };
};

export type GovernanceEnvelopeInput = {
  wizardResult: WizardResult;
  requestId: string;
  consentVersion: string;
  policyBundleVersion: string;
  createdAt?: string;
  ipHash?: string;
  userAgent?: string;
};

export function createIntakeGovernanceEnvelope(
  input: GovernanceEnvelopeInput,
): IntakeGovernanceEnvelope {
  const riskLevel = deriveGovernanceRiskLevel(input.wizardResult);

  return {
    schemaVersion: "0.1",
    source: "clarity-webapp",
    createdAt: input.createdAt ?? new Date().toISOString(),
    requestId: input.requestId,
    wizardResult: input.wizardResult,
    governanceContext: {
      riskLevel,
      requiresHumanReview: riskLevel !== "low",
      requiresLegalDerivation: input.wizardResult.urgency === "legal_risk",
      allowsAutomatedPreclassification: riskLevel === "low",
      allowsEvidenceHandling: riskLevel === "low",
    },
    evidenceScope: {
      hasDeviceAccess: input.wizardResult.hasAccessToDevices ?? false,
      evidenceSources: input.wizardResult.evidenceSources,
      devices: input.wizardResult.devices,
      dataSensitivityLevel: input.wizardResult.dataSensitivityLevel,
      thirdPartiesInvolved: input.wizardResult.thirdPartiesInvolved,
    },
    consent: {
      consentVersion: input.consentVersion,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    },
    integrity: {
      wizardResultHash: stableHash(input.wizardResult),
      hashAlgorithm: "stable-json-djb2-v0",
      policyBundleVersion: input.policyBundleVersion,
    },
  };
}

function deriveGovernanceRiskLevel(result: WizardResult): GovernanceRiskLevel {
  if (
    result.urgency === "critical" ||
    result.physicalSafetyRisk ||
    result.financialAssetRisk ||
    result.attackerHasPasswords ||
    result.dataSensitivityLevel === "high"
  ) {
    return "high";
  }

  if (
    result.urgency === "legal_risk" ||
    result.evidenceIsAutoDeleted ||
    result.thirdPartiesInvolved ||
    result.cognitiveProfile?.cognitiveDistortion
  ) {
    return "medium";
  }

  return "low";
}

function stableHash(value: unknown): string {
  const json = stableStringify(value);
  let hash = 5381;

  for (let index = 0; index < json.length; index += 1) {
    hash = (hash * 33) ^ json.charCodeAt(index);
  }

  return `djb2:${(hash >>> 0).toString(16)}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const object = value as Record<string, unknown>;
  const keys = Object.keys(object).sort();

  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
    .join(",")}}`;
}
