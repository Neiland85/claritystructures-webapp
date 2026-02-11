import assert from 'node:assert/strict';
import test from 'node:test';

import { isReviewerAuthorized } from '../src/lib/admin-auth.js';

test('isReviewerAuthorized returns false when auth header is missing', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  assert.equal(isReviewerAuthorized(null), false);
});

test('isReviewerAuthorized returns false when env vars are missing', () => {
  delete process.env.INTAKE_REVIEWER_USER;
  delete process.env.INTAKE_REVIEWER_PASS;

  const authHeader = 'Basic ' + Buffer.from('admin:secret').toString('base64');
  assert.equal(isReviewerAuthorized(authHeader), false);
});

test('isReviewerAuthorized returns true for valid credentials', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  const authHeader = 'Basic ' + Buffer.from('admin:secret').toString('base64');
  assert.equal(isReviewerAuthorized(authHeader), true);
});

test('isReviewerAuthorized returns false for invalid username', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  const authHeader = 'Basic ' + Buffer.from('wronguser:secret').toString('base64');
  assert.equal(isReviewerAuthorized(authHeader), false);
});

test('isReviewerAuthorized returns false for invalid password', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  const authHeader = 'Basic ' + Buffer.from('admin:wrongpass').toString('base64');
  assert.equal(isReviewerAuthorized(authHeader), false);
});

test('isReviewerAuthorized handles malformed auth headers', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  assert.equal(isReviewerAuthorized('Bearer token'), false);
  assert.equal(isReviewerAuthorized('Basic'), false);
  assert.equal(isReviewerAuthorized('InvalidFormat'), false);
  assert.equal(isReviewerAuthorized(''), false);
});
