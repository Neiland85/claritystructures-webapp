# WIZARD_TO_GUARDIAN_CONTRACT_v0

## Purpose

This contract defines the controlled handoff between the
Clarity web intake wizard and the AI Governance Guardian.

The wizard collects structured user context.
The Guardian evaluates governance readiness.

No evidence analysis, device inspection, or automated
classification may run directly from WizardResult alone.

## Core rule

WizardResult is not an execution authorization.

WizardResult must be transformed into a governance envelope.

The governance envelope must be evaluated before any tooling,
superfilter, evidence handling, or custody workflow is triggered.

## Data flow

The intake flow is intentionally staged.

WizardResult
-> IntakeGovernanceEnvelope
-> GuardianInput
-> GuardianDecision
-> Authorized downstream action

Each stage has a different responsibility.

WizardResult captures user-submitted context.

IntakeGovernanceEnvelope adds governance metadata,
consent context, integrity fields, and operational scope.

GuardianInput is the normalized policy input consumed by
the Guardian.

GuardianDecision determines whether downstream action is
allowed, blocked, or requires human review.

## Governance envelope v0

The governance envelope is the controlled package created
from WizardResult before Guardian evaluation.

It must preserve the original wizard result and add only
governance metadata required for policy evaluation.

The envelope must not alter user-submitted facts.

The envelope must not infer evidence authenticity.

The envelope must not authorize execution by itself.

Required envelope areas:

- Source metadata
- WizardResult payload
- Consent context
- Evidence scope
- Risk indicators
- Integrity metadata
- Policy bundle version

## Risk rules

Risk must be evaluated before downstream execution.

Low risk may allow automated preclassification.

Medium risk may allow limited preclassification but must keep
human review available before sensitive action.

High risk must require human review before any evidence
handling, device-related action, custody workflow, or external
derivation.

Critical safety indicators must block automation until reviewed.

Risk indicators include:

- Physical safety risk
- Financial asset risk
- Active compromise indicators
- Evidence auto-deletion risk
- Sensitive personal data
- Third-party involvement
- Lack of device access
- High cognitive distortion indicators

## Non-claims

This contract does not claim that submitted evidence is true,
complete, authentic, or legally sufficient.

This contract does not diagnose the user.

This contract does not attribute intent to any third party.

This contract does not make legal conclusions.

This contract does not authorize invasive device inspection.

This contract does not bypass human review when safety,
sensitive data, or legal escalation indicators are present.

## Guardian decision outputs

The Guardian decision must produce explicit authorization flags.

Allowed outputs:

- allow_preclassification
- require_human_review
- block_automation
- allow_legal_derivation
- allow_evidence_handling
- allow_custody_workflow
- require_additional_consent
- require_manual_risk_review

The default posture must be conservative.

If a required flag cannot be resolved, the decision must fail
closed for downstream execution.

No downstream module may infer authorization from missing data.

## Next adapter

The next implementation step is to create the adapter that
transforms WizardResult into IntakeGovernanceEnvelope.

Target file:

src/lib/governance/wizard-result-to-governance-envelope.ts

The adapter must be deterministic.

The adapter must not mutate WizardResult.

The adapter must compute integrity metadata.

The adapter must expose only governance-ready data to the
Guardian boundary.
