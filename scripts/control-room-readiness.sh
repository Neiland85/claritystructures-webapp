#!/usr/bin/env bash
set -u

FAIL=0

echo "== ClarityStructures Control Room Readiness =="

check_file() {
if [ -f "$1" ]; then
echo "OK $1"
else
echo "MISSING $1"
FAIL=1
fi
}

check_anchor() {
local pattern="$1"
local path="$2"
local label="$3"

if grep -R -I -n "$pattern" "$path" >/dev/null 2>&1; then
echo "OK $label"
else
echo "MISSING $label"
FAIL=1
fi
}

check_file docs/product/CONTROL_ROOM_V0_3_PLAN.md
check_file docs/product/GOVERNED_CASEFILE_DOMAIN_SKETCH.md
check_file docs/product/CONTROL_ROOM_SCREEN_SPEC.md

echo
echo "== Content anchors =="
check_anchor "GovernedCaseFile" docs/product "GovernedCaseFile anchor"
check_anchor "Control Room" docs/product "Control Room anchor"
check_anchor "Readiness" docs/product "Readiness anchor"
check_anchor "guardianDecision" docs/product "guardianDecision continuity anchor"
check_anchor "governanceEnvelope" docs/product "governanceEnvelope continuity anchor"
check_anchor "TransferPacket" docs/product "TransferPacket continuity anchor"
check_anchor "IdempotencyRecord" docs/product "IdempotencyRecord continuity anchor"
check_anchor "does not change existing contracts" docs/product "no-contract-change anchor"

echo
echo "== Git status =="
git status -sb

echo
if [ "$FAIL" -eq 0 ]; then
echo "RESULT=PASS"
else
echo "RESULT=FAIL"
fi

exit "$FAIL"
