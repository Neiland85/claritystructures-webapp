import crypto from 'crypto';

type JsonValue = unknown;

function sortJson(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, JsonValue>>((acc, key) => {
        acc[key] = sortJson((value as Record<string, JsonValue>)[key]);
        return acc;
      }, {});
  }

  return value;
}

export function stableStringify(payload: JsonValue): string {
  return JSON.stringify(sortJson(payload));
}

export function hashSha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}
