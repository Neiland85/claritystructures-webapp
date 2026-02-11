import type { WizardResult } from '../../src/types/wizard.js';

export type CanonicalDecisionScenario = {
  name: string;
  input: WizardResult;
};

function buildResult(overrides: Partial<WizardResult> = {}): WizardResult {
  return {
    clientProfile: 'private_individual',
    urgency: 'informational',
    hasEmotionalDistress: false,
    incident: 'Suspicious profile activity under review',
    devices: 1,
    actionsTaken: [],
    evidenceSources: [],
    objective: 'Understand legal and technical next steps',
    ...overrides,
  };
}

export const canonicalDecisionCases: CanonicalDecisionScenario[] = [
  {
    name: 'low informational baseline',
    input: buildResult({
      urgency: 'informational',
    }),
  },
  {
    name: 'medium time sensitive baseline',
    input: buildResult({
      urgency: 'time_sensitive',
      hasEmotionalDistress: true,
    }),
  },
  {
    name: 'high legal risk baseline',
    input: buildResult({
      clientProfile: 'legal_professional',
      urgency: 'legal_risk',
    }),
  },
  {
    name: 'critical urgency route override',
    input: buildResult({
      clientProfile: 'family_inheritance_conflict',
      urgency: 'critical',
    }),
  },
  {
    name: 'high data sensitivity refinement',
    input: buildResult({
      urgency: 'informational',
      dataSensitivityLevel: 'high',
    }),
  },
  {
    name: 'ongoing incident exposure refinement',
    input: buildResult({
      urgency: 'informational',
      isOngoing: true,
    }),
  },
  {
    name: 'no device access with messages only evidence',
    input: buildResult({
      hasAccessToDevices: false,
      evidenceSources: ['chat export from mobile app'],
      devices: 0,
    }),
  },
  {
    name: 'long duration incident months',
    input: buildResult({
      urgency: 'informational',
      estimatedIncidentStart: 'months',
    }),
  },
  {
    name: 'family conflict profile',
    input: buildResult({
      clientProfile: 'family_inheritance_conflict',
      urgency: 'time_sensitive',
    }),
  },
  {
    name: 'court related legal escalation',
    input: buildResult({
      clientProfile: 'court_related',
      urgency: 'legal_risk',
    }),
  },
];
