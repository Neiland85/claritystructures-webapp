# Legal-Tech Acquisition Funnel (Deterministic, Compliance-Ready)

## Scope and non-negotiables

- Keep the existing Decision Engine behavior unchanged (V1 freeze + only pre-approved V2 refinements).
- No AI/ML scoring, no probabilistic ranking, and no black-box automation.
- Maintain hard separation between technical intake/triage and legal service delivery.
- Every action must be traceable (who, what, when, why) and reproducible for audit/defense.

---

## PHASE 1 — Funnel layers

### 1) Ad layer

**Objective:** attract urgent digital harassment / legal-risk leads with high intent.

**Design requirements:**

- Use explicit intent qualifiers in ad copy (e.g., digital harassment, extortion, impersonation, doxxing, non-consensual publication, threats).
- Limit claims to verifiable operational facts (response windows, structured intake, evidence handling).
- Geo/legal jurisdiction filters must be explicit in campaign setup.
- Capture immutable ad metadata at click time: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `utm_*`, `click_timestamp`.

**Outputs to downstream:**

- Signed click/session token.
- Source attribution payload.
- Consent capture pre-state (not yet accepted).

---

### 2) Landing layer

**Objective:** convert click traffic into informed, consented intake starts.

**Design requirements:**

- First-screen clarity: this is a technical risk intake, not immediate legal representation.
- Mandatory disclosures before start:
  - no attorney-client relationship created by submitting the form,
  - emergency guidance (call emergency services where imminent physical risk exists),
  - privacy and evidence processing notice.
- Jurisdiction and service availability gate before full intake.
- High-friction avoidance but compliance-first: explicit checkbox consents with timestamp and policy version.

**Outputs to downstream:**

- `landing_session_id`.
- Consent artifact (versioned legal text + acceptance timestamp + IP/device fingerprint hash).
- Eligibility gate result (in/out of scope).

---

### 3) Structured intake layer (WizardResult)

**Objective:** collect deterministic, structured facts sufficient for rule-based triage.

**Design requirements:**

- Intake schema must map 1:1 to `WizardResult` fields with strict validation.
- Evidence and chronology captured as structured data, not free text only:
  - incident type,
  - threat indicators,
  - recurrence/frequency,
  - known actor relation,
  - platform/channel,
  - available evidence status,
  - jurisdiction anchors,
  - immediate safety flags.
- Version every schema and maintain backward compatibility parser for audit replay.
- Input normalization must be deterministic and documented.

**Traceability controls:**

- Persist raw answers + normalized form + validation outcomes.
- Event log for each step transition (`entered`, `edited`, `submitted`) with timestamps.
- Idempotency key to prevent duplicate submissions under retry.

**Outputs to downstream:**

- Immutable `WizardResult` snapshot.
- Validation status report.
- Intake completeness score (deterministic rule count only; no predictive scoring).

---

### 4) Decision Engine layer

**Objective:** apply frozen deterministic rules to classify and route cases.

**Design requirements:**

- Engine is a pure function from `WizardResult` to decision outputs.
- No runtime learning, no opaque external dependency affecting outcomes.
- Decision record must include:
  - rule set version,
  - triggered rules,
  - final classification,
  - confidence-by-construction explanation (which criteria were met).
- Produce replayable decision artifacts for legal defensibility.

**Outputs to downstream:**

- Triage outcome (`critical`, `priority`, `standard`, `out_of_scope`, etc., per existing taxonomy).
- Required action set (book technical analysis, send rejection reason, escalate).
- Decision audit object.

---

### 5) Technical analysis booking layer

**Objective:** schedule technical assessment under strict SLA based on deterministic outcome.

**Design requirements:**

- Booking priority derives only from engine outcome + explicit operational constraints.
- SLA clock starts at decision finalization timestamp.
- Capacity controls are transparent and rule-based (queue tiers, working hours, on-call matrix).
- Confirmation message must restate scope boundaries (technical analysis, not legal advice).

**Operational artifacts:**

- Queue state transitions (`queued`, `assigned`, `contacted`, `completed`, `expired`).
- Assignee and handoff logs.
- SLA breach alarms and incident tickets.

---

### 6) Legal derivation layer

**Objective:** refer qualified cases to Ospina Abogados under explicit handoff protocol.

**Design requirements:**

- Legal derivation is opt-in and consent-gated.
- Transfer only minimum necessary data package (data minimization).
- Handoff packet is deterministic and standardized:
  - intake summary,
  - evidence inventory,
  - decision artifact,
  - chronology timeline,
  - chain-of-custody references.
- Legal party actions and advice remain outside technical product boundary.

