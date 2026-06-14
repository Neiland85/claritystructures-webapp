# Governed CaseFile — Domain Sketch

## Status

Pre-implementation sketch.

This document does not change existing contracts.

It defines candidate concepts for the next domain increment.

## Candidate entity

`GovernedCaseFile`

Represents an institutional workspace for a sensitive case context.

It is not a file folder.

It is a governed operational container.

## Candidate fields

```ts
type GovernedCaseFile = {
  id: string
  caseRef: string
  title: string
  createdAt: string
  updatedAt: string

  readinessState: ReadinessState
  contextBoundaryState: ContextBoundaryState
  sensitivity: SensitivityLevel

  scopeMatrix: ScopeMatrix
  reviewNotes: ReviewNote[]
  assuranceTrail: AssuranceEvent[]

  governanceSummary?: GovernanceSummary
  privacyBoundary?: PrivacyBoundary
  transferReadiness?: TransferReadiness
}
Candidate states
type ReadinessState =
  | "draft"
  | "intake_received"
  | "classification_pending"
  | "under_review"
  | "blocked"
  | "ready_for_transfer"
  | "transfer_completed"
  | "closed"
type ContextBoundaryState =
  | "clean"
  | "unclear"
  | "contaminated"
  | "quarantined"
type SensitivityLevel =
  | "normal"
  | "sensitive"
  | "legal"
  | "critical"
Candidate control gates
type ControlGateStatus =
  | "open"
  | "blocked"
  | "requires_review"
  | "passed"
  | "failed"

Candidate gates:

intake classification gate;
privacy review gate;
consent/authorization gate;
evidence handling gate;
legal derivation gate;
transfer package gate;
closure gate.
Candidate assurance events
type AssuranceEventType =
  | "CASE_FILE_CREATED"
  | "INTAKE_ATTACHED"
  | "CONTEXT_CLASSIFIED"
  | "GOVERNANCE_DECISION_RECORDED"
  | "CONTROL_GATE_BLOCKED"
  | "REVIEW_NOTE_ADDED"
  | "CONSENT_REGISTERED"
  | "PRIVACY_REVIEW_REQUIRED"
  | "TRANSFER_PACKAGE_PREPARED"
  | "TRANSFER_COMPLETED"
  | "CASE_FILE_CLOSED"
Internal naming policy

Existing implemented concepts are not renamed:

governanceEnvelope
guardianDecision
IdempotencyRecord
OutboxEvent
TransferPacket
DerivationConsent
SubmitIntakeUseCase
GenerateTransferPacketUseCase

New concepts may use operational naming when it improves precision:

GovernedCaseFile
ReadinessState
ControlGate
AssuranceEvent
AssuranceTrail
ScopeMatrix
ContextBoundary
ReviewNote
Authority boundary

Hooks do not decide.

Use cases orchestrate.

Domain rules protect transitions.

Ports define required capabilities.

Adapters execute infrastructure.

Initial implementation recommendation

Start with:

static/mock Control Room UI;
domain types only after UI vocabulary stabilizes;
use case skeleton only after domain transitions are clear;
persistence only after state model is stable.
```
