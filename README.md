# Clarity Structures Webapp

Clarity Structures Webapp is a proprietary TypeScript / Next.js application for structured intake triage, legal-operational routing, consent-aware contact capture and administrative review.

The project combines a deterministic domain decision engine, a canonical wizard contract, a production-oriented contact intake flow, an admin triage console and supporting infrastructure for auditability, notifications, consent recording and preproduction readiness.

## Status

Current main baseline:

```text
ff593ed fix(api): connect contact route to submit intake use case (#138)
Current validation baseline:

pnpm -r run typecheck  # OK
pnpm -r run build      # OK
pnpm test:run          # OK

Test files: 78 passed
Tests: 722 passed

The test suite intentionally exercises failure scenarios such as database errors, notification failures, audit failures and error boundaries. Related stderr output is expected when the suite finishes green.

License and ownership

This repository is proprietary.

license: UNLICENSED

No open-source license is granted. Use, distribution, copying, modification or commercial exploitation requires explicit written authorization from Clarity Structures Digital S.L.

What this is
A structured digital intake and triage system.
A deterministic decision-routing application.
A preproduction-grade product foundation for Clarity Structures.
A consent-aware contact capture flow.
An administrative triage console protected by bearer-token authentication.
A codebase prepared for technical audit, due diligence and controlled preview.
What this is not
Not legal advice.
Not forensic certification.
Not an autonomous investigation system.
Not a replacement for expert human review.
Not a generic ML classifier.
Not open-source software.
Core capabilities
Deterministic decision engine
Same structured WizardResult input yields the same decision output.
Decision logic is snapshot-tested.
V1 and V2 decision paths are versioned.
V2 can emit explicit explanation reasons.
Domain logic is isolated from UI and infrastructure.
Canonical wizard contract

The wizard has been progressively moved toward a contract-driven model:

Canonical wizard contract registry.
Wizard answer adapter.
Contract context hook.
Canonical signal resolution.
Snippet resolution.
UI wiring into derived contract metadata.
Wizard UI

Recent UI modernization includes:

Modern visual shell.
Modernized phase panels.
Responsive layout polish.
Mobile-friendly dense option grids.
Clearer progress indication.
Improved internal grouping and visual hierarchy.
Contact intake flow

/api/contact is connected to the real application use case.

Current flow:

ContactFormBasic / ContactFormLegal
→ ContactIntakeSchema client validation
→ /api/contact
→ ContactIntakeSchema server validation
→ honeypot rejection
→ SubmitIntakeUseCase
→ decision engine
→ persistence
→ consent recording
→ notification
→ audit trail

New contact intakes are created with:

status: pending

The route returns useful operational metadata:

success
intakeId
computed priority
computed route
Consent and privacy
Contact forms require explicit consent.
Consent version is sent with submissions.
Consent acceptance is recorded by the submit use case.
Wizard result is no longer pushed into URL query params.
Current client-side transfer uses sessionStorage for wizard_result.
Legacy URL context parsing remains for backward compatibility.
Admin triage console

The triage dashboard is protected by a bearer-token gate.

The token is held in memory only.
It is never persisted to local storage/session storage.
The API validates bearer tokens server-side.
ADMIN_API_TOKEN is preferred.
JWT_SECRET is used as fallback if no dedicated admin token exists.
The visual auth gate now makes token presence and unlock state explicit.
API security

Implemented security controls include:

Bearer authentication for admin endpoints.
CSRF validation for mutating protected routes.
Double-submit CSRF cookie pattern.
CSP headers from Next.js proxy.
Security headers.
Honeypot bot rejection on public contact route.
Server-side schema validation.
DOM/input sanitization via schemas and validation layers.
Pre-commit secret audit.
GitGuardian / CI security checks.
Known preproduction risks

These are known and should be tracked before public production exposure.

SEC-01 — Rate limiting fail-open

Status: partially resolved in `fix(security): fail closed rate limiting in production (#146)`.

The Upstash rate-limit helper now fails closed in production when Redis is unavailable or not configured, while preserving fail-open behavior outside production for development and tests.

Pending next step:

Verify and enforce rate-limit wiring on sensitive API routes before public production exposure.
SEC-02 — Cron bearer secret comparison

Status: resolved in `fix(security): verify cron bearer token safely (#142)`.

Cron endpoints now use a dedicated timing-safe helper for `CRON_SECRET` bearer verification.

Relevant routes:

/api/cron/purge-expired
/api/cron/sla-breach-check
TYPE-01 — Wizard updateField typing

Status: resolved in `fix(wizard): type canonical field updates (#144)`.

Wizard field updates now preserve the relationship between `field` and `value` through `WizardState[K]`.
PRIV-01 — Client-side wizard_result

sessionStorage is a privacy improvement over URL query params, but the full wizard result is still client-side during the browser session.

For higher assurance, consider a short-lived server-side draft token instead.

TEST-01 — React act warnings

Some ContactForm loading-state tests still emit React act(...) warnings. The suite passes, but these warnings should be cleaned up for quieter CI.

Quick start
pnpm install

pnpm db:generate

pnpm -r run typecheck

pnpm -r run build

pnpm test:run

pnpm --filter @claritystructures/web dev
Common validation commands
pnpm -r run typecheck
pnpm -r run build
pnpm test:run

Focused tests:

pnpm exec vitest run apps/web/src/__tests__/api/contact-route.test.ts
pnpm exec vitest run apps/web/src/__tests__/application/use-cases/submit-intake.usecase.test.ts
pnpm exec vitest run apps/web/src/__tests__/components/Wizard.test.tsx
pnpm exec vitest run apps/web/src/__tests__/components/TriageGate.test.tsx
pnpm exec vitest run apps/web/src/__tests__/components/TriageTable.test.tsx
Environment variables

See:

.env.example
.env.production.local.example

Important production variables include:

DATABASE_URL
JWT_SECRET
SESSION_SECRET
CRON_SECRET
ADMIN_API_TOKEN
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_APP_URL

For production admin access, prefer a dedicated ADMIN_API_TOKEN instead of relying on JWT_SECRET.

Architecture notes

The codebase is structured around separation between:

domain logic
application use cases
infrastructure adapters
Next.js app/API routes
UI components
typed validation schemas

The contact route now uses the application layer instead of behaving as a validation-only stub.

Security policy

See SECURITY.md.

Decision engine

See docs/decision-engine.md.

Current recommended next PR
fix(security): harden cron bearer secret verification

Scope:

add timing-safe cron bearer verification
update cron routes
reinforce cron route tests
keep fail-closed behavior when CRON_SECRET is missing
```
