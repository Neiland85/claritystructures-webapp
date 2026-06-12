# 02 — Governance Model

## Purpose

The governance model prevents sensitive digital cases from being treated as ordinary form submissions.

Each intake is evaluated through:

1. a wizard result;
2. a decision engine;
3. a governance envelope;
4. a guardian decision;
5. audit metadata.

## Governance envelope

The governance envelope records the context under which the intake was interpreted.

It includes:

- schema version;
- source;
- request id;
- wizard result;
- governance context;
- evidence scope;
- consent metadata;
- integrity hash;
- policy bundle version.

## Guardian decision

The guardian decision defines what the system may and may not do automatically.

Typical allowed actions:

- persist intake;
- notify team;
- preclassify intake when allowed;
- request human review when required.

Typical blocked actions:

- evidence handling;
- device inspection;
- legal derivation;
- authenticity claim;
- automated escalation;
- third-party attribution.

## Institutional rule

A low-risk intake may be persisted and notified automatically, but sensitive actions remain blocked unless explicitly governed.

The system must not silently escalate from intake to legal/evidence handling without explicit decision and traceability.

## Governance risk levels

| Risk     | Meaning                                              |
| -------- | ---------------------------------------------------- |
| `low`    | Standard intake, automated preclassification allowed |
| `medium` | Human review or legal context may be required        |
| `high`   | Human review required, sensitive actions blocked     |

## Audit requirement

Each persisted intake should allow reconstruction of:

- priority;
- route;
- decision model version;
- governance envelope summary;
- guardian decision;
- consent version;
- idempotency key when present;
- request hash when present.

## Institutional posture

Governance is not documentation added after the fact. Governance is encoded into the execution path.
