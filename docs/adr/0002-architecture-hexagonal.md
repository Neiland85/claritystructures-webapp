# ADR 0002: Hexagonal Architecture for Intake Application Boundaries

## Context
The web application uses Next.js routing, React UI components, domain modules, and Prisma-backed persistence. A governance risk exists when framework- or transport-specific code leaks into domain decision logic, making policy changes expensive and less testable.

Hexagonal architecture (ports and adapters) is appropriate for this problem because intake policy must remain stable while transport channels (web forms, API routes, alerting providers, database schema evolutions) can change.

## Decision
Adopt a hexagonal architecture interpretation for this codebase:

- **Domain core (inside the hexagon)**
  - Pure domain modules in `src/domain/*` express invariants, transformations, and decision policy.
- **Application orchestration (use-case layer)**
  - Route handlers and orchestrating components map external requests to domain operations.
- **Inbound adapters (driving adapters)**
  - Next.js pages/routes and form components act as user and HTTP input adapters.
- **Outbound adapters (driven adapters)**
  - Persistence (`prisma/*`) and alerting (`src/infra/alerts.ts`) implement external side effects.

Governance rules:

1. Domain modules must not import framework-specific concerns from Next.js/React/Prisma.
2. Adapters translate between transport payloads and domain objects.
3. New external integrations are introduced as adapters, not embedded in domain code.

## Consequences
- Improved testability of domain rules independent from UI and database evolution.
- Clearer change impact analysis: domain change vs adapter change.
- Slight increase in translation code at boundaries, accepted as a tradeoff for long-term maintainability.
- Architecture reviews can validate dependency direction (outside -> inside) as an explicit acceptance criterion.

## Links to related code modules
- Domain core: `src/domain/intake.ts`, `src/domain/priority.ts`, `src/domain/flow.ts`, `src/domain/json.ts`.
- Inbound adapters: `src/app/api/contact/route.ts`, `src/components/forms/ContactFormBasic.tsx`, `src/components/forms/ContactFormLegal.tsx`, `src/components/forms/ContactFormSensitive.tsx`.
- Application orchestration: `src/components/ContactForm.tsx`, `src/components/Wizard.tsx`, `src/app/(i18n)/[lang]/contact/page.tsx`.
- Outbound adapters: `src/infra/alerts.ts`, `prisma/schema.prisma`, `prisma/migrations/20260209080045_add_consent_versions_and_acceptances/migration.sql`.
