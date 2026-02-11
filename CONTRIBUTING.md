# Contributing

Thanks for improving the project.

## Local validation
Run the same checks used for release readiness:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run demo:decision-engine
```

## Proposing Decision Engine V2 changes safely
- Keep domain logic isolated to `src/domain/*` and avoid UI/infra side effects.
- Preserve deterministic behavior for identical `WizardResult` inputs.
- Do not remove or loosen snapshot assertions in `tests/decision.snapshot.spec.ts`.
- Prefer additive, versioned evolution (`V2` refinements) over breaking `V1` behavior.
- Include updated docs in `docs/decision-engine.md` when semantics change.
