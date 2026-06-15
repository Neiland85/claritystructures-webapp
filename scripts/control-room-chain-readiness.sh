#!/usr/bin/env bash
set -euo pipefail

echo "== ClarityStructures Control Room Chain Readiness =="
echo "date_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "repo=$(basename "$(git rev-parse --show-toplevel)")"
echo "branch=$(git branch --show-current)"
echo "commit=$(git rev-parse HEAD)"

echo
echo "== Expected files =="
required_files=(
  "packages/domain/src/governed-casefile/types.ts"
  "packages/domain/src/governed-casefile/fixtures.ts"
  "packages/domain/src/governed-casefile/index.ts"
  "packages/domain/src/__tests__/governed-casefile.test.ts"
  "apps/web/src/features/control-room/control-room-source.ts"
  "apps/web/src/features/control-room/to-control-room-source.ts"
  "apps/web/src/features/control-room/to-control-room-view-model.ts"
  "apps/web/src/features/control-room/control-room-demo-data.ts"
  "apps/web/src/features/control-room/control-room-case-repository.ts"
  "apps/web/src/features/control-room/control-room-resolution-status.ts"
  "apps/web/src/features/control-room/resolution-status-banner.tsx"
  "apps/web/src/features/control-room/demo-state-navigation.tsx"
  "apps/web/src/features/control-room/control-room-demo-route.ts"
  "apps/web/src/features/control-room/get-control-room-view-model.ts"
  "apps/web/src/features/control-room/__tests__/control-room-demo-data.test.ts"
  "apps/web/src/features/control-room/__tests__/to-control-room-source.test.ts"
  "apps/web/src/features/control-room/__tests__/to-control-room-view-model.test.ts"
  "apps/web/src/app/control/cases/demo/page.tsx"
  "apps/web/src/app/control/cases/[caseId]/page.tsx"
)

for file in "${required_files[@]}"; do
  test -f "$file"
  echo "OK $file"
done

echo
echo "== Chain anchors =="
grep -R -n "export type GovernedCaseFile" packages/domain/src/governed-casefile
grep -R -n "governedCaseFileFixture" packages/domain/src/governed-casefile apps/web/src/features/control-room
grep -R -n "toControlRoomSource" apps/web/src/features/control-room
grep -R -n "toControlRoomViewModel" apps/web/src/features/control-room
grep -R -n "controlRoomDemoViewModel" apps/web/src/features/control-room apps/web/src/app/control/cases/demo/page.tsx
grep -R -n "ControlRoomSource" apps/web/src/features/control-room
grep -R -n "ControlRoomViewModel" apps/web/src/features/control-room

echo
echo "== Guard: demo source must come from governed casefile fixture =="
grep -n "governedCaseFileFixture" apps/web/src/features/control-room/control-room-demo-data.ts
grep -n "toControlRoomSource" apps/web/src/features/control-room/control-room-demo-data.ts
grep -n "toControlRoomViewModel" apps/web/src/features/control-room/control-room-demo-data.ts

echo
echo "== Guard: no legacy stale literal in view-model mapper test =="
if grep -R -n "transfer_packet_generation" apps/web/src/features/control-room/__tests__/to-control-room-view-model.test.ts; then
  echo "ERROR: stale literal transfer_packet_generation found in view-model mapper test"
  exit 1
fi
echo "OK no stale transfer_packet_generation literal in view-model mapper test"

echo
echo "== Guard: resolver must use repository seam =="
grep -R -n "inMemoryControlRoomCaseRepository\|ControlRoomCaseRepository\|findByCaseId" \
  apps/web/src/features/control-room/control-room-case-repository.ts \
  apps/web/src/features/control-room/get-control-room-view-model.ts \
  apps/web/src/features/control-room/__tests__/get-control-room-view-model.test.ts
echo "OK resolver uses repository seam"
echo

