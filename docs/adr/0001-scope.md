# ADR 0001: Bounded Scope and Domain Ubiquitous Language for Intake and Contact Workflows

## Context

The `claritystructures-webapp` project combines public informational pages, multilingual contact experiences, guided intake flows, and persistence concerns. Without an explicit boundary, teams can unintentionally blend presentation concerns with domain policy, creating drift in language and governance.

From a DDD perspective, the current codebase already reveals key concepts (intake records, consent, priority, wizard flow, and alerting) that should be treated as first-class domain vocabulary. Governance requires those terms to be used consistently across UI, API, domain logic, and persistence artifacts.

## Decision

We define the scope of this bounded context as **Client Intake Orchestration** with the following subdomains:

- **Core domain**: intake record semantics, triage priority, flow progression, consent acceptance semantics.
- **Supporting domain**: multilingual rendering and channel-specific capture forms.
- **Infrastructure domain**: persistence mappings and alerting integrations.

We adopt the following ubiquitous language and boundaries:

- **Intake Record**: canonical capture artifact for a potential client.
- **Priority**: policy outcome indicating urgency level for downstream handling.
- **Consent Acceptance**: explicit acknowledgment tied to versioned policy text.
- **Flow State**: deterministic state progression through wizard and contact steps.

Out-of-scope for this bounded context:

- CRM lifecycle after intake handoff.
- Case management workflows post-qualification.
- Billing, invoicing, or legal matter execution.

## Consequences

- Domain terminology must be stabilized in `src/domain/*` and consumed by application/UI layers rather than redefined in components.
- New features should declare whether they belong to core/supporting/infrastructure subdomains before implementation.
- Cross-cutting concerns (i18n, alerts, persistence) remain adapters around domain policy, reducing accidental coupling.
- Architectural governance reviews can use this ADR as baseline for scoping decisions and backlog triage.

## Links to related code modules

- Domain policies and vocabulary: `src/domain/intake.ts`, `src/domain/intake-records.ts`, `src/domain/priority.ts`, `src/domain/flow.ts`, `src/domain/intake-prisma-consistency.ts`.
- Application entry points and flows: `src/app/(i18n)/[lang]/contact/page.tsx`, `src/components/Wizard.tsx`, `src/components/ContactForm.tsx`.
- Infrastructure adapters: `src/app/api/contact/route.ts`, `src/infra/alerts.ts`, `prisma/schema.prisma`.
