import { createHash, timingSafeEqual } from 'crypto';

const REALM = 'Clarity Intake Review';

function decodeBasicAuth(header: string): { username: string; password: string } | null {
  const [scheme, encoded] = header.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    return null;
  }

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const separator = decoded.indexOf(':');

    if (separator < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function hashString(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

export function isReviewerAuthorized(authHeader: string | null): boolean {
  const reviewerUser = process.env.INTAKE_REVIEWER_USER;
  const reviewerPass = process.env.INTAKE_REVIEWER_PASS;

  if (!reviewerUser || !reviewerPass || !authHeader) {
    return false;
  }

  const parsed = decodeBasicAuth(authHeader);

  if (!parsed) {
    return false;
  }

  const expectedUserHash = hashString(reviewerUser);
  const providedUserHash = hashString(parsed.username);
  const expectedPassHash = hashString(reviewerPass);
  const providedPassHash = hashString(parsed.password);

  try {
    const userMatch = timingSafeEqual(expectedUserHash, providedUserHash);
    const passMatch = timingSafeEqual(expectedPassHash, providedPassHash);
    return userMatch && passMatch;
  } catch {
    return false;
  }
}

export function unauthorizedHeaders(): HeadersInit {
  return {
    'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
  };
}
