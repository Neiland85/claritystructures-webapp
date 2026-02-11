# Clarity Structures Webapp

Clarity Structures Webapp is a TypeScript/Next.js reference implementation for intake triage with a deterministic, snapshot-tested Decision Engine used to classify routes, priority, flags, and action codes from structured wizard input.

## What this is **not**
- Not legal advice.
- Not forensic certification.
- Not an autonomous investigation system.
- Not a replacement for expert human review.
- Not a generic ML classifier.

## Key guarantees
- **Deterministic:** same `WizardResult` input always yields the same decision output.
- **Snapshot-locked:** canonical decision scenarios are protected by snapshot tests.
- **Versioned V1/V2:** the public engine exposes baseline V1 and refined V2 decision paths.
- **Explainable reasons:** V2 can emit explicit explanation reasons for refinements.
- **Domain-isolated:** decision logic remains in `src/domain` with clean separation from UI and infrastructure.

## Quick start (local)
```bash
npm ci
npm run test
```

## Decision Engine
See [`docs/decision-engine.md`](./docs/decision-engine.md).

## Demo
Run the public Decision Engine demo harness:

```bash
npm run demo:decision-engine
```
