import { createHash, timingSafeEqual } from 'node:crypto';

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

function toSha256Buffer(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(toSha256Buffer(left), toSha256Buffer(right));
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

  return safeEqual(parsed.username, reviewerUser) && safeEqual(parsed.password, reviewerPass);
}

export function unauthorizedHeaders(): HeadersInit {
  return {
    'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
  };
}
