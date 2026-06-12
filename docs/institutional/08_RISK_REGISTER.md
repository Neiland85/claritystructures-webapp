# 08 — Institutional Risk Register

## Purpose

This register tracks known risks and required controls for institutional readiness.

| ID    | Risk                                                    | Severity | Current control                         | Status                 | Next action                              |
| ----- | ------------------------------------------------------- | -------: | --------------------------------------- | ---------------------- | ---------------------------------------- |
| R-001 | Duplicate intake creates duplicate institutional truth  |     High | Idempotency ledger                      | Controlled             | Add integration test with DB             |
| R-002 | Transfer packet cannot be reconstructed                 |     High | deterministic packet + manifest hash    | Partially controlled   | Add export bundle                        |
| R-003 | Legal derivation occurs without active consent          |     High | active derivation consent check         | Controlled             | Add policy doc                           |
| R-004 | Migration applied to remote DB accidentally             |     High | datasource guard                        | Controlled             | Enforce in CI/docs                       |
| R-005 | Audit trail lacks enough context                        |   Medium | governance envelope + guardian decision | Improved               | Add audit query runbook                  |
| R-006 | Outbox events are modeled but not fully operationalized |   Medium | OutboxEvent model/repository            | Partial                | Add worker/dispatcher                    |
| R-007 | Evidence custody may be overclaimed                     |     High | documentation boundary                  | Controlled by language | Add custody module only when implemented |
| R-008 | CI is not yet organized by institutional rings          |   Medium | validation scripts exist                | Partial                | Add ringed GitHub Actions                |
| R-009 | External reviewers lack concise package                 |   Medium | institutional docs                      | Partial                | Create review package                    |
| R-010 | Security vulnerabilities in dependencies                |   Medium | Dependabot visibility                   | Open                   | Review Dependabot alerts                 |

## Risk language

Do not overclaim.

If a control is partial, label it partial.

If a capability is not implemented, document it as not implemented.

Institutional trust increases when limits are explicit.
