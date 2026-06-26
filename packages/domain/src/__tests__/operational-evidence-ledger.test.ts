import { describe, expect, it } from "vitest";
import {
  buildOperationalEvidenceChain,
  buildOperationalEvidenceEvent,
  redactOperationalEvidenceMetadata,
  verifyOperationalEvidenceChain,
} from "../operational-evidence-ledger";

describe("operational evidence ledger", () => {
  it("builds deterministic events", () => {
    const left = buildOperationalEvidenceEvent({
      eventType: "INTAKE_RECEIVED",
      occurredAt: "2026-06-26T08:00:00.000Z",
      actor: { type: "system", id: "contact-api" },
      source: "contact-route",
      intakeId: "intake-001",
      metadata: {
        route: "/contact",
        priority: "critical",
      },
    });

    const right = buildOperationalEvidenceEvent({
      eventType: "INTAKE_RECEIVED",
      occurredAt: new Date("2026-06-26T08:00:00.000Z"),
      actor: { type: "system", id: "contact-api" },
      source: "contact-route",
      intakeId: "intake-001",
      metadata: {
        priority: "critical",
        route: "/contact",
      },
    });

    expect(right).toEqual(left);
    expect(left.eventId).toMatch(/^oev_[a-f0-9]{32}$/);
    expect(left.payloadHash).toMatch(/^[a-f0-9]{64}$/);
    expect(left.hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("links events through previousHash", () => {
    const chain = buildOperationalEvidenceChain([
      {
        eventType: "INTAKE_RECEIVED",
        occurredAt: "2026-06-26T08:00:00.000Z",
        actor: { type: "system", id: "contact-api" },
        source: "contact-route",
        intakeId: "intake-001",
      },
      {
        eventType: "CONSENT_RECORDED",
        occurredAt: "2026-06-26T08:00:02.000Z",
        actor: { type: "system", id: "submit-intake-use-case" },
        source: "submit-intake",
        intakeId: "intake-001",
        metadata: { consentVersion: "v1" },
      },
    ]);

    expect(chain[0].previousHash).toBeNull();
    expect(chain[1].previousHash).toBe(chain[0].hash);

    expect(verifyOperationalEvidenceChain(chain)).toEqual({
      valid: true,
      length: 2,
      lastHash: chain[1].hash,
    });
  });

  it("redacts sensitive metadata", () => {
    const metadata = redactOperationalEvidenceMetadata({
      email: "client@example.com",
      userName: "Jane Doe",
      consentVersion: "v1",
      nested: {
        accessToken: "secret-token",
        route: "legal_review",
      },
    });

    expect(metadata).toEqual({
      consentVersion: "v1",
      email: "[REDACTED]",
      nested: {
        accessToken: "[REDACTED]",
        route: "legal_review",
      },
      userName: "[REDACTED]",
    });
  });

  it("detects broken chains", () => {
    const chain = buildOperationalEvidenceChain([
      {
        eventType: "INTAKE_RECEIVED",
        occurredAt: "2026-06-26T08:00:00.000Z",
        actor: { type: "system", id: "contact-api" },
        source: "contact-route",
        intakeId: "intake-001",
      },
      {
        eventType: "EXPORT_GENERATED",
        occurredAt: "2026-06-26T08:05:00.000Z",
        actor: { type: "admin", id: "admin-console" },
        source: "proof-bundle-export",
        intakeId: "intake-001",
      },
    ]);

    const broken = [
      chain[0],
      {
        ...chain[1],
        previousHash: "bad_previous_hash",
      },
    ];

    expect(verifyOperationalEvidenceChain(broken)).toEqual({
      valid: false,
      index: 1,
      reason: "previousHash mismatch",
      expected: chain[0].hash,
      actual: "bad_previous_hash",
    });
  });
});
