import assert from 'node:assert/strict';
import test from 'node:test';

import { isReviewerAuthorized } from '../src/lib/admin-auth.js';

test('isReviewerAuthorized returns false when credentials are missing', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    delete process.env.INTAKE_REVIEWER_USER;
    delete process.env.INTAKE_REVIEWER_PASS;

    assert.equal(isReviewerAuthorized('Basic dGVzdDp0ZXN0'), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
  }
});

test('isReviewerAuthorized returns false when auth header is null', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    assert.equal(isReviewerAuthorized(null), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});

test('isReviewerAuthorized returns false for malformed Basic auth header', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    assert.equal(isReviewerAuthorized('Bearer token'), false);
    assert.equal(isReviewerAuthorized('Basic'), false);
    assert.equal(isReviewerAuthorized('Basic !!!invalid!!!'), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});

test('isReviewerAuthorized returns false for incorrect username', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    // Base64 for "wronguser:secret"
    const wrongUserAuth = Buffer.from('wronguser:secret').toString('base64');

    assert.equal(isReviewerAuthorized(`Basic ${wrongUserAuth}`), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});

test('isReviewerAuthorized returns false for incorrect password', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    // Base64 for "admin:wrongpass"
    const wrongPassAuth = Buffer.from('admin:wrongpass').toString('base64');

    assert.equal(isReviewerAuthorized(`Basic ${wrongPassAuth}`), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});

test('isReviewerAuthorized returns true for correct credentials', () => {
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    // Base64 for "admin:secret"
    const validAuth = Buffer.from('admin:secret').toString('base64');

    assert.equal(isReviewerAuthorized(`Basic ${validAuth}`), true);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});

test('isReviewerAuthorized handles different length credentials without throwing', () => {
  // This test verifies that the function handles different-length credentials
  // gracefully without throwing errors (SHA-256 hashing ensures fixed-length buffers)
  const originalUser = process.env.INTAKE_REVIEWER_USER;
  const originalPass = process.env.INTAKE_REVIEWER_PASS;

  try {
    process.env.INTAKE_REVIEWER_USER = 'admin';
    process.env.INTAKE_REVIEWER_PASS = 'secret';

    // Base64 for "a:b" (much shorter credentials)
    const shortAuth = Buffer.from('a:b').toString('base64');

    // This should return false without throwing
    assert.equal(isReviewerAuthorized(`Basic ${shortAuth}`), false);
  } finally {
    if (originalUser) process.env.INTAKE_REVIEWER_USER = originalUser;
    else delete process.env.INTAKE_REVIEWER_USER;
    if (originalPass) process.env.INTAKE_REVIEWER_PASS = originalPass;
    else delete process.env.INTAKE_REVIEWER_PASS;
  }
});
