# Clarity Structures — Webapp

Demo webapp for technical traceability and evidence structuring
in digital incidents.

## Purpose
This application demonstrates how to transform a digital incident
into a structured, explainable and defensible technical evidence pack.

It is not a product by itself, but a controlled entry point
to a tailored technical engagement.

## Principles
- Decision → Governance → Execution separation
- No opaque automation
- No legal or forensic advice
- Defensible technical deliverables
- Explicit limits and responsibilities

## Scope
This webapp is a demo.
All real work is technical, contextual and delivered case by case.

## Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (minimal, utility-only)
- ESLint
- SSR-first approach

## Status
Early bootstrap.
Structure and interaction flows under active development.

## Run locally

### 1) Install dependencies
```bash
npm install
```

### 2) Start development server
```bash
npm run dev
```

Default URL: `http://localhost:3000`

## Tests and checks
There is currently no dedicated unit/integration test suite in `package.json`.
Use these project checks:

```bash
npm run lint
npm run typecheck
```

Optional production validation:

```bash
npm run build
```

## Execute use cases

### Use case 1: Route classification from wizard decisions
1. Open `/es` or `/en`.
2. Complete the wizard (profile, urgency, emotional impact).
3. The app resolves a route via domain rules and redirects to one of:
   - `/[lang]/contact/basic`
   - `/[lang]/contact/family`
   - `/[lang]/contact/legal`
   - `/[lang]/contact/critical`

### Use case 2: Submit contact intake and trigger internal assessment
1. Complete one contact form route.
2. Submit payload to `POST /api/contact`.
3. Backend computes priority/flags/recommendedAction.
4. Backend sends internal intake email via SMTP.
5. Client receives generic `{ ok: true|false }` response.

## Conventions
- Keep business rules and decision model in `src/domain`.
- Keep external integrations and side effects in adapters (`src/app/api`, `src/infra`).
- Keep UI orchestration in components and routes (`src/components`, `src/app`).
- Do not leak internal scoring details to client-facing responses.
- Follow implementation governance rules in [`AI_RULES.md`](./AI_RULES.md).
- Use domain constants/types (`tones`, `priorities`, `statuses`) instead of ad-hoc literals.

## Related docs
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [AI_RULES.md](./AI_RULES.md)
