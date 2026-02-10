# Architecture

## Overview
Clarity Structures Webapp is organized around a lightweight **hexagonal (ports-and-adapters) style**:

- **Domain core (`src/domain`)**: business rules and deterministic decision logic.
- **Application/use-case orchestration (`src/components`, `src/app`)**: user flow and route orchestration.
- **Infrastructure adapters (`src/infra`, `src/app/api`)**: integrations such as SMTP email delivery and runtime I/O.

This keeps core classification/routing logic independent from framework details.

## Hexagonal layout

### 1) Domain (inside)
The domain layer owns the intake model and core decisions:

- `resolveIntakeRoute` maps wizard context to canonical intake routes (`basic`, `family`, `legal`, `critical`).
- `assessIntake` computes priority level (`low` → `critical`), risk flags, and recommended actions.
- `intake-records.ts` centralizes domain primitives (tones, statuses, priorities, contact intake input).

These functions are pure and testable, with no transport/framework dependency.

### 2) Application/use-case layer
The application layer coordinates user interactions and invokes domain rules:

- `Wizard` captures decision inputs (`clientProfile`, `urgency`, emotional distress).
- `Hero` executes the routing use case by calling `resolveIntakeRoute` and navigating to the selected intake route.
- Contact routes (`/contact/basic`, `/contact/family`, `/contact/legal`, `/contact/critical`) represent channelized intake paths.

### 3) Infrastructure/adapters (outside)
External effects are isolated in adapters:

- API route `src/app/api/contact/route.ts` parses payload, calls `assessIntake`, and sends an internal email via SMTP.
- `src/infra/alerts.ts` provides critical-alert email dispatch.
- Prisma schema/migrations define persistence boundaries for intake and consent records.

## Domain decisions (current)

1. **Route decision is deterministic and precedence-based**
   - `critical` urgency overrides all other criteria.
   - family/inheritance context maps to `family` route.
   - legal professional or court-related contexts map to `legal` route.
   - otherwise fallback is `basic`.

2. **Priority decision is score-based and explainable**
   - Signals contribute additive points (profile, urgency, emotional distress).
   - Thresholds define `low`, `medium`, `high`, `critical`.
   - Output includes explicit flags and a recommended action string.

3. **Internal vs external information boundary**
   - API sends internal assessment details only to staff email.
   - Client response returns only `{ ok: true|false }` (no internal scoring leakage).

## Decision model details

### Inputs
- `clientProfile`: contextual actor type (`private_individual`, `family_inheritance_conflict`, `legal_professional`, `court_related`, `other`).
- `urgency`: urgency class (`informational`, `time_sensitive`, `legal_risk`, `critical`).
- `hasEmotionalDistress`: optional emotional impact indicator.

### Routing model (`resolveIntakeRoute`)
Rule order:
1. if `urgency === critical` → `/contact/critical`
2. else if `clientProfile === family_inheritance_conflict` → `/contact/family`
3. else if `clientProfile in {legal_professional, court_related}` → `/contact/legal`
4. else → `/contact/basic`

### Priority model (`assessIntake`)
Score contributions:

- Profile
  - family conflict: +3
  - court-related: +4
  - legal professional: +2
- Urgency
  - time-sensitive: +2
  - legal risk: +4
  - critical: +6
- Emotional distress: +2

Thresholds:
- `score >= 8` → `critical`
- `score >= 5` → `high`
- `score >= 3` → `medium`
- otherwise → `low`

Output contract:
- `priority`: one of `low | medium | high | critical`
- `flags`: explainability tags
- `recommendedAction`: operational guidance string

## ADR links
There is no dedicated ADR directory in the current repository.

Current decision references:
- [AI_RULES.md](./AI_RULES.md) — implementation governance constraints.
- [CHANGELOG.md](./CHANGELOG.md) — release-level evolution trace.

Recommended future location for formal ADRs:
- `docs/adr/` (for example: `docs/adr/0001-hexagonal-layout.md`).

## Conventions (architecture-level)
- Keep business logic in `src/domain` and free of framework/runtime dependencies.
- Keep side effects in adapters (`src/app/api`, `src/infra`).
- Keep use-case orchestration thin (`src/components`, route handlers).
- Preserve deterministic decision logic and explicit explainability outputs (flags + recommendations).
