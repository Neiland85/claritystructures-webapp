# Contributing

Thanks for improving the project.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`corepack enable && corepack prepare`)
- **PostgreSQL** (or a Supabase project)

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/Neiland85/claritystructures-webapp.git
cd claritystructures-webapp
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# 3. Generate Prisma client
pnpm db:generate

# 4. Run migrations (if database is provisioned)
pnpm db:push
```

## Local Validation

Run the same checks used by CI before pushing:

```bash
pnpm lint              # ESLint
pnpm typecheck         # TypeScript strict mode
pnpm test:run          # Vitest (unit + integration)
pnpm test:coverage     # Coverage thresholds
pnpm format:check      # Prettier
pnpm build             # Next.js production build (use SKIP_ENV_VALIDATION=true if no .env)
```

## Project Structure

```
apps/web/                 Next.js app (App Router, i18n, admin triage)
packages/domain/          Pure domain core (decision engine, value objects, specs)
packages/types/           Shared types + Zod validations
packages/config/          Environment validation (@t3-oss/env-nextjs)
packages/infra-persistence/  Prisma + PostgreSQL adapter
packages/infra-notifications/ SMTP + audit trail adapter
```

## Architecture Guidelines

This project follows **hexagonal architecture** (ports & adapters):

- **Domain** (`packages/domain`) is pure TypeScript — no framework imports, no side effects.
- **Ports** (interfaces) live in `packages/domain/src/ports.ts`.
- **Adapters** implement ports and live in `packages/infra-*`.
- **Use cases** orchestrate domain + ports and live in `apps/web/src/application/use-cases/`.
- **DI container** wires everything at `apps/web/src/application/di-container.ts`.

## Decision Engine Rules

- Keep domain logic isolated to `packages/domain/src/*` and avoid UI/infra side effects.
- Preserve deterministic behavior for identical `WizardResult` inputs.
- Do not remove or loosen snapshot assertions in `tests/decision.snapshot.spec.ts`.
- Prefer additive, versioned evolution (`V2` refinements) over breaking `V1` behavior.
- Include updated docs in `docs/decision-engine.md` when semantics change.

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): correct a bug
test(scope): add or update tests
docs(scope): documentation only
refactor(scope): code change that neither fixes a bug nor adds a feature
chore(scope): tooling, CI, dependencies
security(scope): security hardening
```

## Security

- Never commit secrets or `.env` files. The pre-commit hook runs `scripts/check-secrets.sh`.
- See [SECURITY.md](./SECURITY.md) for the full security policy and vulnerability reporting.

## Pull Requests

1. Create a feature branch from `main`.
2. Make your changes following the architecture guidelines above.
3. Ensure all CI checks pass locally (`pnpm lint && pnpm typecheck && pnpm test:run && pnpm build`).
4. Open a PR targeting `main`. Include a summary and test plan.
