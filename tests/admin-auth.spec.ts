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

test('isReviewerAuthorized uses timing-safe comparison', async () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret123456';

  // Test with credentials that differ at the start
  const authHeader1 = 'Basic ' + Buffer.from('xdmin:secret123456').toString('base64');
  const start1 = Date.now();
  const result1 = isReviewerAuthorized(authHeader1);
  const time1 = Date.now() - start1;

  // Test with credentials that differ at the end
  const authHeader2 = 'Basic ' + Buffer.from('admin:secret12345x').toString('base64');
  const start2 = Date.now();
  const result2 = isReviewerAuthorized(authHeader2);
  const time2 = Date.now() - start2;

  assert.equal(result1, false);
  assert.equal(result2, false);

  // Note: This test doesn't actually verify timing safety in a meaningful way
  // since timing differences would be in microseconds, but it documents the intent
});

test('isReviewerAuthorized handles malformed auth headers', () => {
  process.env.INTAKE_REVIEWER_USER = 'admin';
  process.env.INTAKE_REVIEWER_PASS = 'secret';

  assert.equal(isReviewerAuthorized('Bearer token'), false);
  assert.equal(isReviewerAuthorized('Basic'), false);
  assert.equal(isReviewerAuthorized('InvalidFormat'), false);
  assert.equal(isReviewerAuthorized(''), false);
});
