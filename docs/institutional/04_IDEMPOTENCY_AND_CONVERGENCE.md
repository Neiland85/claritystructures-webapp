# 04 — Idempotency and Canonical Convergence

## Purpose

This document defines the Defensive Canonical Convergence Layer.

## Definition

The Defensive Canonical Convergence Layer prevents retries, duplicate submissions, repeated cron jobs, partial failures, and external noise from corrupting persistent institutional truth.

## Principle

```text
same scope + same key + same request hash
  → same result or controlled replay

same scope + same key + different request hash
  → conflict

same operation already in progress
  → defensive retry boundary

same operation already completed
  → replay stored result
Idempotency scopes

Current institutional scopes include:

intake.submit
legal.derivation.consent
transfer.generate
sla.create_timers
sla.complete_milestone
retention.purge
evidence.package.verify
asset.close
Canonical convergence loop
SENSE
  read current state

NORMALIZE
  transform input into canonical payload

FINGERPRINT
  compute stable request hash

COMPARE
  detect replay, conflict, or in-progress execution

CLAMP
  limit allowed transition

COMMIT
  persist exactly one institutional effect

OBSERVE
  audit and emit without duplicating truth
Defensive examples
Operation	Defensive behavior
Intake submit	Same payload returns same intake result
Intake submit conflict	Same key with different payload is rejected
Legal consent	One active consent per intake/entity
Transfer packet	Deterministic packet identity and content hash
SLA timers	Duplicate creation does not duplicate timers
Migration workflow	Remote migrate dev is blocked by guard script
Institutional claim

The system does not trust perfect delivery.

The system is designed to absorb duplication, retries, and operational uncertainty.
```
