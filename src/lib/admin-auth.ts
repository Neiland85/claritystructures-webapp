import crypto from 'node:crypto';

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

  try {
    // Hash both values to ensure equal length for timing-safe comparison
    const providedUserHash = crypto.createHash('sha256').update(parsed.username).digest();
    const expectedUserHash = crypto.createHash('sha256').update(reviewerUser).digest();
    const providedPassHash = crypto.createHash('sha256').update(parsed.password).digest();
    const expectedPassHash = crypto.createHash('sha256').update(reviewerPass).digest();

    const usernameMatch = crypto.timingSafeEqual(providedUserHash, expectedUserHash);
    const passwordMatch = crypto.timingSafeEqual(providedPassHash, expectedPassHash);

    return usernameMatch && passwordMatch;
  } catch {
    return false;
  }
}

export function unauthorizedHeaders(): HeadersInit {
  return {
    'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
  };
}
