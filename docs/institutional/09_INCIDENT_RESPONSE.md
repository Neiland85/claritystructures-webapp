# 09 — Incident Response

## Purpose

This document defines the initial incident response model for ClarityStructures WebApp.

## Incident categories

| Category         | Example                                        |
| ---------------- | ---------------------------------------------- |
| Data integrity   | duplicated intake, conflicting idempotency key |
| Privacy          | unexpected personal data exposure              |
| Security         | unauthorized API access attempt                |
| Operational      | failed notification, failed outbox event       |
| Migration        | unsafe migration attempt                       |
| Legal derivation | transfer attempted without valid consent       |
| Retention        | deletion blocked by legal hold                 |

## First response rule

Preserve evidence before remediation.

## Standard response steps

1. Identify incident category.
2. Capture timestamp and environment.
3. Preserve relevant logs.
4. Identify affected intake/transfer/record IDs.
5. Identify current state.
6. Stop further damage.
7. Apply minimal remediation.
8. Record what changed.
9. Run validation.
10. Write post-incident note.

## Idempotency incident

If duplicate execution is suspected:

```text
1. Locate IdempotencyRecord by scope/key.
2. Compare requestHash values.
3. Confirm status.
4. Check responseHash.
5. Check audit log.
6. Check outbox event.
7. Classify as replay, conflict, in-progress, or unknown.
Migration incident

If unsafe migration is suspected:

1. Stop all migration attempts.
2. Run migration status.
3. Identify DATABASE_URL target.
4. Confirm migration table state.
5. Compare expected migration folder.
6. Document whether schema changed.
7. Restore or forward-fix only with explicit approval.
Transfer incident

If transfer packet integrity is questioned:

1. Locate transfer record.
2. Verify manifest hash.
3. Verify content hash.
4. Verify recipient entity.
5. Verify legal basis.
6. Verify active/revoked consent timeline.
7. Write transfer integrity note.
Institutional principle

The goal is not to hide errors. The goal is to preserve a truthful operational record.
```
