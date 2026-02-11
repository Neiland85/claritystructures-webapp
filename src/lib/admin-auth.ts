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

  // Use timing-safe comparison with SHA-256 hashing to prevent timing attacks.
  // SHA-256 ensures fixed-length 32-byte buffers, preventing length-based timing leaks.
  const expectedUserHash = createHash('sha256').update(reviewerUser).digest();
  const actualUserHash = createHash('sha256').update(parsed.username).digest();
  
  const expectedPassHash = createHash('sha256').update(reviewerPass).digest();
  const actualPassHash = createHash('sha256').update(parsed.password).digest();

  try {
    return (
      timingSafeEqual(expectedUserHash, actualUserHash) &&
      timingSafeEqual(expectedPassHash, actualPassHash)
    );
  } catch {
    // Defensive catch for unexpected errors (buffers are always 32 bytes with SHA-256)
    return false;
  }
}

export function unauthorizedHeaders(): HeadersInit {
  return {
    'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
  };
}
