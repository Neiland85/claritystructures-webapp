import { sha256Hex, stableCanonicalJson } from "./idempotency";

export const OPERATIONAL_EVIDENCE_LEDGER_VERSION = "oe-ledger-v1" as const;

export const OPERATIONAL_EVIDENCE_EVENT_TYPES = [
  "INTAKE_RECEIVED",
  "CONSENT_RECORDED",
  "DECISION_COMPUTED",
  "ROUTE_ASSIGNED",
  "NOTIFICATION_SENT",
  "ADMIN_REVIEWED",
  "EXPORT_GENERATED",
] as const;

export type OperationalEvidenceEventType =
  (typeof OPERATIONAL_EVIDENCE_EVENT_TYPES)[number];

export type OperationalEvidenceActorType =
  | "system"
  | "user"
  | "admin"
  | "expert"
  | "legal_reviewer"
  | "external";

export type OperationalEvidenceActor = {
  type: OperationalEvidenceActorType;
  id: string;
  label?: string;
};

export type OperationalEvidenceEventInput = {
  eventType: OperationalEvidenceEventType | (string & {});
  occurredAt: Date | string;
  actor: OperationalEvidenceActor;
  source: string;
  caseId?: string | null;
  intakeId?: string | null;
  decisionVersion?: string | null;
  metadata?: Record<string, unknown>;
  previousHash?: string | null;
};

export type OperationalEvidencePayload = {
  ledgerVersion: typeof OPERATIONAL_EVIDENCE_LEDGER_VERSION;
  eventType: string;
  occurredAt: string;
  actor: OperationalEvidenceActor;
  source: string;
  caseId: string | null;
  intakeId: string | null;
  decisionVersion: string | null;
  metadata: unknown;
};

export type OperationalEvidenceEvent = OperationalEvidencePayload & {
  eventId: string;
  payloadHash: string;
  previousHash: string | null;
  hash: string;
};

export type OperationalEvidenceChainVerification =
  | {
      valid: true;
      length: number;
      lastHash: string | null;
    }
  | {
      valid: false;
      index: number;
      reason: string;
      expected?: string | null;
      actual?: string | null;
    };

const REDACTED_VALUE = "[REDACTED]";

const SENSITIVE_METADATA_KEY_PARTS = [
  "authorization",
  "cookie",
  "dni",
  "email",
  "ip",
  "name",
  "nif",
  "password",
  "phone",
  "secret",
  "session",
  "token",
];

function isSensitiveMetadataKey(key: string): boolean {
  const normalized = key.toLowerCase();

  return SENSITIVE_METADATA_KEY_PARTS.some((part) => normalized.includes(part));
}

function normalizeRequiredString(value: string, field: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${field} cannot be empty`);
  }

  return normalized;
}

function normalizeOptionalString(
  value: string | null | undefined,
  field: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${field} cannot be empty when provided`);
  }

  return normalized;
}

function normalizeOccurredAt(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("occurredAt must be a valid date");
  }

  return date.toISOString();
}

export function redactOperationalEvidenceMetadata(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const valueType = typeof value;

  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactOperationalEvidenceMetadata(item));
  }

  if (valueType === "object") {
    const record = value as Record<string, unknown>;
    const redacted: Record<string, unknown> = {};

    for (const key of Object.keys(record).sort()) {
      redacted[key] = isSensitiveMetadataKey(key)
        ? REDACTED_VALUE
        : redactOperationalEvidenceMetadata(record[key]);
    }

    return redacted;
  }

  return String(value);
}

export function buildOperationalEvidencePayload(
  input: OperationalEvidenceEventInput,
): OperationalEvidencePayload {
  return {
    ledgerVersion: OPERATIONAL_EVIDENCE_LEDGER_VERSION,
    eventType: normalizeRequiredString(input.eventType, "eventType"),
    occurredAt: normalizeOccurredAt(input.occurredAt),
    actor: {
      type: input.actor.type,
      id: normalizeRequiredString(input.actor.id, "actor.id"),
      ...(input.actor.label
        ? { label: normalizeRequiredString(input.actor.label, "actor.label") }
        : {}),
    },
    source: normalizeRequiredString(input.source, "source"),
    caseId: normalizeOptionalString(input.caseId, "caseId"),
    intakeId: normalizeOptionalString(input.intakeId, "intakeId"),
    decisionVersion: normalizeOptionalString(
      input.decisionVersion,
      "decisionVersion",
    ),
    metadata: redactOperationalEvidenceMetadata(input.metadata ?? {}),
  };
}

function buildEventHash(
  payloadHash: string,
  previousHash: string | null,
): string {
  return sha256Hex(
    stableCanonicalJson({
      ledgerVersion: OPERATIONAL_EVIDENCE_LEDGER_VERSION,
      payloadHash,
      previousHash,
    }),
  );
}

export function buildOperationalEvidenceEvent(
  input: OperationalEvidenceEventInput,
): OperationalEvidenceEvent {
  const payload = buildOperationalEvidencePayload(input);
  const payloadHash = sha256Hex(stableCanonicalJson(payload));
  const previousHash = input.previousHash ?? null;
  const hash = buildEventHash(payloadHash, previousHash);

  return {
    ...payload,
    eventId: `oev_${hash.slice(0, 32)}`,
    payloadHash,
    previousHash,
    hash,
  };
}

export function buildOperationalEvidenceChain(
  inputs: readonly OperationalEvidenceEventInput[],
): OperationalEvidenceEvent[] {
  let previousHash: string | null = null;

  return inputs.map((input) => {
    const event = buildOperationalEvidenceEvent({
      ...input,
      previousHash: input.previousHash ?? previousHash,
    });

    previousHash = event.hash;

    return event;
  });
}

export function verifyOperationalEvidenceChain(
  events: readonly OperationalEvidenceEvent[],
): OperationalEvidenceChainVerification {
  let previousHash: string | null = null;

  for (const [index, event] of events.entries()) {
    if (event.previousHash !== previousHash) {
      return {
        valid: false,
        index,
        reason: "previousHash mismatch",
        expected: previousHash,
        actual: event.previousHash,
      };
    }

    const payload: OperationalEvidencePayload = {
      ledgerVersion: event.ledgerVersion,
      eventType: event.eventType,
      occurredAt: event.occurredAt,
      actor: event.actor,
      source: event.source,
      caseId: event.caseId,
      intakeId: event.intakeId,
      decisionVersion: event.decisionVersion,
      metadata: event.metadata,
    };

    const expectedPayloadHash = sha256Hex(stableCanonicalJson(payload));

    if (event.payloadHash !== expectedPayloadHash) {
      return {
        valid: false,
        index,
        reason: "payloadHash mismatch",
        expected: expectedPayloadHash,
        actual: event.payloadHash,
      };
    }

    const expectedHash = buildEventHash(event.payloadHash, event.previousHash);

    if (event.hash !== expectedHash) {
      return {
        valid: false,
        index,
        reason: "event hash mismatch",
        expected: expectedHash,
        actual: event.hash,
      };
    }

    const expectedEventId = `oev_${event.hash.slice(0, 32)}`;

    if (event.eventId !== expectedEventId) {
      return {
        valid: false,
        index,
        reason: "eventId mismatch",
        expected: expectedEventId,
        actual: event.eventId,
      };
    }

    previousHash = event.hash;
  }

  return {
    valid: true,
    length: events.length,
    lastHash: previousHash,
  };
}
