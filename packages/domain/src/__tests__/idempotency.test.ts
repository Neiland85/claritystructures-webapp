import { describe, expect, it } from "vitest";
import {
  buildIdempotencyFingerprint,
  buildResponseHash,
  requestHashesMatch,
  stableCanonicalJson,
} from "../idempotency";

describe("defensive idempotency", () => {
  it("canonicalizes object keys deterministically", () => {
    const left = stableCanonicalJson({ b: 2, a: 1 });
    const right = stableCanonicalJson({ a: 1, b: 2 });

    expect(left).toBe(right);
  });

  it("builds the same fingerprint for same semantic payload", () => {
    const first = buildIdempotencyFingerprint({
      scope: "intake.submit",
      version: "contact-intake/v1",
      payload: { b: 2, a: 1 },
    });

    const second = buildIdempotencyFingerprint({
      scope: "intake.submit",
      version: "contact-intake/v1",
      payload: { a: 1, b: 2 },
    });

    expect(first.key).toBe(second.key);
    expect(first.requestHash).toBe(second.requestHash);
    expect(requestHashesMatch(first.requestHash, second.requestHash)).toBe(
      true,
    );
  });

  it("keeps external keys but hashes request body", () => {
    const first = buildIdempotencyFingerprint({
      scope: "intake.submit",
      version: "contact-intake/v1",
      explicitKey: "browser-retry-001",
      payload: { message: "hello" },
    });

    const second = buildIdempotencyFingerprint({
      scope: "intake.submit",
      version: "contact-intake/v1",
      explicitKey: "browser-retry-001",
      payload: { message: "changed" },
    });

    expect(first.key).toBe("browser-retry-001");
    expect(second.key).toBe("browser-retry-001");
    expect(first.requestHash).not.toBe(second.requestHash);
  });

  it("hashes response bodies deterministically", () => {
    expect(buildResponseHash({ ok: true, id: "x" })).toBe(
      buildResponseHash({ id: "x", ok: true }),
    );
  });
});
