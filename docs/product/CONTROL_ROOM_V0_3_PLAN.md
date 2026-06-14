# v0.3.0 — Governed CaseFile Control Room

## Purpose

This document defines the first product direction for `v0.3.0-governed-casefile`.

The goal is to evolve `claritystructures-webapp` from governed intake, privacy baseline and transfer controls into a visible operational surface for governed case files.

This is not a generic dashboard.

It is a control room for sensitive case contexts.

## Product thesis

A governed case file is not a folder.

It is an institutional workspace with:

- state;
- scope;
- review notes;
- sensitive flags;
- context boundary;
- consent/authorization state;
- governance decision;
- transfer readiness;
- auditability;
- operational memory.

## Design principle

The Control Room must show:

- what is known;
- what is blocked;
- what is allowed;
- what requires review;
- what changed;
- what can be transferred;
- what must not be touched yet.

## Non-goals

This release does not attempt to:

- replace legal review;
- claim evidence validity;
- introduce defense/aerospace compliance claims;
- rename existing internal contracts;
- rebuild the domain around UI terms;
- create a heavy admin panel;
- add magic AI behavior;
- create uncontrolled file handling.

## Current foundation

Already available:

- `v0.2.0-defensive-convergence`
- `v0.2.1-privacy-baseline`
- `governanceEnvelope`
- `guardianDecision`
- `IdempotencyRecord`
- `OutboxEvent`
- `TransferPacket`
- `DerivationConsent`
- `privacy-readiness`
- `institutional-readiness`
- `Operational Naming Bridge`

## Proposed module name

Internal/product module:

- `GovernedCaseFile`

UI surface:

- `Control Room`
- `Zona de Control`

Release target:

- `v0.3.0-governed-casefile`

## First screen

Primary route candidate:

- `/control/cases/[caseId]`

Initial static/mock version may use:

- `/control/cases/demo`

## Minimum Control Room layout

The first version should contain:

1. Case header.
2. Readiness radar.
3. Guardian decision card.
4. Available actions.
5. Blocked actions.
6. Operational event timeline.
7. Review notes.
8. Privacy/transfer boundary.

## Emotional target

The screen should feel like:

- calm control;
- institutional clarity;
- low noise;
- high confidence;
- no startup decoration;
- no fake cyber aesthetic;
- no dashboard clutter.

Desired reaction:

> I can think here. I can decide here. I can explain what happened here.

## Core product distinction

A normal dashboard shows data.

The Control Room shows operational authority:

- decision gates;
- blocked actions;
- review requirements;
- scope boundaries;
- transfer readiness;
- assurance events.

## Release definition

`v0.3.0-governed-casefile` is considered ready when the project has:

- documented governed case file model;
- static/mock Control Room UI;
- route-level integration;
- no broken existing flows;
- no persistence migration unless explicitly required;
- readiness check for product docs;
- tests/build passing;
- clear limitations documented.
