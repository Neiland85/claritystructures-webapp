# Control Room Demo Contract

## Canonical routes

/control/cases/demo redirects to:

/control/cases/EV-2026-DEMO

The dynamic route is the canonical demo surface:

/control/cases/[caseId]

## Demo case ids

| Case id          | Expected resolver status |
| ---------------- | ------------------------ |
| EV-2026-DEMO     | found                    |
| future-real-case | not_found                |
| blocked-case     | blocked                  |
| unavailable-case | unavailable              |

## Resolver contract

/control/cases/[caseId] must depend on:

getControlRoomViewModel(caseId)

The route must not know whether the source is fixture, memory, file, API, or database.

## Allowed source states

- found
- not_found
- blocked
- unavailable

All non-found states must remain visible through the resolver status band.

## Current source

Current source is the in-memory repository:

inMemoryControlRoomCaseRepository

This is intentional until the real source adapter contract is stable.

## Forbidden until next adapter phase

Do not add:

- Prisma schema changes
- migrations
- API routes
- persistence
- hidden fallback UI
- route-level fixture branching
- direct database access from /control/cases/[caseId]

## Required visible surfaces

The dynamic route must render:

- DemoStateNavigation
- ResolutionStatusBanner
- Control Room UI sections

## Operational rule

Fallback is allowed only if it is explicit, typed, and observable.
Silent fallback is not allowed.
