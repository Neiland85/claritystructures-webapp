# ADR-0001: Dependency Governance

## Status

Accepted

## Context

ClarityStructures WebApp depends on a TypeScript/Next.js monorepo stack with runtime, validation, persistence, testing, observability and deployment dependencies.

Because this project handles sensitive operational and legal-adjacent workflows, dependency drift and supply-chain risk must be controlled.

## Decision

The project uses:

- `pnpm` as package manager.
- `pnpm-lock.yaml` as the authoritative dependency lockfile.
- `pnpm.overrides` for controlled transitive dependency mitigation.
- Isolated dependency PRs for updates.
- CI validation before merge.
- Security scanning and secret detection.
- A dependency health matrix.
- A security exceptions register.

## Required gates

Dependency PRs must pass:

- `pnpm install --frozen-lockfile`
- typecheck
- lint / format checks
- unit tests
- coverage
- production build
- security audit / secret checks

## Consequences

- No unreviewed dependency update should be merged.
- Lockfile changes must be reviewed as part of the PR.
- Critical advisories must be fixed, mitigated or explicitly documented.
- Runtime version changes must be treated as architectural changes, not routine maintenance.
