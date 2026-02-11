export const INCIDENT_TYPES = [
  'private_case',
  'family_dispute',
  'legal_professional_case',
  'court_proceeding',
  'unknown',
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

export const RISK_LEVELS = ['low', 'medium', 'high', 'imminent'] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const EVIDENCE_LEVELS = [
  'none',
  'messages_only',
  'screenshots',
  'full_device',
  'mixed',
] as const;

export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const EXPOSURE_STATES = ['unknown', 'potential', 'active', 'contained'] as const;

export type ExposureState = (typeof EXPOSURE_STATES)[number];

export const SENSITIVITY_FLAGS = ['emotional_distress'] as const;

export type SensitivityFlag = (typeof SENSITIVITY_FLAGS)[number];

export type IntakeSignals = {
  incidentType: IncidentType;
  riskLevel: RiskLevel;
  evidenceLevel: EvidenceLevel;
  exposureState: ExposureState;
  sensitivityFlags: SensitivityFlag[];
  devicesCount: number;
  actionsTaken: string[];
  evidenceSources: string[];
  objective: string;
  incidentSummary: string;
  thirdPartiesInvolved: boolean;
};

export type IntakeSignalSummary = {
  headline: string;
  bullets: string[];
  recommendedNextStep: string;
};

export function buildSummary(signals: IntakeSignals): IntakeSignalSummary {
  return {
    headline: `${signals.riskLevel.toUpperCase()} risk ${signals.incidentType.replaceAll('_', ' ')}`,
    bullets: [
      `Evidence: ${signals.evidenceLevel.replaceAll('_', ' ')}`,
      `Exposure: ${signals.exposureState.replaceAll('_', ' ')}`,
      `Devices: ${signals.devicesCount}`,
    ],
    recommendedNextStep:
      signals.riskLevel === 'imminent' || signals.riskLevel === 'high'
        ? 'Prioritize prompt specialist review'
        : 'Follow standard intake review workflow',
  };
}
