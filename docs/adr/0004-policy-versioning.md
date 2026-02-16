# ADR 0004: Policy and Consent Versioning Strategy

## Context

The intake workflow captures consent and handles legally and ethically sensitive disclosures. Governance requires demonstrable traceability between accepted consent and the exact policy version in force at the time of acceptance.

Current persistence artifacts indicate explicit consent version handling. This creates a strong foundation that should be elevated to a formal architectural decision.

## Decision

Adopt strict policy versioning for all consent-bearing flows:

- Every consent text presented to a user is assigned an immutable version identifier.
- Each recorded acceptance stores:
  - policy version identifier,
  - acceptance timestamp,
  - contextual intake linkage.
- Policy content updates are append-only: new version published, prior versions retained for audit.
- Application and UI layers must request and display the active policy version explicitly rather than relying on implicit defaults.

Governance constraints:

1. No destructive edits to historical policy records.
2. Any consent interpretation logic must be version-aware.
3. Migrations changing consent schemas must include backward compatibility and data integrity checks.

## Consequences

- Stronger auditability and legal defensibility for consent events.
- Clear rollback and forensic capability when policy text changes.
- Additional storage and migration complexity, accepted for compliance and trust.
- Domain and infrastructure teams share explicit accountability for policy lifecycle stewardship.

## Links to related code modules

- Consent and domain consistency logic: `src/domain/intake-prisma-consistency.ts`, `src/types/consent.ts`, `src/domain/intake.ts`.
- Intake capture surfaces: `src/components/ConsentBlock.tsx`, `src/components/forms/ContactFormLegal.tsx`, `src/components/forms/ContactFormSensitive.tsx`.
- Persistence/versioning artifacts: `prisma/schema.prisma`, `prisma/migrations/20260209080045_add_consent_versions_and_acceptances/migration.sql`.
- Intake API integration: `src/app/api/contact/route.ts`.