echo "== Guard: demo contract must define canonical routes =="
grep -R -n "Control Room Demo Contract\|/control/cases/demo\|/control/cases/EV-2026-DEMO\|found\|not_found\|blocked\|unavailable\|Do not add" docs/control-room/DEMO_CONTRACT.md
echo "OK demo contract defines canonical routes and forbidden surfaces"
echo

echo "== Guard: legacy demo route must redirect to canonical dynamic route =="
grep -R -n "redirect\|canonicalControlRoomDemoCasePath\|EV-2026-DEMO" \
  apps/web/src/app/control/cases/demo/page.tsx \
  apps/web/src/features/control-room/control-room-demo-route.ts \
  apps/web/src/features/control-room/__tests__/control-room-demo-route.test.ts
if ! grep -q "redirect(canonicalControlRoomDemoCasePath)" apps/web/src/app/control/cases/demo/page.tsx; then
  echo "FAIL legacy demo route must redirect to canonical dynamic route"
  exit 1
fi
echo "OK legacy demo route redirects to canonical dynamic route"
echo

echo "== Guard: dynamic route must render demo state navigation =="
grep -R -n "DemoStateNavigation\|EV-2026-DEMO\|future-real-case\|blocked-case\|unavailable-case" \
  apps/web/src/app/control/cases/[caseId]/page.tsx \
  apps/web/src/features/control-room/demo-state-navigation.tsx \
  apps/web/src/features/control-room/__tests__/demo-state-navigation.test.tsx
echo "OK dynamic route renders demo state navigation"
echo

echo "== Guard: dynamic route must render resolver status band =="
grep -R -n "ResolutionStatusBanner\|status\|reason\|resolvedCaseRef" \
  apps/web/src/app/control/cases/[caseId]/page.tsx \
  apps/web/src/features/control-room/resolution-status-banner.tsx \
  apps/web/src/features/control-room/control-room-resolution-status.ts
echo "OK dynamic route renders resolver status band"
echo

echo "== Guard: dynamic route must use resolver boundary =="
grep -R -n "getControlRoomViewModel" apps/web/src/app/control/cases/[caseId]/page.tsx apps/web/src/features/control-room/get-control-room-view-model.ts apps/web/src/features/control-room/index.ts
if grep -R -n "controlRoomDemoViewModel" apps/web/src/app/control/cases/[caseId]/page.tsx; then
  echo "ERROR: dynamic route imports fixture view model directly"
  exit 1
fi
echo "OK dynamic route uses resolver boundary"

echo
echo "== Guard: no Prisma/schema/migration working tree changes =="
if git status --short | grep -E "prisma|migration|schema.prisma" >/dev/null; then
  echo "ERROR: Prisma/DB change detected in working tree"
  git status --short | grep -E "prisma|migration|schema.prisma" || true
  exit 1
fi
echo "OK no Prisma/DB working tree changes"

echo
echo "== Tests: Control Room chain =="
pnpm exec vitest run \
  apps/web/src/features/control-room/__tests__/control-room-demo-data.test.ts \
  apps/web/src/features/control-room/__tests__/control-room-dynamic-route.test.ts \
  apps/web/src/features/control-room/__tests__/control-room-case-repository.test.ts \
  apps/web/src/features/control-room/__tests__/control-room-resolution-status.test.ts \
  apps/web/src/features/control-room/__tests__/demo-state-navigation.test.tsx \
  apps/web/src/features/control-room/__tests__/control-room-demo-route.test.ts \
  apps/web/src/features/control-room/__tests__/get-control-room-view-model.test.ts \
  apps/web/src/features/control-room/__tests__/to-control-room-source.test.ts \
  apps/web/src/features/control-room/__tests__/to-control-room-view-model.test.ts \
  packages/domain/src/__tests__/governed-casefile.test.ts

echo
echo "== Typecheck =="
pnpm typecheck

echo
echo "== Build =="
pnpm build

echo
echo "== Final git status =="
git status -sb

echo
echo "RESULT=PASS"
