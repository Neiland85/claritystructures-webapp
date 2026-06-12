#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

AUDIT_DIR=".audit/institutional"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="$AUDIT_DIR/institutional-readiness-$STAMP.txt"

mkdir -p "$AUDIT_DIR"

{
  echo "== ClarityStructures Institutional Readiness =="
  date -u +"%Y-%m-%dT%H:%M:%SZ"

  echo
  echo "== Git =="
  git branch --show-current
  git status -sb
  git log --oneline -5

  echo
  echo "== Runtime =="
  node -v
  pnpm -v

  echo
  echo "== Institutional docs =="
  test -f docs/institutional/README.md
  test -f docs/institutional/01_ARCHITECTURE_OVERVIEW.md
  test -f docs/institutional/02_GOVERNANCE_MODEL.md
  test -f docs/institutional/03_EVIDENCE_LIFECYCLE.md
  test -f docs/institutional/04_IDEMPOTENCY_AND_CONVERGENCE.md
  test -f docs/institutional/05_SECURITY_AND_PRIVACY_BOUNDARIES.md
  test -f docs/institutional/06_OPERATIONAL_RUNBOOK.md
  test -f docs/institutional/07_AUDITABILITY_MATRIX.md
  test -f docs/institutional/08_RISK_REGISTER.md
  test -f docs/institutional/09_INCIDENT_RESPONSE.md
  test -f docs/institutional/10_EXTERNAL_REVIEW_PACKAGE.md
  echo "OK: institutional docs present"

  echo
  echo "== Core controls grep =="
  grep -R "IdempotencyRecord\|OutboxEvent\|activeKey\|packetIdempotencyKey\|governanceEnvelope\|guardianDecision" \
    packages apps scripts docs \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist \
    --exclude-dir=generated \
    | head -200

  echo
  echo "== Prisma schema validation =="
  pnpm exec prisma validate --config prisma.config.ts

  echo
  echo "== Prisma client generation =="
  pnpm db:generate

  echo
  echo "== Migration status =="
  pnpm db:migrate:status || true

  echo
  echo "== Safe migrate guard check =="
  pnpm db:migrate:dev:safe || true

  echo
  echo "== Idempotency validation =="
  pnpm validate:idempotency

  echo
  echo "== Full validation =="
  pnpm validate:full

  echo
  echo "== Result =="
  echo "Institutional readiness script completed."
} | tee "$OUT"

echo
echo "Audit written to: $OUT"
