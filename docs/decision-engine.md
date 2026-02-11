# Decision Engine Technical Contract

## Scope
The decision engine is a domain-only module for intake routing, priority assignment, and explainability.
It is deterministic and versioned.

## Versioning policy
- **V1**: `decision-model/v1`
- **V2**: `decision-model/v2`
- All exported decisions include an explicit `decisionModelVersion`.
- Version identifiers are literal-typed constants and are not inferred from runtime strings.

## V1 freeze guarantee
- V1 logic is snapshot-locked and must remain behaviorally unchanged.
- `decideIntake` is the frozen baseline model.
- V2 refinement composes on top of V1 and never mutates V1 internals.

## V2 evolution rules
- V2 starts from V1 output, then applies signal-based refinements.
- V2 may only refine priority/action code when additional contextual signals are present.
- V2 must preserve V1 routing and base flag derivation.
- Any future V2 changes require deterministic test coverage and regression validation.

## Signal refinement model
- `mapWizardToSignals` normalizes `WizardResult` into `IntakeSignals`.
- Refinement is conditional and currently focuses on:
  - ongoing exposure escalation,
  - data sensitivity + risk escalation,
  - no-device-access constraints.
- If no refinement inputs are provided, V2 returns the same priority/action behavior as V1.

## Explainability contract
- `decideIntakeWithExplanation` returns:
  - `decision`: final intake decision
  - `explanation`: reasons, baseline priority, final priority, model version
- Explanation reasons are defined as a closed `DecisionReason` union.
- Builder logic is guarded to ensure all emitted reasons are union-valid.

## Determinism guarantee
- Decision functions are pure and side-effect free.
- Outputs contain no clock, random, or environment-dependent fields.
- Decisions/explanations are frozen before return to prevent mutation drift.
- Regression tests assert stable `JSON.stringify` output across repeated runs.

## Public API surface
Use `src/domain/decision-engine.ts` as the official import target.

It exports only:
- `decideIntake`
- `decideIntakeV2`
- `decideIntakeWithExplanation`
- `DECISION_MODEL_VERSION_V1`
- `DECISION_MODEL_VERSION_V2`
- `WizardResult`
- `IntakeDecision`
- `DecisionExplanation`

## Non-goals
- No threshold tuning.
- No routing changes for V1.
- No UI or infrastructure concerns in the engine surface.
- No hidden telemetry, runtime mutation, or side effects.
