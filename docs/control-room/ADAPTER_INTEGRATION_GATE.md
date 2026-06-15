# Control Room Adapter Integration Gate

## Status

Active gate.

This document defines the conditions required before connecting any real source adapter to the Control Room chain.

The current Control Room chain is intentionally governed before persistence:

```text
GovernedCaseFile
-> toControlRoomSource
-> toControlRoomViewModel
-> repository seam
-> resolver
-> dynamic route
-> resolver status band
-> demo navigation
-> source adapter contract
-> public feature API
-> readiness guard
Purpose

The source adapter layer exists to prevent uncontrolled coupling between the Control Room UI and real data sources.

A real adapter must never make the dynamic route aware of storage, file layout, API contracts, Prisma, database schema, evidence vault internals, queues, or external systems.

The route remains a rendering boundary.

The resolver remains the decision boundary.

The repository seam remains the lookup boundary.

The adapter remains the source-integration boundary.

Allowed adapter kinds

The source adapter contract currently allows these adapter kinds:

in-memory
file
api
database

Only in-memory is active as a demo-safe implementation.

The next safe adapter should be file before api or database.

Required capabilities

Every real source adapter must provide these capabilities:

resolve_case
preserve_status
explain_failure
avoid_silent_fallback

A source adapter that cannot explain failure is not allowed.

A source adapter that collapses failure into a normal-looking UI state is not allowed.

A source adapter that bypasses the repository seam is not allowed.

Required result states

A real adapter must preserve the governed result union:

found
not_found
blocked
unavailable

These states are not UI decoration. They are operational control states.

They must remain visible through:

getControlRoomViewModel(caseId)
ResolutionStatusBanner
Control Room chain readiness guard
Integration rules

A real adapter may be introduced only if all of these conditions are true:

The adapter implements ControlRoomSourceAdapterContract.
The adapter resolves through resolveControlRoomCaseThroughAdapter.
The adapter uses a ControlRoomCaseRepository.
The adapter preserves all result states.
The adapter provides observable reasons for blocked or unavailable states.
The adapter does not import UI components.
The adapter does not modify the dynamic route.
The adapter does not add Prisma, API routes, or persistence in the same change.
The adapter has focused tests.
The adapter is included in scripts/control-room-chain-readiness.sh.
Forbidden shortcuts

Do not let /control/cases/[caseId] import a file adapter directly.

Do not let /control/cases/[caseId] import Prisma.

Do not let /control/cases/[caseId] call fetch.

Do not let /control/cases/[caseId] read files.

Do not let /control/cases/[caseId] know source kind.

Do not hide not_found, blocked, or unavailable behind the demo view model without exposing the resolver status.

Do not introduce a database-backed adapter before a file-backed adapter has proven the contract.

Do not combine adapter implementation with schema migration.

Do not combine adapter implementation with API route creation.

Next permitted implementation

The next permitted implementation is:

file-backed source adapter

Its purpose is not production persistence.

Its purpose is to prove that the adapter boundary can resolve a real external source without changing the route, UI, Prisma schema, API surface, or database.

File adapter acceptance criteria

A file-backed adapter is acceptable only if it satisfies:

input: caseId
boundary: ControlRoomSourceAdapterContract
lookup: ControlRoomCaseRepository
output: ControlRoomCaseSourceResult
visible status: ResolutionStatusBanner
tests: found / not_found / blocked / unavailable
guard: included in control-room-chain-readiness.sh
Database adapter gate

A database adapter remains blocked until all of these are true:

file adapter exists
file adapter is guarded
file adapter preserves all statuses
adapter selector exists
adapter selector is tested
route remains unchanged
demo contract remains valid
readiness guard passes

Only then may Prisma or database persistence be considered.

API adapter gate

An API adapter remains blocked until all of these are true:

source adapter selector exists
adapter contract is guarded
failure states remain observable
request errors map to unavailable
authorization or policy denial maps to blocked
missing case maps to not_found
successful case maps to found
Decision

The Control Room source integration path is:

in-memory adapter
-> file adapter
-> adapter selector
-> API or database adapter

Not:

dynamic route
-> database

Not:

UI
-> fetch

Not:

demo fallback
-> silent production behavior

The Control Room remains a governed operational surface, not a data-access shortcut.
```

## Observable adapter selection

The Control Room source adapter registry may expose multiple governed adapter selections.

Current governed selections:

| Selection   | Adapter kind | Runtime default | Purpose                                                                  |
| ----------- | ------------ | --------------: | ------------------------------------------------------------------------ |
| `in-memory` | `in-memory`  |             yes | Stable demo and fallback source.                                         |
| `file`      | `file`       |              no | Local governed fixture-backed source for adapter integration validation. |

Rules:

- `in-memory` remains the default runtime source.
- `file` must only be selected explicitly through the governed source adapter registry.
- The dynamic route must not know whether the selected source is in-memory, file-backed, API-backed, database-backed, queue-backed, or external.
- Source selection must remain observable through tests and readiness checks.
- Adding a new source selection does not authorize runtime activation.
- Runtime activation requires a separate PR, explicit acceptance criteria, and readiness coverage.

The observable selection chain is:

```text
route
  -> resolver
    -> source adapter registry
      -> selected governed adapter
        -> adapter contract
          -> repository internals
```

Blocked until separately approved:

- Environment-driven runtime source switching.
- API source activation.
- Database source activation.
- Prisma-backed resolver access.
- Route-level knowledge of storage implementation.
