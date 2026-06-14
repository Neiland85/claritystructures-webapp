Control Room Screen Spec
Route

Candidate:

/control/cases/[caseId]

Initial mock route:

/control/cases/demo
Page title

Control Room

Subtitle:

Governed case file operational surface

Spanish UI variant:

Zona de Control

Superficie operativa para expediente gobernado

Layout
┌──────────────────────────────────────────────────────────────┐
│ Case Header │
├───────────────┬──────────────────────────────┬───────────────┤
│ Readiness │ Guardian / Governance │ Actions │
│ Radar │ Decision │ │
├───────────────┴──────────────────────────────┴───────────────┤
│ Assurance Timeline │
├──────────────────────────────────────────────────────────────┤
│ Review Notes / Privacy Boundary / Transfer Readiness │
└──────────────────────────────────────────────────────────────┘
Case header

Shows:

case reference;
title;
readiness state;
sensitivity;
context boundary;
last event;
integrity marker.

Example:

EV-2026-DEMO
Expediente técnico vivo
Readiness: under_review
Sensitivity: legal
Context boundary: unclear
Last event: transfer blocked
Integrity: verified
Readiness radar

Items:

Context
Consent
Privacy
Evidence
Transfer
Audit

Each item has:

status;
explanation;
severity.
Guardian decision card

Shows:

allowed actions;
blocked actions;
review requirement;
risk level;
decision reason;
policy version.

The UI must make blocked actions explainable.

A disabled button is not enough.

Actions panel

Split actions into:

Available
Add review note.
Run readiness check.
Classify scope.
Request review.
Export internal summary.
Blocked
Generate transfer package.
Legal derivation.
Mark as evidence-ready.
External handover.

Each blocked action should show:

blocker;
reason;
required unlock conditions.
Assurance timeline

Each event shows:

timestamp;
actor/source;
event type;
result;
optional hash/reference.

Examples:

CASE_FILE_CREATED
GOVERNANCE_DECISION_RECORDED
CONTROL_GATE_BLOCKED
PRIVACY_REVIEW_REQUIRED
TRANSFER_PACKAGE_PREPARED
Review notes

Notes should be operational, not decorative.

Each note should support:

author/source;
timestamp;
content;
scope tag;
sensitivity flag;
linked event.
Visual tone

The interface should feel:

calm;
precise;
operational;
reviewable;
institutional;
not theatrical;
not generic SaaS.

Recommended palette:

background: deep navy;
panels: dark blue/graphite;
success/control: green;
system/info: blue;
review: amber;
legal/privacy: purple;
blocked: red.
Copy rules

Prefer:

Blocked: requires active consent
Review required before transfer
Context boundary unclear
Scope not closed
Privacy review pending

Avoid:

Oops
Something went wrong
Magic analysis
AI decided
Defense-ready
Certified
