# Evidence Bundle Export

The evidence bundle export converts an operational evidence chain into a verifiable bundle.

It is designed to support later legal review, expert review, proof export, technical reconstruction and higher-assurance workflows.

## What it produces

A bundle contains:

- bundleId;
- manifestHash;
- bundleHash;
- generatedAt;
- generatedBy;
- case and intake references;
- protocol and commit references;
- operational evidence events;
- event chain verification;
- artifacts;
- limitations;
- redacted summary metadata.

## Hash model

The export separates two hashes:

- manifestHash: hash of the canonical bundle manifest;
- bundleHash: hash of the manifest hash, event hashes and normalized artifacts.

This makes the bundle independently verifiable.

If an event changes, the event chain verification fails.

If the manifest changes, the manifest hash changes.

If artifacts or event hashes change, the bundle hash changes.

## Privacy posture

Summary and artifact metadata are redacted using the operational evidence redaction rules.

The bundle should prove what happened without becoming a secondary store for unnecessary sensitive data.

## Current scope

This first version is domain-only.

It does not introduce a database migration.

It prepares the platform for later admin export endpoints, signed proof bundles, external verification and expert review workflows.
