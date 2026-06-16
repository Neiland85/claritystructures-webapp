# Control Room — Official Internal Use

Status: `INTERNAL_OFFICIAL_USE`
Scope: Clarity Structures internal operational governance
Commercial status: `NOT_FOR_SALE`
Runtime activation status: `DEMO_CONTROLLED`

## Purpose

The Control Room is an internal operational governance surface for Clarity Structures.

Its purpose is to provide a controlled, observable and auditable view of governed case information, resolver status, source boundaries, readiness state and operational context.

It is not a SaaS product.
It is not a commercial product.
It is not a client-facing platform by default.
It is not a forensic certification system.
It is not an automatic judicial admissibility engine.

It is an internal official-use instrument for:

- operational traceability
- governed case visualization
- resolver boundary validation
- source adapter governance
- readiness checks
- controlled demo execution
- technical memory
- institutional evidence of engineering discipline

## Current authorized use

Authorized use:

- Internal review.
- Controlled technical demo.
- Architecture walkthrough.
- Governance demonstration.
- Operational evidence explanation.
- Internal decision support.
- Documentation of system behavior.
- Official internal use by the maintainer.

Not authorized without a separate PR and explicit acceptance criteria:

- Production database activation.
- Prisma-backed Control Room resolver.
- Environment-driven runtime source switching.
- External API-backed source activation.
- Client-facing deployment as a product.
- Judicial or forensic certification claims.
- Automatic legal admissibility claims.
- Route-level knowledge of storage implementation.

## Current Control Room routes

Known Control Room routes:

```text
/control/cases/demo
/control/cases/EV-2026-DEMO
/control/cases/future-real-case
/control/cases/blocked-case
/control/cases/unavailable-case
Resolver states

The resolver exposes controlled states:

found
not_found
blocked
unavailable

Meaning:

found: governed case source was resolved.
not_found: no governed case source exists for that case id.
blocked: policy boundary blocks exposure of the governed case source.
unavailable: the governed source cannot be safely read or answered.
Source adapter boundary

The Control Room must follow this boundary:

route
  -> resolver
    -> source adapter registry
      -> selected governed adapter
        -> adapter contract
          -> repository internals

The route must not directly access:

Prisma
database internals
filesystem internals
source repositories
external APIs
storage implementation details
Current source adapter selections
in-memory: default runtime source
file: explicit local fixture-backed source for validation

Rules:

in-memory remains the default.
file may only be selected explicitly through the governed registry.
Adding a source option does not activate runtime switching.
Runtime activation requires separate approval and readiness coverage.
Readiness command

Official readiness command:

bash scripts/control-room-chain-readiness.sh

Expected result:

RESULT=PASS
Full validation command

Official full validation command:

pnpm install
pnpm db:generate
pnpm test:run
pnpm validate:full

Expected result:

test:run PASS
validate:full PASS
typecheck PASS
lint PASS
build PASS
Migration status note

pnpm db:migrate:status requires an explicit DATABASE_URL.

If a local DATABASE_URL is exported and Prisma reaches the local PostgreSQL endpoint but returns P1010, that means local database credentials are not valid for migration status.

This is not a Control Room runtime failure.

Production or remote database migration checks must not be executed casually during demo preparation.

Operational rule

No secret values may be pasted into:

prompts
docs
audit logs
screenshots
committed files
temporary tracked config
PR bodies
issue comments

Secrets may exist only in:

providers
ignored local env files
secure local environment variables
Official use statement

The Control Room is considered ready for controlled internal official-use demo when:

repository is clean
main is synchronized with origin/main
Control Room readiness passes
test suite passes
validate:full passes
no runtime DB activation has been introduced
no forbidden surface has changed
no secrets are tracked
```
