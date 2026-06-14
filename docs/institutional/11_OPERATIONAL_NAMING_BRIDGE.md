# Operational Naming Bridge

## Purpose

This document provides a controlled terminology bridge for external technical reviewers.

`claritystructures-webapp` keeps its internal domain language stable. Existing contracts, entities, use cases, ports and adapters are not renamed to imitate any external organization, sector or methodology.

The purpose of this bridge is narrow: help reviewers from operational, regulated or critical-system environments understand how Clarity concepts relate to familiar review categories such as readiness, control gates, assurance trail, governed handover and context boundary.

This is a translation layer, not a certification claim.

## Non-goals

This document does not:

- claim compliance with defense, aerospace, aviation, safety-critical or classified-system standards;
- reproduce any internal methodology from a third-party organization;
- rename existing internal contracts;
- introduce new runtime behavior;
- alter the domain model;
- replace DPO, legal, security or systems-engineering review.

## Principle

Internal language remains stable.

External reading can be contextual.

Stable internal domain -> controlled operational alias -> easier external review.

The bridge exists to improve reviewability, not to decorate the project with borrowed vocabulary.

## Authority boundary

The following rule remains unchanged:

- Hook = sensor / trigger / UI adapter.
- Use case = institutional workflow.
- Domain = rules.
- Ports = external contracts.
- Adapters = infrastructure.

Operational naming must never move authority upward into UI, hooks or adapters.

A hook does not decide.

A use case orchestrates.

The domain protects rules.

A port defines a required capability.

An adapter executes a contract.

## Concept mapping

| Internal concept            | Operational reading             | Internal rename? | Notes                                                                                                   |
| --------------------------- | ------------------------------- | ---------------: | ------------------------------------------------------------------------------------------------------- |
| `governanceEnvelope`        | Operational governance envelope |               No | Captures context, risk, policy version, wizard hash and review conditions.                              |
| `guardianDecision`          | Control gate decision           |               No | Summarizes allowed actions, blocked actions, review requirement and risk posture.                       |
| `IdempotencyRecord`         | Defensive convergence control   |               No | Protects against duplicated effects, retries, repeated commands and inconsistent completion.            |
| `OutboxEvent`               | Deferred operational event      |               No | Separates primary persistence from secondary effects such as notification or downstream processing.     |
| `TransferPacket`            | Controlled transfer package     |               No | Treats transfer as an auditable event, not as a simple file movement.                                   |
| `packetIdempotencyKey`      | Transfer convergence key        |               No | Prevents duplicated transfer package generation.                                                        |
| `requestHash`               | Command request fingerprint     |               No | Supports idempotency and conflict detection.                                                            |
| `responseHash`              | Command response fingerprint    |               No | Supports deterministic replay of completed operations.                                                  |
| `contentHash`               | Transfer content fingerprint    |               No | Supports integrity checks on transfer logs and packages.                                                |
| `DerivationConsent`         | Active authorization record     |               No | Controls whether legal or third-party derivation may proceed.                                           |
| `activeKey`                 | Active authorization key        |               No | Prevents duplicated active consent states.                                                              |
| `auditTrail` / audit events | Assurance trail                 |               No | Evidence of decisions, state changes, blocked actions and operational events.                           |
| `privacy-readiness`         | Privacy readiness check         |               No | Documentation and anchor validation; not legal sign-off.                                                |
| `docs/privacy`              | Privacy assurance baseline      |               No | Preliminary GDPR/RGPD, DPIA/EIPD, ROPA/RAT and retention baseline pending DPO/legal validation.         |
| `docs/institutional`        | Institutional assurance pack    |               No | Architecture, governance, evidence lifecycle, idempotency, security, privacy, risk and review material. |

## Suggested external phrasing

Preferred English phrasing:

"The project provides a governed intake and transfer workflow for sensitive contexts, with explicit decision gates, idempotency controls, auditability, privacy baseline documentation and controlled transfer semantics."

Preferred Spanish phrasing:

"El proyecto proporciona un flujo gobernado de entrada, clasificación y transferencia para contextos sensibles, con gates de decisión explícitos, controles de idempotencia, auditabilidad, baseline documental de privacidad y semántica de transferencia controlada."

Avoid inflated language:

- This is not presented as a defense system.
- This is not presented as aerospace-certified software.
- This is not presented as a safety-critical platform.
- This is not presented as a replacement for legal, DPO or systems-engineering review.

## UI wording guidance

The operational bridge may inform UI labels where it improves clarity.

Acceptable UI labels:

- Control Room
- Case File
- Readiness
- Scope Matrix
- Governance Gates
- Evidence Batches
- Privacy Boundary
- Transfer Package
- Assurance Trail
- Review Notes

Use with care:

- Mission
- Critical
- Defense
- Aerospace
- Command
- Certified
- Classified

Avoid those terms unless a real engagement, certification or requirement explicitly justifies them.

## Code naming guidance

Existing implemented concepts should not be renamed for presentation reasons.

Do not rename:

- `governanceEnvelope`
- `guardianDecision`
- `IdempotencyRecord`
- `OutboxEvent`
- `TransferPacket`
- `DerivationConsent`
- `SubmitIntakeUseCase`
- `GenerateTransferPacketUseCase`

For new modules that are not yet implemented, operational naming may be used when it improves precision:

- `GovernedCaseFile`
- `ReadinessState`
- `ControlGate`
- `ControlGateDecision`
- `AssuranceEvent`
- `AssuranceTrail`
- `ScopeMatrix`
- `ContextBoundary`
- `ControlledTransferPackage`
- `ReviewNote`

## Review posture

This bridge should signal technical respect.

The project does not attempt to reproduce defense, aerospace or any third-party internal methodology.

It keeps its own domain model and exposes a small operational naming bridge so reviewers can map existing controls to familiar critical-system review concepts.

## Release relationship

This bridge is intended to support external review after:

- `v0.2.0-defensive-convergence`
- `v0.2.1-privacy-baseline`

It prepares the ground for a future governed case-file/control-room module without changing existing contracts.

## Final rule

Do not change the engine to sound more institutional.

Expose the engine clearly enough that an institutional reviewer can understand it.
