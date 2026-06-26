# Operational Evidence Ledger

The operational evidence ledger converts critical system events into a reconstructable hash chain.

It is designed for intake, consent, decision routing, administrative review and export workflows where later reconstruction matters more than narrative memory.

## Purpose

The ledger answers four operational questions:

- what happened;
- when it happened;
- which system or actor caused it;
- whether the sequence can be reconstructed without trusting memory.

## Current scope

The first version is domain-only and storage-agnostic.

It does not introduce a database migration.

It defines:

- canonical event payloads;
- sensitive metadata redaction;
- deterministic payload hashes;
- event hashes;
- previousHash chain linking;
- chain verification.

## Event types

Initial event types:

- INTAKE_RECEIVED
- CONSENT_RECORDED
- DECISION_COMPUTED
- ROUTE_ASSIGNED
- NOTIFICATION_SENT
- ADMIN_REVIEWED
- EXPORT_GENERATED

## Hash model

Each event contains:

- payloadHash: hash of the canonical event payload;
- previousHash: hash of the previous event, or null for the first event;
- hash: hash of the ledger version, payloadHash and previousHash;
- eventId: deterministic identifier derived from the event hash.

This creates a minimal append-only reconstruction model.

If an event changes, its payloadHash changes.

If an event is moved, removed or reordered, the chain verification fails.

## Privacy posture

Operational metadata is redacted before hashing when keys indicate sensitive material such as email, name, IP, token, secret, password, session, cookie, phone, DNI or NIF.

The ledger should prove operational sequence and decision context without turning audit records into a secondary PII store.

## Legal and forensic boundary

The ledger does not automatically create legal advice or forensic certification.

It creates structured operational evidence that can later support legal review, expert review, evidence bundle export or forensic certification under a defined professional protocol.

## Operating principle

If the system cannot reconstruct what happened, the organization is left with a story.

The ledger exists to make the story unnecessary.
