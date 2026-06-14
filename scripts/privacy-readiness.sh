#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT=".audit/privacy/privacy-readiness-$STAMP.txt"
mkdir -p .audit/privacy

FILES=(
  "docs/privacy/README.md"
  "docs/privacy/01_GDPR_BASELINE.md"
  "docs/privacy/02_DPIA_PRELIMINARY_ASSESSMENT.md"
  "docs/privacy/03_ROPA_PROCESSING_ACTIVITIES.md"
  "docs/privacy/04_RETENTION_AND_DELETION_POLICY.md"
  "docs/privacy/05_DATA_SUBJECT_RIGHTS_PROCEDURE.md"
  "docs/privacy/06_LEGAL_BASIS_MATRIX.md"
  "docs/privacy/07_PRIVACY_RISK_REGISTER.md"
)

FAIL=0

{
  echo "== ClarityStructures Privacy Readiness =="
  date -u +"date_utc=%Y-%m-%dT%H:%M:%SZ"
  echo "repo=$(basename "$ROOT")"
  echo "branch=$(git branch --show-current 2>/dev/null || echo unknown)"
  echo "commit=$(git rev-parse HEAD 2>/dev/null || echo unknown)"
  echo

  echo "== Expected files =="
  for f in "${FILES[@]}"; do
    if [ -f "$f" ]; then
      echo "OK $f"
    else
      echo "MISSING $f"
      FAIL=1
    fi
  done

  echo
  echo "== Content anchors =="
  grep -R -I -n "RGPD\|GDPR" docs/privacy >/dev/null && echo "OK RGPD/GDPR anchor" || { echo "MISSING RGPD/GDPR anchor"; FAIL=1; }
  grep -R -I -n "DPIA\|EIPD" docs/privacy >/dev/null && echo "OK DPIA/EIPD anchor" || { echo "MISSING DPIA/EIPD anchor"; FAIL=1; }
  grep -R -I -n "ROPA\|RAT" docs/privacy >/dev/null && echo "OK ROPA/RAT anchor" || { echo "MISSING ROPA/RAT anchor"; FAIL=1; }
  grep -R -I -n "retention\|Retención\|supresión\|borrado" docs/privacy >/dev/null && echo "OK retention/deletion anchor" || { echo "MISSING retention/deletion anchor"; FAIL=1; }
  grep -R -I -n "derechos\|rights" docs/privacy >/dev/null && echo "OK data subject rights anchor" || { echo "MISSING data subject rights anchor"; FAIL=1; }
  grep -R -I -n "base jurídica\|legal basis" docs/privacy >/dev/null && echo "OK legal basis anchor" || { echo "MISSING legal basis anchor"; FAIL=1; }
  grep -R -I -n "risk\|riesgo" docs/privacy >/dev/null && echo "OK risk anchor" || { echo "MISSING risk anchor"; FAIL=1; }

  echo
  echo "== Secret pattern scan over docs/privacy =="
  SECRET_PATTERN='postgres(ql)?://|mysql://|mongodb(\+srv)?://|redis://|supabase\.co|DATABASE_URL=|NEXTAUTH_SECRET=|PRIVATE_KEY=|BEGIN [A-Z ]*PRIVATE KEY'
  if grep -R -I -n -E "$SECRET_PATTERN" docs/privacy >/tmp/clarity_privacy_secret_hits.txt 2>/dev/null; then
    echo "FAIL possible secret-like material detected:"
    cat /tmp/clarity_privacy_secret_hits.txt
    FAIL=1
  else
    echo "OK no obvious secret-like material in docs/privacy"
  fi

  echo
  echo "== Git status =="
  git status -sb

  echo
  if [ "$FAIL" -eq 0 ]; then
    echo "RESULT=PASS"
  else
    echo "RESULT=FAIL"
  fi
} | tee "$OUT"

exit "$FAIL"
