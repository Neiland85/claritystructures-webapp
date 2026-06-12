# 05 — Security and Privacy Boundaries

## Purpose

This document defines the current security and privacy boundaries of the system.

## Core boundaries

| Boundary           | Control                                          |
| ------------------ | ------------------------------------------------ |
| API intake         | schema validation                                |
| Rate limiting      | Upstash-based limiter / fail policy              |
| CSRF               | explicit CSRF validation paths                   |
| Cron/API access    | bearer verification                              |
| Database migration | guarded migrate workflow                         |
| Public env vars    | security audit against sensitive `NEXT_PUBLIC_*` |
| Secrets            | pre-commit/security audit checks                 |
| Consent            | consent version and acceptance tracking          |
| Legal derivation   | explicit active consent model                    |
| User data          | access/delete use cases                          |

## Privacy rules

1. Personal data must not be treated as ordinary telemetry.
2. Consent version must be traceable.
3. Legal derivation requires explicit consent or legal basis.
4. Data transfer must be minimized.
5. Retention and deletion must be auditable.
6. Sensitive actions must be blocked by default unless governed.

## Migration safety

The repository contains a guard script:

```bash
pnpm db:migrate:dev:safe

This blocks accidental migrate dev execution against recognized remote providers unless explicitly overridden.

Operational warning

Use:

pnpm exec prisma validate --config prisma.config.ts
pnpm db:generate
pnpm db:migrate:status

Do not use raw remote migrate dev without explicit operational approval.

Institutional posture

Security is not a final checklist. It is a boundary encoded into development, validation, and operation.
```
