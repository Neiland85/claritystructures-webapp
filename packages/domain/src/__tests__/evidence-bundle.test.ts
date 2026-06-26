import { describe, expect, it } from "vitest";
import { buildOperationalEvidenceChain } from "../operational-evidence-ledger";
import { buildEvidenceBundle, verifyEvidenceBundle } from "../evidence-bundle";

function buildEvents() {
  return buildOperationalEvidenceChain([
    {
      eventType: "INTAKE_RECEIVED",
      occurredAt: "2026-06-26T08:00:00.000Z",
      actor: { type: "system", id: "contact-api" },
      source: "contact-route",
      intakeId: "intake-001",
      metadata: { route: "/contact" },
    },
    {
      eventType: "CONSENT_RECORDED",
      occurredAt: "2026-06-26T08:00:02.000Z",
      actor: { type: "system", id: "submit-intake-use-case" },
      source: "submit-intake",
      intakeId: "intake-001",
      metadata: { consentVersion: "v1" },
    },
    {
      eventType: "EXPORT_GENERATED",
      occurredAt: "2026-06-26T08:05:00.000Z",
      actor: { type: "admin", id: "admin-console" },
      source: "proof-bundle-export",
      intakeId: "intake-001",
    },
  ]);
}

describe("evidence bundle export", () => {
  it("builds a verifiable evidence bundle", () => {
    const events = buildEvents();

    const bundle = buildEvidenceBundle({
      title: "Operational intake proof bundle",
      generatedAt: "2026-06-26T09:00:00.000Z",
      generatedBy: { type: "admin", id: "admin-console" },
      caseId: "case-001",
      intakeId: "intake-001",
      protocolRef: "legal-forensic-operating-boundary-v1",
      commitRef: "894088f",
      summary: {
        route: "legal_review",
        email: "client@example.com",
      },
      limitations: ["Domain-only export. No external signature attached."],
      artifacts: [
        {
          artifactId: "artifact-001",
          label: "Source intake JSON",
          mediaType: "application/json",
          fileName: "intake-001.json",
          hash: "a".repeat(64),
          hashAlgorithm: "SHA-256",
          role: "source",
          metadata: {
            accessToken: "secret-token",
            format: "json",
          },
        },
      ],
      events,
    });

    expect(bundle.bundleId).toMatch(/^eb_[a-f0-9]{32}$/);
    expect(bundle.manifestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(bundle.bundleHash).toMatch(/^[a-f0-9]{64}$/);
    expect(bundle.eventCount).toBe(3);
    expect(bundle.artifactCount).toBe(1);
    expect(bundle.firstEventHash).toBe(events[0].hash);
    expect(bundle.lastEventHash).toBe(events[2].hash);
    expect(bundle.summary).toEqual({
      email: "[REDACTED]",
      route: "legal_review",
    });
    expect(bundle.artifacts[0].metadata).toEqual({
      accessToken: "[REDACTED]",
      format: "json",
    });

    expect(verifyEvidenceBundle(bundle)).toEqual({
      valid: true,
      bundleId: bundle.bundleId,
      bundleHash: bundle.bundleHash,
      eventCount: 3,
      artifactCount: 1,
    });
  });

  it("builds deterministic bundles from the same evidence", () => {
    const events = buildEvents();

    const left = buildEvidenceBundle({
      title: "Bundle",
      generatedAt: new Date("2026-06-26T09:00:00.000Z"),
      generatedBy: { type: "expert", id: "expert-001" },
      events,
      summary: {
        b: 2,
        a: 1,
      },
    });

    const right = buildEvidenceBundle({
      title: "Bundle",
      generatedAt: "2026-06-26T09:00:00.000Z",
      generatedBy: { type: "expert", id: "expert-001" },
      events,
      summary: {
        a: 1,
        b: 2,
      },
    });

    expect(right).toEqual(left);
  });

  it("rejects invalid event chains", () => {
    const events = buildEvents();

    const broken = [
      events[0],
      {
        ...events[1],
        previousHash: "bad_previous_hash",
      },
    ];

    expect(() =>
      buildEvidenceBundle({
        title: "Broken bundle",
        generatedAt: "2026-06-26T09:00:00.000Z",
        generatedBy: { type: "system", id: "test" },
        events: broken,
      }),
    ).toThrow("Invalid operational evidence chain");
  });

  it("detects tampered bundle hashes", () => {
    const bundle = buildEvidenceBundle({
      title: "Bundle",
      generatedAt: "2026-06-26T09:00:00.000Z",
      generatedBy: { type: "system", id: "test" },
      events: buildEvents(),
    });

    const tampered = {
      ...bundle,
      bundleHash: "b".repeat(64),
    };

    expect(verifyEvidenceBundle(tampered)).toEqual({
      valid: false,
      reason: "bundleHash mismatch",
      expected: bundle.bundleHash,
      actual: "b".repeat(64),
    });
  });
});
