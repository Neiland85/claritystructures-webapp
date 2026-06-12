# GUARDIAN_INPUT_BOUNDARY_v0

## Purpose

This contract defines the future boundary between the
IntakeGovernanceEnvelope and the AI Governance Guardian.

The GuardianInput is the normalized policy input consumed by
the Guardian before any downstream authorization decision.

## Core rule

GuardianInput is not user input.

GuardianInput is not raw WizardResult.

GuardianInput is not an execution command.

GuardianInput is a controlled governance projection created
from a previously built IntakeGovernanceEnvelope.

## Required inputs

GuardianInput must preserve or derive only the fields required
for policy evaluation.

Required areas:

- requestId
- source
- schemaVersion
- riskLevel
- consent context
- evidence scope
- integrity metadata
- policy bundle version
- human review requirement
- automation eligibility signals

## Non-claims

GuardianInput must not claim evidence authenticity.

GuardianInput must not diagnose the user.

GuardianInput must not attribute intent to third parties.

GuardianInput must not make legal conclusions.

GuardianInput must not authorize evidence handling by itself.

## Output boundary

The Guardian must produce an explicit GuardianDecision.

Downstream modules must only read authorization from that
GuardianDecision, not from WizardResult, IntakeGovernanceEnvelope,
GuardianInput, audit metadata, or missing fields.

## Fail-closed posture

If GuardianInput cannot be built safely, downstream execution
must be blocked.

If required fields are missing, downstream execution must be
blocked.

If policy evaluation cannot resolve an authorization flag,
downstream execution must be blocked.

No module may infer permission from incomplete data.
