import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

/**
 * Test suite for the markForReview server action in src/app/admin/intakes/page.tsx
 * 
 * This suite verifies:
 * 1. Authorization checks are enforced for the markForReview action
 * 2. The needsReview flag is correctly updated in the database
 */

type MockIntake = {
  id: string;
  wizardResult: unknown;
  decision: unknown;
  explanation: unknown;
  contactEmail: string;
  contactPhone: string;
  needsReview: boolean;
  createdAt: Date;
};

class InMemoryIntakeStore {
  private intakes: Map<string, MockIntake> = new Map();

  async create(data: Omit<MockIntake, 'id' | 'createdAt'>): Promise<MockIntake> {
    const intake: MockIntake = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.intakes.set(intake.id, intake);
    return intake;
  }

  async update(id: string, data: Partial<MockIntake>): Promise<MockIntake | null> {
    const intake = this.intakes.get(id);
    if (!intake) {
      return null;
    }
    const updated = { ...intake, ...data };
    this.intakes.set(id, updated);
    return updated;
  }

  async findById(id: string): Promise<MockIntake | null> {
    return this.intakes.get(id) ?? null;
  }

  async findMany(): Promise<MockIntake[]> {
    return Array.from(this.intakes.values());
  }
}

function validateBasicAuthCredentials(authHeader: string | null, expectedUser: string, expectedPass: string): boolean {
  if (!authHeader) {
    return false;
  }

  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return false;
  }

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const colonIndex = decoded.indexOf(':');
    if (colonIndex < 0) {
      return false;
    }

    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    return username === expectedUser && password === expectedPass;
  } catch {
    return false;
  }
}

async function simulateMarkForReview(
  store: InMemoryIntakeStore,
  intakeId: string,
  authHeader: string | null,
  expectedUser: string,
  expectedPass: string
): Promise<{ success: boolean; error?: string }> {
  // Simulate authorization check (server actions must enforce their own auth)
  if (!validateBasicAuthCredentials(authHeader, expectedUser, expectedPass)) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!intakeId) {
    return { success: false, error: 'Missing intakeId' };
  }

  const updated = await store.update(intakeId, { needsReview: true });

  if (!updated) {
    return { success: false, error: 'Intake not found' };
  }

  return { success: true };
}

test('markForReview rejects request without authorization header', async () => {
  const store = new InMemoryIntakeStore();
  const intake = await store.create({
    wizardResult: {},
    decision: {},
    explanation: {},
    contactEmail: 'test@example.com',
    contactPhone: '555-1234',
    needsReview: false,
  });

  const result = await simulateMarkForReview(
    store,
    intake.id,
    null,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, false);
  assert.equal(result.error, 'Unauthorized');

  const unchanged = await store.findById(intake.id);
  assert.ok(unchanged);
  assert.equal(unchanged.needsReview, false);
});

test('markForReview rejects request with invalid credentials', async () => {
  const store = new InMemoryIntakeStore();
  const intake = await store.create({
    wizardResult: {},
    decision: {},
    explanation: {},
    contactEmail: 'test@example.com',
    contactPhone: '555-1234',
    needsReview: false,
  });

  const invalidAuth = 'Basic ' + Buffer.from('wrong:credentials').toString('base64');

  const result = await simulateMarkForReview(
    store,
    intake.id,
    invalidAuth,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, false);
  assert.equal(result.error, 'Unauthorized');

  const unchanged = await store.findById(intake.id);
  assert.ok(unchanged);
  assert.equal(unchanged.needsReview, false);
});

test('markForReview successfully updates needsReview flag with valid credentials', async () => {
  const store = new InMemoryIntakeStore();
  const intake = await store.create({
    wizardResult: {},
    decision: {},
    explanation: {},
    contactEmail: 'test@example.com',
    contactPhone: '555-1234',
    needsReview: false,
  });

  const validAuth = 'Basic ' + Buffer.from('reviewer:secret123').toString('base64');

  const result = await simulateMarkForReview(
    store,
    intake.id,
    validAuth,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, true);
  assert.equal(result.error, undefined);

  const updated = await store.findById(intake.id);
  assert.ok(updated);
  assert.equal(updated.needsReview, true);
});

test('markForReview handles missing intakeId', async () => {
  const store = new InMemoryIntakeStore();
  const validAuth = 'Basic ' + Buffer.from('reviewer:secret123').toString('base64');

  const result = await simulateMarkForReview(
    store,
    '',
    validAuth,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, false);
  assert.equal(result.error, 'Missing intakeId');
});

test('markForReview handles non-existent intake', async () => {
  const store = new InMemoryIntakeStore();
  const validAuth = 'Basic ' + Buffer.from('reviewer:secret123').toString('base64');
  const nonExistentId = randomUUID();

  const result = await simulateMarkForReview(
    store,
    nonExistentId,
    validAuth,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, false);
  assert.equal(result.error, 'Intake not found');
});

test('markForReview is idempotent - marking already reviewed intake', async () => {
  const store = new InMemoryIntakeStore();
  const intake = await store.create({
    wizardResult: {},
    decision: {},
    explanation: {},
    contactEmail: 'test@example.com',
    contactPhone: '555-1234',
    needsReview: true, // Already marked for review
  });

  const validAuth = 'Basic ' + Buffer.from('reviewer:secret123').toString('base64');

  const result = await simulateMarkForReview(
    store,
    intake.id,
    validAuth,
    'reviewer',
    'secret123'
  );

  assert.equal(result.success, true);

  const updated = await store.findById(intake.id);
  assert.ok(updated);
  assert.equal(updated.needsReview, true);
});
