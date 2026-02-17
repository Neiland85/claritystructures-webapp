# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| < 2.0   | No        |

## Reporting a Vulnerability

**Do not open a public issue.**

Send a description of the vulnerability to **seguridad@claritystructures.com** with:

1. Affected component (e.g., `/api/contact`, admin triage, domain engine)
2. Steps to reproduce
3. Impact assessment (data exposure, privilege escalation, etc.)

We will acknowledge receipt within **48 hours** and aim to resolve confirmed issues within **14 calendar days**.

## Security Architecture

### Authentication & Authorization

- Admin endpoints (`/api/triage`) require **Bearer token** authentication (constant-time comparison via `crypto.timingSafeEqual`).
- The token is validated against `ADMIN_API_TOKEN` or `JWT_SECRET` environment variables.
- Fails closed: if no secret is configured, all admin requests are rejected.

### CSRF Protection

- Double-submit cookie pattern: `__csrf` (HttpOnly) + `csrf-token` (JS-readable).
- Mutating endpoints (POST, PATCH, DELETE) validate the `x-csrf-token` header against the cookie.
- Constant-time comparison prevents timing attacks.
- Middleware sets both cookies on every request (`SameSite=Strict`, `Secure` in production).

### Input Validation

- All API routes use **Zod** schemas for request body validation.
- DOMPurify strips HTML/XSS from user-submitted text fields (`email`, `message`, `phone`).
- Honeypot field (`_gotcha`) silently rejects bot submissions.

### Content Security Policy

- CSP nonce generated per-request via middleware.
- Script and style sources restricted to `'self'` + nonce.
- `frame-ancestors 'none'` prevents clickjacking.

### Rate Limiting

- In-memory sliding window (development) or Upstash Redis (production).
- Applied to all API routes via `apiGuard()` middleware.

### Data Protection (RGPD/LOPDGDD)

- ARCO-POL endpoints at `/api/user/data` (access + deletion).
- Cascade deletion removes consent acceptances before intake records.
- All data operations are audit-logged.
- PostHog analytics gated behind explicit cookie consent.

### Secret Management

- All secrets are environment variables validated at startup via `@t3-oss/env-nextjs`.
- Pre-commit hook runs `scripts/check-secrets.sh` to detect hardcoded secrets.
- `.env` files excluded from git via `.gitignore`.
- CI pipeline includes a dedicated security audit step.

## Dependencies

- `pnpm audit` runs in CI on every push (moderate severity threshold).
- GitGuardian monitors the repository for leaked credentials.
- Prisma Client is generated at build time (not bundled from npm).
