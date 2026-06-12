# GUARDIAN_DECISION_CONTRACT_v0

## Purpose

This contract defines the explicit GuardianDecision required
before any downstream action may execute.

GuardianDecision is the controlled output of the AI Governance
Guardian after evaluating a normalized GuardianInput.

## Core rule

Only GuardianDecision may authorize or block downstream action.

WizardResult is not authorization.

IntakeGovernanceEnvelope is not authorization.

GuardianInput is not authorization.

Audit metadata is not authorization.

Missing data is not authorization.

## Decision shape

A GuardianDecision must express:

- requestId
- schemaVersion
- decision
- allowedActions
- blockedActions
- requiresHumanReview
- riskLevel
- policyBundleVersion
- reasonCodes
- createdAt

## Decision values

The decision field must be explicit.

Allowed values:

- allow
- block
- require_human_review

No downstream module may interpret undefined, null, empty,
missing, or malformed decision values as permission.

## Allowed actions

Allowed actions must be explicit and narrow.

Examples:

- persist_intake
- notify_team
- preclassify_intake
- request_human_review

Sensitive actions must not be allowed by default.

## Blocked actions

Blocked actions must be explicit when a risk boundary is detected.

Examples:

- evidence_handling
- device_inspection
- legal_derivation
- authenticity_claim
- automated_escalation
- third_party_attribution

## Non-claims

GuardianDecision is not a legal opinion.

GuardianDecision is not evidence custody.

GuardianDecision is not proof of authenticity.

GuardianDecision is not a diagnosis.

GuardianDecision does not attribute intent to third parties.

## Fail-closed posture

If GuardianDecision cannot be produced, execution is blocked.

If GuardianDecision is malformed, execution is blocked.

If an action is not explicitly listed in allowedActions, execution
is blocked.

If an action appears in blockedActions, execution is blocked.

If allowedActions and blockedActions conflict, blockedActions wins.

## Downstream contract

Downstream modules must read authorization only from
GuardianDecision.

Downstream modules must not infer permission from:

- WizardResult
- IntakeGovernanceEnvelope
- GuardianInput
- audit metadata
- consent metadata
- route priority
- user narrative
- missing fields

## Future implementation boundary

Future work may introduce a pure GuardianDecision builder.

Future work may add contract tests to verify that sensitive actions
fail closed unless explicitly allowed.

Future work may persist GuardianDecision as a separate governance
artifact for institutional auditability.
