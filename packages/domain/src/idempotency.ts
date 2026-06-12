import { createHash, timingSafeEqual } from "node:crypto";

export const IDEMPOTENCY_SCOPES = [
  "intake.submit",
  "legal.derivation.consent",
  "transfer.generate",
  "sla.create_timers",
  "sla.complete_milestone",
  "retention.purge",
  "evidence.package.verify",
  "asset.close",
] as const;

export type IdempotencyScope = (typeof IDEMPOTENCY_SCOPES)[number];

export type IdempotencyStatus = "in_progress" | "completed" | "failed";

export type IdempotencyFingerprint = {
  scope: IdempotencyScope;
  key: string;
  version: string;
  requestHash: string;
  canonicalPayload: string;
};

export type BuildIdempotencyFingerprintInput = {
  scope: IdempotencyScope;
  version: string;
  payload: unknown;
  explicitKey?: string | null;
};

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeExplicitKey(key: string): string {
  const normalized = key.trim();

  if (!normalized) {
    throw new Error("Idempotency key cannot be empty");
  }

  if (normalized.length > 160) {
    return `idmp_external_${sha256Hex(normalized)}`;
  }

  return normalized;
}

function canonicalize(value: unknown): unknown {
  if (value === null) return null;
  if (value === undefined) return null;
  if (value instanceof Date) return value.toISOString();

  const valueType = typeof value;

  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }

  if (valueType === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};

    for (const key of Object.keys(record).sort()) {
      const next = record[key];
      if (next !== undefined) {
        sorted[key] = canonicalize(next);
      }
    }

    return sorted;
  }

  return String(value);
}

export function stableCanonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

export function buildIdempotencyFingerprint(
  input: BuildIdempotencyFingerprintInput,
): IdempotencyFingerprint {
  const canonicalPayload = stableCanonicalJson({
    scope: input.scope,
    version: input.version,
    payload: input.payload,
  });

  const requestHash = sha256Hex(canonicalPayload);

  const key = input.explicitKey
    ? normalizeExplicitKey(input.explicitKey)
    : `idmp_${input.scope}_${requestHash.slice(0, 32)}`;

  return Object.freeze({
    scope: input.scope,
    key,
    version: input.version,
    requestHash,
    canonicalPayload,
  });
}

export function buildResponseHash(responseBody: unknown): string {
  return sha256Hex(stableCanonicalJson(responseBody));
}

export function requestHashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}
