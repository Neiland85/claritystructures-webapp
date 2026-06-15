# Control Room Real Source Adapter Plan

Issue: #210

## Purpose

Define the next controlled phase for the Control Room resolver without introducing persistence, database schema, API routes, or runtime side effects.

The current Control Room flow is:

```text
/control/cases/[caseId]
      ↓
getControlRoomViewModel(caseId)
      ↓
fixture-backed resolver
      ↓
ControlRoomViewModel
      ↓
Control Room UI
The next step is not to connect a database. The next step is to define the internal source adapter boundary that will later allow real governed case loading without changing the UI.

Current invariant

The route must continue to depend on:

getControlRoomViewModel(caseId)

The route must not know whether the backing source is fixture, memory, file, API, database, or another adapter.

Proposed port
type ControlRoomCaseSourceResult =
  | { status: "found"; caseFile: GovernedCaseFile }
  | { status: "not_found"; caseId: string }
  | { status: "blocked"; caseId: string; reason: string }
  | { status: "unavailable"; caseId: string; reason: string };

export interface ControlRoomCaseRepository {
  findByCaseId(caseId: string): Promise<ControlRoomCaseSourceResult>;
}
Intended resolver flow
caseId
  → ControlRoomCaseRepository.findByCaseId(caseId)
  → GovernedCaseFile or controlled failure
  → toControlRoomSource()
  → toControlRoomViewModel()
  → route render
Controlled outcomes
found

A governed case file exists and can be mapped into the Control Room chain.

not_found

No governed case file exists for the requested case id.

blocked

A governed case exists, but the resolver must not expose it to the Control Room because a policy, authorization, privacy, or operational gate blocks access.

unavailable

The source adapter cannot answer safely. This is different from not found.

Non-goals for this phase

This phase must not introduce:

Prisma migration.
Database schema changes.
API route.
Persistence.
Runtime side effects.
UI rewrite.
Direct database access from the route.
Direct fixture import from the dynamic route.
Implementation sequence
Step 1 — documentation only

Add this plan and link it to issue #210.

Step 2 — in-memory adapter

Introduce an internal fixture-backed or in-memory repository that satisfies the planned port.

The adapter may return the current governedCaseFileFixture, but the resolver should depend on the repository shape instead of importing the fixture view model directly.

Step 3 — resolver outcome tests

Test the resolver against:

found.
not found.
blocked.
unavailable.
Step 4 — readiness guard

Extend scripts/control-room-chain-readiness.sh only after the new adapter seam exists.

Step 5 — persistence decision

Only after the adapter contract is stable should persistence be discussed.

Acceptance criteria
The UI remains dependent on ControlRoomViewModel.
/control/cases/[caseId] remains dependent only on getControlRoomViewModel(caseId).
The resolver owns source loading decisions.
Fixture-backed behavior remains available.
No DB/API/persistence is introduced by this plan.
Future implementation can be performed without rewriting Control Room UI components.
Validation baseline

Current main after PR #209 validates with:

scripts/control-room-chain-readiness.sh PASS
6 test files PASS
11 tests PASS
pnpm typecheck PASS
pnpm build PASS
/control/cases/[caseId] generated
/control/cases/demo generated

```
