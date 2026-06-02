# Security Exceptions Register

## Purpose

This file records accepted, deferred or mitigated security findings related to dependencies, tooling or runtime behavior.

No exception is valid unless it includes:

- Advisory or CVE identifier.
- Affected dependency.
- Direct or transitive dependency status.
- Production impact.
- Decision.
- Mitigation.
- Review date.

## Active exceptions

| ID  | Dependency | Advisory / CVE | Direct / Transitive | Production impact | Decision                       | Mitigation | Review date |
| --- | ---------- | -------------- | ------------------- | ----------------- | ------------------------------ | ---------- | ----------- |
| N/A | N/A        | N/A            | N/A                 | N/A               | No active exception documented | N/A        | N/A         |

## Rules

- Critical production-impacting advisories block release unless explicitly mitigated.
- Dev-only advisories may be accepted temporarily if they do not affect runtime or deployment.
- Every accepted risk must have a review date.
- Overrides must be documented in `dependency-health-matrix.md`.
