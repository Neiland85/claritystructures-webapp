# 03 — Evidence Lifecycle

## Purpose

This document defines the institutional lifecycle for sensitive digital case material.

The current system is primarily an intake, decision, governance, derivation, and transfer layer. It must not overclaim forensic custody unless custody controls are explicitly implemented and verified.

## Lifecycle stages

```text
1. Intake received
2. Validation performed
3. Wizard result normalized
4. Decision calculated
5. Governance envelope created
6. Guardian decision created
7. Intake persisted
8. Audit recorded
9. Consent recorded when applicable
10. Legal derivation requested when applicable
11. Transfer packet assembled
12. Manifest hash calculated
13. Transfer logged
14. Retention/legal hold applied when applicable
Evidence handling rule

The system may describe, classify, and govern intake data.

The system must not claim:

forensic acquisition;
forensic imaging;
device inspection;
authenticity certification;
chain-of-custody completion;

unless those controls are implemented, documented, and independently verified.

Transfer packet

A transfer packet is a minimized, deterministic, hashable payload prepared for legal derivation or external review.

It includes:

schema version;
generated timestamp;
packet idempotency key;
intake summary;
decision artifact;
SLA snapshot;
chronology.
Manifest hash

The manifest hash provides an integrity control over the assembled packet.

If the same logical transfer is assembled with the same canonical content and generation identity, the resulting hash must remain stable.

Institutional rule

Transfer is not just data movement. Transfer is an auditable institutional event.
```
