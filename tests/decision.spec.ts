import { describe, expect, it } from 'vitest';

import { resolveIntakeRoute } from '@/domain/flow';
import { assessIntake } from '@/domain/priority';
import type { ClientProfile, UrgencyLevel, WizardResult } from '@/types/wizard';

const BASE_RESULT: WizardResult = {
  clientProfile: 'private_individual',
  urgency: 'informational',
  hasEmotionalDistress: false,
  incident: 'Initial case summary',
  devices: 1,
  actionsTaken: [],
  evidenceSources: [],
  objective: 'Understand next legal step',
};

function buildResult(overrides: Partial<WizardResult>): WizardResult {
  return { ...BASE_RESULT, ...overrides };
}

describe('decision logic matrix', () => {
  describe('resolveIntakeRoute', () => {
    it('always routes critical urgency to critical route, regardless of client profile', () => {
      const profiles: ClientProfile[] = [
        'private_individual',
        'family_inheritance_conflict',
        'legal_professional',
        'court_related',
        'other',
      ];

      for (const clientProfile of profiles) {
        const route = resolveIntakeRoute(
          buildResult({
            clientProfile,
            urgency: 'critical',
          }),
        );

        expect(route).toBe('/contact/critical');
      }
    });

    it('routes family inheritance conflict to family route when urgency is not critical', () => {
      expect(
        resolveIntakeRoute(
          buildResult({
            clientProfile: 'family_inheritance_conflict',
            urgency: 'legal_risk',
          }),
        ),
      ).toBe('/contact/family');
    });

    it('routes legal and court-related profiles to legal route', () => {
      const legalProfiles: ClientProfile[] = ['legal_professional', 'court_related'];

      for (const clientProfile of legalProfiles) {
        expect(
          resolveIntakeRoute(
            buildResult({
              clientProfile,
              urgency: 'time_sensitive',
            }),
          ),
        ).toBe('/contact/legal');
      }
    });

    it('uses basic route for non-critical private and other profiles', () => {
      const basicProfiles: ClientProfile[] = ['private_individual', 'other'];

      for (const clientProfile of basicProfiles) {
        expect(
          resolveIntakeRoute(
            buildResult({
              clientProfile,
              urgency: 'informational',
            }),
          ),
        ).toBe('/contact/basic');
      }
    });
  });

  describe('assessIntake', () => {
    it('covers urgency-only variation matrix', () => {
      const cases: Array<{
        urgency: UrgencyLevel;
        expectedPriority: 'low' | 'medium' | 'high' | 'critical';
      }> = [
        { urgency: 'informational', expectedPriority: 'low' },
        { urgency: 'time_sensitive', expectedPriority: 'low' },
        { urgency: 'legal_risk', expectedPriority: 'medium' },
        { urgency: 'critical', expectedPriority: 'high' },
      ];

      for (const { urgency, expectedPriority } of cases) {
        const assessment = assessIntake(
          buildResult({
            clientProfile: 'private_individual',
            urgency,
            hasEmotionalDistress: false,
          }),
        );

        expect(assessment.priority).toBe(expectedPriority);
      }
    });

    it('applies profile flags and scoring consistently', () => {
      const family = assessIntake(
        buildResult({
          clientProfile: 'family_inheritance_conflict',
          urgency: 'informational',
        }),
      );
      expect(family.flags).toContain('family_conflict');
      expect(family.priority).toBe('medium');

      const court = assessIntake(
        buildResult({
          clientProfile: 'court_related',
          urgency: 'informational',
        }),
      );
      expect(court.flags).toContain('active_procedure');
      expect(court.priority).toBe('medium');

      const legalProfessional = assessIntake(
        buildResult({
          clientProfile: 'legal_professional',
          urgency: 'informational',
        }),
      );
      expect(legalProfessional.flags).toContain('legal_professional');
      expect(legalProfessional.priority).toBe('low');
    });

    it('adds emotional distress flag and increases priority on boundary conditions', () => {
      const noDistress = assessIntake(
        buildResult({
          clientProfile: 'private_individual',
          urgency: 'informational',
          hasEmotionalDistress: false,
        }),
      );
      expect(noDistress.priority).toBe('low');
      expect(noDistress.flags).not.toContain('emotional_distress');

      const withDistress = assessIntake(
        buildResult({
          clientProfile: 'private_individual',
          urgency: 'time_sensitive',
          hasEmotionalDistress: true,
        }),
      );
      expect(withDistress.priority).toBe('medium');
      expect(withDistress.flags).toContain('emotional_distress');
    });

    it('respects exact scoring boundaries for low/medium/high/critical priorities', () => {
      // score 2 -> low
      expect(
        assessIntake(
          buildResult({
            clientProfile: 'legal_professional',
            urgency: 'informational',
            hasEmotionalDistress: false,
          }),
        ).priority,
      ).toBe('low');

      // score 3 -> medium
      expect(
        assessIntake(
          buildResult({
            clientProfile: 'family_inheritance_conflict',
            urgency: 'informational',
            hasEmotionalDistress: false,
          }),
        ).priority,
      ).toBe('medium');

      // score 5 -> high
      expect(
        assessIntake(
          buildResult({
            clientProfile: 'family_inheritance_conflict',
            urgency: 'time_sensitive',
            hasEmotionalDistress: false,
          }),
        ).priority,
      ).toBe('high');

      // score 8 -> critical
      expect(
        assessIntake(
          buildResult({
            clientProfile: 'court_related',
            urgency: 'legal_risk',
            hasEmotionalDistress: false,
          }),
        ).priority,
      ).toBe('critical');
    });

    it('returns expected recommendation text by priority tier', () => {
      expect(
        assessIntake(
          buildResult({
            clientProfile: 'other',
            urgency: 'informational',
            hasEmotionalDistress: false,
          }),
        ).recommendedAction,
      ).toBe('Deferred or informational response');

      expect(
        assessIntake(
          buildResult({
            clientProfile: 'court_related',
            urgency: 'informational',
            hasEmotionalDistress: false,
          }),
        ).recommendedAction,
      ).toBe('Standard review');

      expect(
        assessIntake(
          buildResult({
            clientProfile: 'family_inheritance_conflict',
            urgency: 'time_sensitive',
            hasEmotionalDistress: false,
          }),
        ).recommendedAction,
      ).toBe('Priority review within 24–48h');

      expect(
        assessIntake(
          buildResult({
            clientProfile: 'court_related',
            urgency: 'legal_risk',
            hasEmotionalDistress: false,
          }),
        ).recommendedAction,
      ).toBe('Immediate human contact and evidence preservation guidance');
    });
  });
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
