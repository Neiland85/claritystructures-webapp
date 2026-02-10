import test from 'node:test';
import assert from 'node:assert/strict';

import { DECISION_MODEL_VERSION, decideIntake } from '../src/domain/decision.ts';
import type { WizardResult } from '../src/types/wizard.ts';

function buildResult(overrides: Partial<WizardResult> = {}): WizardResult {
  return {
    clientProfile: 'private_individual',
    urgency: 'informational',
    hasEmotionalDistress: false,
    incident: 'incident',
    devices: 1,
    actionsTaken: [],
    evidenceSources: [],
    objective: 'objective',
    ...overrides,
  };
}

test('returns default low-priority basic route decision', () => {
  const result = decideIntake(buildResult());

  assert.equal(result.route, '/contact/basic');
  assert.equal(result.priority, 'low');
  assert.deepEqual(result.flags, []);
  assert.equal(result.actionCode, 'DEFERRED_INFORMATIONAL_RESPONSE');
  assert.equal(result.decisionModelVersion, DECISION_MODEL_VERSION);
});

test('critical urgency forces critical route and critical action', () => {
  const result = decideIntake(
    buildResult({
      clientProfile: 'family_inheritance_conflict',
      urgency: 'critical',
      hasEmotionalDistress: true,
    })
  );

  assert.equal(result.route, '/contact/critical');
  assert.equal(result.priority, 'critical');
  assert.deepEqual(result.flags, ['family_conflict', 'emotional_distress']);
  assert.equal(result.actionCode, 'IMMEDIATE_HUMAN_CONTACT');
});

test('court-related legal risk yields critical priority with legal route', () => {
  const result = decideIntake(
    buildResult({
      clientProfile: 'court_related',
      urgency: 'legal_risk',
    })
  );

  assert.equal(result.route, '/contact/legal');
  assert.equal(result.priority, 'critical');
  assert.deepEqual(result.flags, ['active_procedure']);
  assert.equal(result.actionCode, 'IMMEDIATE_HUMAN_CONTACT');
});

test('family conflict + time-sensitive yields high priority with family route', () => {
  const result = decideIntake(
    buildResult({
      clientProfile: 'family_inheritance_conflict',
      urgency: 'time_sensitive',
    })
  );

  assert.equal(result.route, '/contact/family');
  assert.equal(result.priority, 'high');
  assert.deepEqual(result.flags, ['family_conflict']);
  assert.equal(result.actionCode, 'PRIORITY_REVIEW_24_48H');
});

test('legal professional only yields low priority and legal route', () => {
  const result = decideIntake(
    buildResult({
      clientProfile: 'legal_professional',
      urgency: 'informational',
    })
  );

  assert.equal(result.route, '/contact/legal');
  assert.equal(result.priority, 'low');
  assert.deepEqual(result.flags, ['legal_professional']);
  assert.equal(result.actionCode, 'DEFERRED_INFORMATIONAL_RESPONSE');
});
