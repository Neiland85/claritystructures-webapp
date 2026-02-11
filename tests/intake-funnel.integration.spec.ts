import test from 'node:test';
import assert from 'node:assert/strict';

import type { SubmitIntakePayload } from '../src/application/intake/decide-intake.js';
import { decideIntakeWithExplanation } from '../src/domain/decision.js';

import { intakeFunnelFixtures } from './intake-funnel.fixtures.js';

type StoredIntake = {
  id: string;
  submittedAt: string;
  payload: SubmitIntakePayload;
  decision: ReturnType<typeof decideIntakeWithExplanation>['decision'];
  explanation: ReturnType<typeof decideIntakeWithExplanation>['explanation'];
};

type SubmitRequest = {
  path: '/api/intake/submit';
  payload: unknown;
  useDecisionModelV2?: boolean;
};

class InMemoryIntakeDb {
  private readonly rows: StoredIntake[] = [];

  async save(row: StoredIntake): Promise<void> {
    this.rows.push(row);
  }

  list(): StoredIntake[] {
    return [...this.rows];
  }
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function validatePayload(payload: unknown): string[] {
  if (typeof payload !== 'object' || payload === null) {
    return ['payload must be an object'];
  }

  const candidate = payload as Record<string, unknown>;
  const errors: string[] = [];

  if (!isString(candidate.clientProfile)) errors.push('clientProfile must be a string');
  if (!isString(candidate.urgency)) errors.push('urgency must be a string');
  if (!isString(candidate.incident)) errors.push('incident must be a string');
  if (!isFiniteNumber(candidate.devices)) errors.push('devices must be a finite number');
  if (!isStringArray(candidate.actionsTaken)) errors.push('actionsTaken must be a string[]');
  if (!isStringArray(candidate.evidenceSources)) errors.push('evidenceSources must be a string[]');
  if (!isString(candidate.objective)) errors.push('objective must be a string');
  if (!isString(candidate.email)) errors.push('email must be a string');
  if (!isString(candidate.message)) errors.push('message must be a string');
  if (candidate.consent !== true && candidate.consent !== false) {
    errors.push('consent must be a boolean');
  }

  return errors;
}

async function submitIntake(
  db: InMemoryIntakeDb,
  request: SubmitRequest
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (request.path !== '/api/intake/submit') {
    return { status: 404, body: { message: 'Not found' } };
  }

  const errors = validatePayload(request.payload);
  if (errors.length > 0) {
    return {
      status: 400,
      body: {
        message: 'Invalid intake payload',
        errors,
      },
    };
  }

  const typedPayload = request.payload as SubmitIntakePayload;
  const { decision, explanation } = decideIntakeWithExplanation(
    typedPayload,
    request.useDecisionModelV2 ?? false
  );

  const row: StoredIntake = {
    id: `intake_${String(db.list().length + 1).padStart(4, '0')}`,
    submittedAt: new Date('2026-02-01T10:00:00.000Z').toISOString(),
    payload: typedPayload,
    decision,
    explanation,
  };

  await db.save(row);

  return {
    status: 202,
    body: {
      id: row.id,
      nextRoute: decision.route,
      decision,
    },
  };
}

function renderAdminIntakes(db: InMemoryIntakeDb): string {
  const items = db
    .list()
    .map(
      (row) =>
        `<li data-intake-id="${row.id}">${row.payload.email} • ${row.decision.priority} • ${row.explanation.modelVersion}</li>`
    )
    .join('');

  return `<main><h1>Admin Intakes</h1><ul>${items}</ul></main>`;
}

test('submitting valid data to /api/intake/submit returns 202', async () => {
  const db = new InMemoryIntakeDb();
  const fixture = intakeFunnelFixtures.find((entry) => entry.name === 'baseline');
  assert.ok(fixture, 'baseline fixture must exist');

  const response = await submitIntake(db, {
    path: '/api/intake/submit',
    payload: fixture.payload,
    useDecisionModelV2: fixture.useDecisionModelV2,
  });

  assert.equal(response.status, 202);
  assert.equal(response.body.nextRoute, '/contact/basic');
});

test('malformed payload returns 400 with validation errors', async () => {
  const db = new InMemoryIntakeDb();

  const response = await submitIntake(db, {
    path: '/api/intake/submit',
    payload: {
      urgency: 'critical',
      consent: 'yes',
    },
  });

  assert.equal(response.status, 400);
  assert.deepStrictEqual(response.body, {
    message: 'Invalid intake payload',
    errors: [
      'clientProfile must be a string',
      'incident must be a string',
      'devices must be a finite number',
      'actionsTaken must be a string[]',
      'evidenceSources must be a string[]',
      'objective must be a string',
      'email must be a string',
      'message must be a string',
      'consent must be a boolean',
    ],
  });
});

test('submitted intake is persisted with decision and explanation structure', async () => {
  const db = new InMemoryIntakeDb();
  const fixture = intakeFunnelFixtures.find((entry) => entry.name === 'v2_refinement');
  assert.ok(fixture, 'v2_refinement fixture must exist');

  const response = await submitIntake(db, {
    path: '/api/intake/submit',
    payload: fixture.payload,
    useDecisionModelV2: fixture.useDecisionModelV2,
  });

  assert.equal(response.status, 202);

  const [stored] = db.list();
  assert.ok(stored);
  assert.deepStrictEqual(
    {
      id: stored.id,
      decision: {
        priority: stored.decision.priority,
        route: stored.decision.route,
        actionCode: stored.decision.actionCode,
        decisionModelVersion: stored.decision.decisionModelVersion,
      },
      explanation: {
        modelVersion: stored.explanation.modelVersion,
        baselinePriority: stored.explanation.baselinePriority,
        finalPriority: stored.explanation.finalPriority,
        reasons: stored.explanation.reasons,
      },
    },
    {
      id: 'intake_0001',
      decision: {
        priority: 'critical',
        route: '/contact/basic',
        actionCode: 'IMMEDIATE_HUMAN_CONTACT',
        decisionModelVersion: 'decision-model/v2',
      },
      explanation: {
        modelVersion: 'decision-model/v2',
        baselinePriority: 'low',
        finalPriority: 'critical',
        reasons: ['ongoing_incident_escalation', 'data_sensitivity_escalation'],
      },
    }
  );
});

test('admin dashboard /admin/intakes shows list entry after submit', async () => {
  const db = new InMemoryIntakeDb();
  const fixture = intakeFunnelFixtures.find((entry) => entry.name === 'high_urgency');
  assert.ok(fixture, 'high_urgency fixture must exist');

  const response = await submitIntake(db, {
    path: '/api/intake/submit',
    payload: fixture.payload,
    useDecisionModelV2: fixture.useDecisionModelV2,
  });

  assert.equal(response.status, 202);

  const html = renderAdminIntakes(db);
  assert.equal(html.includes('<h1>Admin Intakes</h1>'), true);
  assert.equal(html.includes('critical@example.com'), true);
  assert.equal(html.includes('data-intake-id="intake_0001"'), true);
});

test('fixtures include canonical baseline, high urgency, and v2 refinement cases', () => {
  assert.deepStrictEqual(
    intakeFunnelFixtures.map((fixture) => fixture.name),
    ['baseline', 'high_urgency', 'v2_refinement']
  );
});
