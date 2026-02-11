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
    const usernameMatch = crypto.timingSafeEqual(
      Buffer.from(parsed.username),
      Buffer.from(reviewerUser),
    );
    const passwordMatch = crypto.timingSafeEqual(
      Buffer.from(parsed.password),
      Buffer.from(reviewerPass),
    );

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
