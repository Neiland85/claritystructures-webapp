# 07 — Auditability Matrix

## Purpose

This matrix maps institutional risks to technical controls, files, tests, and evidence.

| Institutional risk             | Technical control                  | Implementation                                                      | Tests / validation        | Evidence                 |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------- | ------------------------- | ------------------------ |
| Duplicate intake submission    | Idempotency ledger                 | `packages/domain/src/idempotency.ts`, `PrismaIdempotencyRepository` | `idempotency.test.ts`     | `validate:idempotency`   |
| Same key with different body   | Request hash conflict              | `buildIdempotencyFingerprint`, `requestHashesMatch`                 | `idempotency.test.ts`     | conflict behavior        |
| Operation already in progress  | In-progress boundary               | `IdempotencyRecord.status`                                          | use-case behavior         | retry boundary           |
| Transfer packet drift          | Deterministic packet assembly      | `transfer-packet.ts`                                                | `transfer-packet.test.ts` | manifest hash            |
| Duplicate transfer log         | Transfer idempotency key           | `transfer-log.repository.ts`                                        | repository tests          | unique transfer record   |
| Duplicate active legal consent | `activeKey`                        | `legal-derivation.repository.ts`                                    | repository tests          | one active consent       |
| SLA timer duplication          | unique milestone + skip duplicates | `sla.repository.ts`                                                 | SLA tests                 | single milestone         |
| Remote migration accident      | datasource guard                   | `scripts/guard-prisma-datasource.mjs`                               | manual guard run          | blocked remote migrate   |
| Loss of governance context     | governance envelope in audit       | `submit-intake.usecase.ts`                                          | submit-intake tests       | audit metadata           |
| Sensitive auto-action          | guardian decision                  | `guardian-decision-builder.ts`                                      | guardian tests            | blocked actions          |
| Privacy leakage via public env | security audit                     | security hook/scripts                                               | pre-commit                | no sensitive public env  |
| User-data handling ambiguity   | user-data use cases                | `/api/user/data`                                                    | route/use-case tests      | access/delete flow       |
| Retention ambiguity            | retention/legal hold models        | retention use cases                                                 | retention tests           | deletion/legal hold logs |

## Institutional interpretation

A control is considered institutionally meaningful only when it has:

1. a named risk;
2. an explicit implementation;
3. a validation path;
4. a reviewable artifact or output.

## Current status

The current baseline contains the first complete convergence-control layer. Further work should add export bundles, external review evidence, and release packaging.