**Governance:**

- Separate systems of record for technical operations vs legal case management.
- Cross-entity transfer log with timestamp, recipient, legal basis, and payload manifest hash.

---

## PHASE 2 — Risk controls

### SLA for critical cases

- **Critical case acknowledgment:** ≤ 15 minutes from decision timestamp.
- **First qualified human contact:** ≤ 60 minutes.
- **Initial technical containment guidance:** ≤ 2 hours.
- **Escalation to legal derivation (if criteria met and consented):** ≤ 4 hours.
- 24/7 on-call rota for `critical` classification.

### Data retention policy outline

- **Raw intake + decision artifacts:** retain 24 months (or stricter local legal requirement), then purge/anonymize.
- **Security/audit logs:** retain 36 months for traceability and dispute defense.
- **Unqualified/out-of-scope leads:** retain minimal metadata 6 months for abuse prevention and attribution reconciliation.
- **Evidence files:** retain per explicit consent purpose and legal hold status; auto-expire by policy when no hold exists.
- **Policy mechanics:** versioned retention schedule, legal hold override, immutable deletion logs.

### Explicit disclaimers (must be shown and logged)

- Submission does **not** create attorney-client relationship.
- Service provides technical risk assessment and incident structuring; legal advice only from licensed counsel.
- Users must contact emergency/public authorities for imminent physical danger.
- Data processing, transfer, and retention terms are consent-based and versioned.
- Jurisdictional limitations and availability constraints apply.

### Escalation flow

1. Engine marks case `critical`.
2. Pager/on-call technical lead notified immediately.
3. If imminent harm indicators present, emergency guidance surfaced to user and logged.
4. Technical analyst executes first-response checklist and records actions.
5. If legal threshold criteria met, request explicit derivation consent.
6. On consent, generate transfer packet and deliver to Ospina Abogados through controlled channel.
7. Close loop with user status update and immutable timeline entry.

---

## PHASE 3 — Product positioning

### Product definition (3 sentences)

This product is a deterministic legal-tech intake and triage system for urgent digital harassment and legal-risk incidents. It converts user-reported events into structured, auditable records and applies fixed decision rules to route cases into operational next steps. It also enables compliant technical-to-legal derivation workflows with Ospina Abogados while preserving separation of responsibilities.

### What it is NOT

- Not a law firm and not a substitute for legal counsel.
- Not an AI risk predictor or autonomous case scorer.
- Not a black-box workflow where outcomes cannot be explained.
- Not an emergency-response substitute for public safety authorities.

### Why deterministic > heuristic (for this use case)

- **Defensibility:** every outcome can be explained via explicit rule triggers.
- **Auditability:** decisions are replayable against versioned inputs/rules.
- **Compliance readiness:** easier to validate controls where logic is stable and documented.
- **Operational reliability:** fewer variance and drift risks than heuristic models.
- **Legal interoperability:** cleaner handoff narrative for external counsel and potential court scrutiny.

---

## PHASE 4 — Minimal MVP roadmap (4 weeks)

### Week 1 — Funnel and compliance foundation

- Finalize funnel contracts between layers (schemas, IDs, event model).
- Implement landing disclosures + consent versioning + jurisdiction gate.
- Lock WizardResult schema version `v1` and validation rules.
- Define audit log structure and retention configuration baseline.

**Exit criteria:** end-to-end intake submission produces immutable `WizardResult` + consent artifact + trace IDs.

### Week 2 — Decision integration and operational routing

- Integrate existing deterministic Decision Engine (no behavior change).
- Persist full decision artifact (rules triggered, version, outcome).
- Implement deterministic queueing/booking rules for technical analysis.
- Configure SLA timers and alert hooks for `critical` cases.

**Exit criteria:** replay test confirms identical outputs for identical inputs; critical SLA timer active.

### Week 3 — Legal derivation handshake

- Build consent-gated derivation flow and minimal transfer packet generator.
- Implement payload minimization and transfer manifest hashing.
- Establish controlled delivery channel and acknowledgment protocol with Ospina Abogados.
- Add cross-entity transfer log and reporting view.

**Exit criteria:** successful dry-run transfer with complete audit trail and consent proof.

### Week 4 — Hardening, controls, and go-live readiness

- Run deterministic test suite, replay tests, and failure-mode drills.
- Validate retention jobs, legal hold override, and deletion logs.
- Execute incident escalation tabletop for `critical` scenario.
- Produce operations runbook and compliance evidence pack.

**Exit criteria:** go-live checklist signed: SLA, auditability, disclaimers, derivation controls, and rollback plan.
