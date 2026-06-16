# Control Room — Demo Runbook

Status: `CONTROLLED_INTERNAL_DEMO`
Commercial status: `NOT_FOR_SALE`
Audience: internal / technical / official-use review

## Demo goal

Demonstrate that the Control Room behaves as a governed operational surface.

The demo should show:

- a stable controlled route
- a resolver boundary
- source adapter governance
- observable resolver states
- controlled fallback behavior
- readiness validation
- no direct database coupling at route level
- no runtime source activation beyond the authorized default

## Pre-demo checklist

Run:

```bash
git status -sb
git log --oneline -10
bash scripts/control-room-chain-readiness.sh
pnpm test:run
pnpm validate:full

Expected:

main == origin/main
Control Room readiness: PASS
Tests: PASS
validate:full: PASS
Start local demo

Run:

pnpm dev

Open:

http://localhost:3000/control/cases/demo
http://localhost:3000/control/cases/EV-2026-DEMO
http://localhost:3000/control/cases/future-real-case
http://localhost:3000/control/cases/blocked-case
http://localhost:3000/control/cases/unavailable-case
Demo path
1. Open demo route

Open:

/control/cases/demo

Explain:

This is the stable Control Room demo entry point.
It is intentionally controlled.
It is not connected directly to a production database.
2. Open found case

Open:

/control/cases/EV-2026-DEMO

Explain:

The resolver loads a governed case through the approved boundary.
The route does not know the storage implementation.

Expected status:

found
3. Open not found case

Open:

/control/cases/future-real-case

Explain:

The system does not fake success.
If no governed case source exists, it returns a controlled not_found state.

Expected status:

not_found
4. Open blocked case

Open:

/control/cases/blocked-case

Explain:

The system can represent policy denial without leaking the underlying source.
Blocked means the source exists conceptually but exposure is not authorized.

Expected status:

blocked
5. Open unavailable case

Open:

/control/cases/unavailable-case

Explain:

The system can represent source unavailability safely.
Unavailable does not collapse into fake data or silent fallback.

Expected status:

unavailable
Technical explanation

Use this explanation:

The Control Room is not a data-access shortcut.

The route goes through a resolver.
The resolver goes through a governed source adapter registry.
The registry selects an approved adapter.
The adapter satisfies a contract.
Only then can repository internals be reached.

This preserves the boundary between UI, resolver, source selection and persistence.
Boundary diagram
Route
  |
  v
getControlRoomViewModel(caseId)
  |
  v
getControlRoomSourceAdapter(...)
  |
  v
resolveControlRoomCaseThroughAdapter(adapter, caseId)
  |
  v
Adapter contract
  |
  v
Repository internals
Claims allowed during demo

Allowed:

Internal official-use Control Room.
Governed resolver boundary.
Source adapter registry.
Controlled demo states.
Readiness-guarded architecture.
No direct DB route coupling.
No runtime DB activation in this demo.
No commercial product claim.

Not allowed:

Product-ready SaaS.
Forensic certification.
Judicial admissibility guarantee.
Production evidence platform.
Automatic legal validity.
Runtime database activation.
External client system.
Demo closing statement

Use:

This demo shows the governance surface, not a commercial product.

The important part is not that the UI renders a case.
The important part is that the system preserves the boundary:
route, resolver, adapter registry, adapter contract and repository internals.

That is the operational value.
It prevents the Control Room from becoming a data-access shortcut.

```
