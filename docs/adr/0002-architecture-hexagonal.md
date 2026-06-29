# ADR 0002: Hexagonal Architecture for Intake Application Boundaries

## Context

The web application uses Next.js routing, React UI components, domain modules, and Prisma-backed persistence. A governance risk exists when framework- or transport-specific code leaks into domain decision logic, making policy changes expensive and less testable.

Hexagonal architecture (ports and adapters) is appropriate for this problem because intake policy must remain stable while transport channels (web forms, API routes, alerting providers, database schema evolutions) can change.

## Decision

Adopt a hexagonal architecture interpretation for this codebase:

- **Domain core (inside the hexagon)**
  - Pure domain modules in `packages/domain/src/*` express invariants, transformations, and decision policy.
- **Application orchestration (use-case layer)**
  - Route handlers and orchestrating components map external requests to domain operations.
- **Inbound adapters (driving adapters)**
  - Next.js pages/routes and form components act as user and HTTP input adapters.
- **Outbound adapters (driven adapters)**
  - Persistence (`packages/infra-persistence/prisma/*`) and alerting (`packages/infra-notifications/src/alerts.ts`) implement external side effects.

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

- Domain core: `packages/domain/src/intake.ts`, `packages/domain/src/priority.ts`, `packages/domain/src/flow.ts`, `packages/domain/src/json.ts`.
- Inbound adapters: `apps/web/src/app/api/contact/route.ts`, `apps/web/src/components/forms/ContactFormBasic.tsx`, `apps/web/src/components/forms/ContactFormLegal.tsx`, `apps/web/src/components/forms/ContactFormSensitive.tsx`.
- Application orchestration: `apps/web/src/components/ContactForm.tsx`, `apps/web/src/components/Wizard.tsx`, `apps/web/src/app/(i18n)/[lang]/contact/page.tsx`.
- Outbound adapters: `packages/infra-notifications/src/alerts.ts`, `packages/infra-persistence/prisma/schema.prisma`, `packages/infra-persistence/prisma/migrations/20260215082833_init/migration.sql`.
