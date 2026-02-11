import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildIntakeSubmitHandler,
  isIntakePayload,
  toWizardResult,
  type IntakeSubmitDeps,
} from '../src/application/intake/intake-submit.js';
import { toAdminIntakeRows } from '../src/application/intake/admin-intakes-view.js';

const validPayload = {
  conflictDescription: 'Persistent impersonation and credential abuse.',
  urgency: 'legal_risk',
  isIncidentOngoing: 'yes',
  hasAccessToDevices: 'no',
  estimatedIncidentStart: 'weeks',
  contactEmail: 'person@example.com',
  contactPhone: '+57 300 000 0000',
} as const;

test('form submission payload validates and maps to wizard result deterministically', () => {
  assert.equal(isIntakePayload(validPayload), true);

  const wizard = toWizardResult(validPayload);

  assert.equal(wizard.clientProfile, 'other');
  assert.equal(wizard.urgency, 'legal_risk');
  assert.equal(wizard.isOngoing, true);
  assert.equal(wizard.hasAccessToDevices, false);
  assert.equal(wizard.estimatedIncidentStart, 'weeks');
  assert.equal(wizard.devices, 0);
});

test('backend validation rejects malformed submissions', async () => {
  const deps: IntakeSubmitDeps = {
    saveIntake: async () => ({ id: 'x' }),
    notify: async () => undefined,
    logger: console,
  };

  const handler = buildIntakeSubmitHandler(deps);

  const response = await handler({ urgency: 'critical' });

  assert.equal(response.status, 400);
});

test('submission runs decision/explanation persistence and notification flow', async () => {
  const savedInputs: unknown[] = [];
  const sentNotifications: unknown[] = [];

  const deps: IntakeSubmitDeps = {
    saveIntake: async (input) => {
      savedInputs.push(input);
      return { id: 'intake-123' };
    },
    notify: async (input) => {
      sentNotifications.push(input);
    },
    logger: console,
  };

  const handler = buildIntakeSubmitHandler(deps);

  const response = await handler(validPayload);

  assert.equal(response.status, 201);
  assert.equal(savedInputs.length, 1);
  assert.equal(sentNotifications.length, 1);

  const saved = savedInputs[0] as { decision: { decisionModelVersion: string }; explanation: { reasons: string[] } };
  assert.equal(saved.decision.decisionModelVersion, 'decision-model/v2');
  assert.equal(Array.isArray(saved.explanation.reasons), true);
});

test('admin dashboard list rendering adapter returns expected fields', () => {
  const rows = toAdminIntakeRows([
    {
      id: 'i1',
      contactEmail: 'one@example.com',
      contactPhone: '+1',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      needsReview: false,
      decision: {
        priority: 'high',
        route: '/contact/legal',
        flags: [],
        actionCode: 'PRIORITY_REVIEW_24_48H',
        decisionModelVersion: 'decision-model/v2',
      },
      explanation: {
        reasons: ['urgency_based_routing'],
        baselinePriority: 'medium',
        finalPriority: 'high',
        modelVersion: 'decision-model/v2',
      },
    },
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.priority, 'high');
  assert.deepEqual(rows[0]?.reasons, ['urgency_based_routing']);
  assert.equal(rows[0]?.createdAtIso, '2026-01-01T00:00:00.000Z');
});
