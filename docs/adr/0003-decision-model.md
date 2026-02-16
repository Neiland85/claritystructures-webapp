# ADR 0003: Decision Model for Policy and Intake Evolution

## Context

The project handles sensitive user-supplied intake information and policy-gated consent. Architectural governance requires a repeatable decision model so teams can classify and approve changes consistently across domain, infrastructure, and UX boundaries.

Without a model, decisions may be made ad hoc, producing inconsistent policy interpretation and hidden coupling.

## Decision

We establish a four-tier decision model for changes in this bounded context:

1. **Domain Decision (Tier 1)**
   - Affects business meaning, invariants, priority rules, flow semantics, or consent interpretation.
   - Must be implemented first in domain modules and documented via ADR update/new ADR.
2. **Application Decision (Tier 2)**
   - Affects orchestration, route handling, and command/query shaping between adapters and domain.
   - Must preserve Tier 1 semantics.
3. **Adapter Decision (Tier 3)**
   - Affects UI forms, API payload schemas, alerting integration, and persistence mappings.
   - Must map cleanly to Tier 1 + Tier 2 decisions.
4. **Operational Decision (Tier 4)**
   - Affects deployment/runtime controls, observability, and migration procedures.
   - Must not alter domain semantics implicitly.

Decision protocol:

- Every significant change proposal classifies its highest impacted tier.
- If Tier 1 is impacted, domain review is mandatory before implementation.
- Tier 3/4 changes that alter domain meaning are reclassified to Tier 1.

## Consequences

- Better governance traceability and reduced semantic regression in sensitive intake flows.
- Faster reviews by using tier classification as a common language.
- Additional process overhead for major changes, accepted to protect policy integrity.
- ADR inventory becomes the authoritative decision ledger for architecture and policy interpretation.

## Links to related code modules

- Tier 1 (domain): `src/domain/intake.ts`, `src/domain/intake-records.ts`, `src/domain/priority.ts`, `src/domain/flow.ts`.
- Tier 2 (application): `src/app/api/contact/route.ts`, `src/components/ContactForm.tsx`, `src/components/Wizard.tsx`.
- Tier 3 (adapters): `src/components/forms/ContactFormBasic.tsx`, `src/components/forms/ContactFormLegal.tsx`, `src/components/forms/ContactFormSensitive.tsx`, `src/infra/alerts.ts`, `prisma/schema.prisma`.
- Tier 4 (operations and migrations): `prisma/migrations/20260209080045_add_consent_versions_and_acceptances/migration.sql`, `CHANGELOG.md`.
