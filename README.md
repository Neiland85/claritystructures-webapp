# Clarity Structures Webapp

Clarity Structures Webapp is a TypeScript/Next.js reference implementation for intake triage with a deterministic, snapshot-tested Decision Engine used to classify routes, priority, flags, and action codes from structured wizard input.

## What this is **not**
- Not legal advice.
- Not forensic certification.
- Not an autonomous investigation system.
- Not a replacement for expert human review.
- Not a generic ML classifier.

## Key guarantees
- **Deterministic:** same `WizardResult` input always yields the same decision output.
- **Snapshot-locked:** canonical decision scenarios are protected by snapshot tests.
- **Versioned V1/V2:** the public engine exposes baseline V1 and refined V2 decision paths.
- **Explainable reasons:** V2 can emit explicit explanation reasons for refinements.
- **Domain-isolated:** decision logic remains in `src/domain` with clean separation from UI and infrastructure.

## Quick start (local)
```bash
npm ci
npm run test
```

## Intake funnel MVP
- Public landing + intake form is available at `/intake` with required disclosures and minimal structured fields.
- Form submissions go to `POST /api/intake/submit`, which validates payload, deterministically maps to `WizardResult`, runs `decideIntakeWithExplanation(..., true)`, stores the intake in `intakes`, and returns a generic acknowledgement only.
- Internal reviewers access `/admin/intakes` (HTTP Basic auth via env vars) to review submissions and mark records for human follow-up.
- Each successful intake can trigger an internal notification email with intake summary + admin URL.

### Required environment variables
```bash
DATABASE_URL=postgresql://...
APP_BASE_URL=https://your-domain.example

# Admin review auth
INTAKE_REVIEWER_USER=reviewer
INTAKE_REVIEWER_PASS=strong-password

# Notification email
INTAKE_NOTIFICATION_EMAIL=ops@example.com
INTAKE_FROM_EMAIL=no-reply@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=smtp-user
SMTP_PASS=smtp-password
```

### Deploy notes
1. Run Prisma migration to create the `intakes` table.
2. Set the environment variables above in your deployment platform.
3. Ensure `/admin/intakes` is reachable only by authorized reviewers and served over HTTPS.

## Decision Engine
See [`docs/decision-engine.md`](./docs/decision-engine.md).

## Demo
Run the public Decision Engine demo harness:

```bash
npm run demo:decision-engine
```
