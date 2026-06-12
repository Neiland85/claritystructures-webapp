# 06 — Operational Runbook

## Purpose

This runbook defines standard operational commands for local validation, migration safety, audit readiness, and institutional review.

## Baseline status

Check branch and repository state:

```bash
git status -sb
git branch --show-current
git log --oneline -5
Install dependencies
pnpm install
Generate Prisma client
pnpm db:generate
Validate schema
pnpm exec prisma validate --config prisma.config.ts
Check migration status
pnpm db:migrate:status
Safe local migration workflow
pnpm db:migrate:dev:safe

If this command blocks execution, verify whether DATABASE_URL points to a remote database.

Core validation
pnpm validate:idempotency
pnpm validate:core
pnpm validate:full
Full test suite
pnpm test:run
Institutional audit script
bash scripts/institutional-readiness.sh
Duplicate submit investigation
Identify scope and key.
Query IdempotencyRecord.
Compare requestHash.
Review status.
Review responseHash.
Review audit log.
Review outbox event if present.
Document whether it was replay, conflict, or in-progress.
Transfer packet verification
Locate transfer record.
Extract manifest hash.
Reassemble packet from canonical source when possible.
Recompute hash.
Compare expected and actual hash.
Document transfer idempotency key and content hash.
SLA duplicate investigation
Search timers by intakeId.
Confirm uniqueness by milestone.
Confirm completedAt has not been overwritten.
Confirm duplicate creation was ignored or converged.
Emergency rule

Do not manually modify institutional state unless the action is documented, reversible where possible, and recorded in an operational note.
```
