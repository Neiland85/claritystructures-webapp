# 01 — Architecture Overview

## Purpose

ClarityStructures WebApp provides a governed intake and operational decision layer for sensitive digital cases.

The architecture separates:

- user-facing intake;
- domain decision logic;
- governance evaluation;
- persistence;
- notifications;
- legal derivation;
- transfer packet generation;
- SLA and retention operations;
- auditability.

## Main boundaries

| Boundary                             | Responsibility                                   |
| ------------------------------------ | ------------------------------------------------ |
| `apps/web/src/app/api`               | HTTP/API boundary                                |
| `apps/web/src/application/use-cases` | Application orchestration                        |
| `packages/domain/src`                | Domain contracts, decisions, events, idempotency |
| `packages/infra-persistence`         | Database repositories and Prisma schema          |
| `packages/infra-notifications`       | Notification adapters                            |
| `packages/types`                     | Shared schemas and validations                   |

## Architectural rules

1. Domain logic must remain portable and testable.
2. Application use cases orchestrate, but should not hide domain decisions.
3. Persistence adapters must enforce database-level invariants where possible.
4. External side effects should be defensively isolated.
5. Sensitive actions require explicit governance metadata.
6. Repeated execution must not create duplicate institutional truth.

## Core data flow

```text
User/API input
  → validation
  → wizard result / fallback wizard result
  → decision engine
  → governance envelope
  → guardian decision
  → idempotency fingerprint
  → persistence
  → audit trail
  → notification / outbox
  → legal derivation / transfer packet when authorized
Institutional architecture principle

The system is designed for replay, review, and operational reconstruction.

A future reviewer must be able to answer:

what was received;
how it was classified;
what governance policy applied;
what decision was made;
what was persisted;
what was transferred;
what was blocked;
what was repeated;
what was retried;
what was audited.
Current core controls
deterministic domain tests;
decision replay tests;
canonical wizard contract tests;
defensive idempotency tests;
transfer packet hash tests;
full suite validation;
guarded Prisma migration workflow.
```
