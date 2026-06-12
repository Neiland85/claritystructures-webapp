# INTAKE_GOVERNANCE_AUDIT_METADATA_v0

## Purpose

This contract defines the reduced governance metadata written
to the intake audit trail after a web intake submission.

The goal is to make governance state traceable without turning
the audit trail into an execution engine or evidence store.

## Scope

This contract applies to the `intake_submitted` audit event
created by SubmitIntakeUseCase.

The audit metadata may include a reduced `governanceEnvelope`
summary.

The full WizardResult must not be duplicated into the audit
event.

The full IntakeGovernanceEnvelope must not be treated as an
execution authorization.

## Current metadata shape

The `governanceEnvelope` audit metadata may contain:

- schemaVersion
- riskLevel
- requiresHumanReview
- allowsEvidenceHandling
- wizardResultHash
- hashAlgorithm
- policyBundleVersion

## Governance rules

The audit metadata is trace evidence of governance evaluation.

It is not legal derivation.

It is not evidence custody.

It is not device authorization.

It is not proof of evidence authenticity.

It is not a diagnosis.

It is not a legal conclusion.

## Fail-closed posture

Missing governance metadata must never be interpreted as
authorization.

Downstream modules must not infer permission from absent data.

If authorization is required, it must come from an explicit
GuardianDecision or later human-reviewed policy decision.

## Current implementation boundary

Current producer:

apps/web/src/application/use-cases/submit-intake.usecase.ts

Current adapter:

apps/web/src/lib/governance/wizard-result-to-governance-envelope.ts

Current test coverage:

apps/web/src/**tests**/application/use-cases/submit-intake.usecase.test.ts

## Future work

Future work may introduce a dedicated GuardianInput boundary.

Future work may replace stable-json-djb2-v0 with a backend-only
SHA-256 integrity hash.

Future work may persist governance envelopes separately if
required by institutional audit requirements.
