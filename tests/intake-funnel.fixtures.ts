import type { SubmitIntakePayload } from '../src/application/intake/decide-intake.js';

export type IntakeFunnelFixture = {
  name: 'baseline' | 'high_urgency' | 'v2_refinement';
  payload: SubmitIntakePayload;
  useDecisionModelV2?: boolean;
};

function buildPayload(overrides: Partial<SubmitIntakePayload> = {}): SubmitIntakePayload {
  return {
    clientProfile: 'private_individual',
    urgency: 'informational',
    hasEmotionalDistress: false,
    incident: 'Potential account compromise from unknown actor',
    devices: 1,
    actionsTaken: ['changed password'],
    evidenceSources: ['email headers'],
    objective: 'Assess legal and technical next steps',
    email: 'intake@example.com',
    message: 'Need advice on preserving evidence and securing access.',
    consent: true,
    ...overrides,
  };
}

export const intakeFunnelFixtures: IntakeFunnelFixture[] = [
  {
    name: 'baseline',
    payload: buildPayload(),
  },
  {
    name: 'high_urgency',
    payload: buildPayload({
      clientProfile: 'family_inheritance_conflict',
      urgency: 'critical',
      hasEmotionalDistress: true,
      email: 'critical@example.com',
    }),
  },
  {
    name: 'v2_refinement',
    useDecisionModelV2: true,
    payload: buildPayload({
      urgency: 'informational',
      dataSensitivityLevel: 'high',
      isOngoing: true,
      hasAccessToDevices: false,
      evidenceSources: ['chat export'],
      devices: 0,
      email: 'refinement@example.com',
    }),
  },
];
