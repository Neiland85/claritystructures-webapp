import { sha256Hex, stableCanonicalJson } from "./idempotency";
import {
  redactOperationalEvidenceMetadata,
  verifyOperationalEvidenceChain,
} from "./operational-evidence-ledger";
import type {
  OperationalEvidenceChainVerification,
  OperationalEvidenceEvent,
} from "./operational-evidence-ledger";

export const EVIDENCE_BUNDLE_VERSION = "evidence-bundle-v1" as const;

export type EvidenceBundleActor = {
  type: "system" | "admin" | "expert" | "legal_reviewer" | "external";
  id: string;
  label?: string;
};

export type EvidenceBundleArtifact = {
  artifactId: string;
  label: string;
  mediaType: string;
  fileName?: string;
  sizeBytes?: number;
  hash?: string;
  hashAlgorithm?: "SHA-256" | "SHA-512" | "unknown";
  role?: "source" | "attachment" | "derived" | "export" | "report";
  metadata?: Record<string, unknown>;
};

export type EvidenceBundleInput = {
  title: string;
  generatedAt: Date | string;
  generatedBy: EvidenceBundleActor;
  caseId?: string | null;
  intakeId?: string | null;
  matterRef?: string | null;
  protocolRef?: string | null;
  commitRef?: string | null;
  summary?: Record<string, unknown>;
  limitations?: readonly string[];
  artifacts?: readonly EvidenceBundleArtifact[];
  events: readonly OperationalEvidenceEvent[];
};

export type EvidenceBundleManifest = {
  bundleVersion: typeof EVIDENCE_BUNDLE_VERSION;
  title: string;
  generatedAt: string;
  generatedBy: EvidenceBundleActor;
  caseId: string | null;
  intakeId: string | null;
  matterRef: string | null;
  protocolRef: string | null;
  commitRef: string | null;
  eventCount: number;
  artifactCount: number;
  firstEventHash: string | null;
  lastEventHash: string | null;
  chainVerification: OperationalEvidenceChainVerification;
  summary: unknown;
  limitations: string[];
};

export type EvidenceBundle = EvidenceBundleManifest & {
  bundleId: string;
  manifestHash: string;
  bundleHash: string;
  events: OperationalEvidenceEvent[];
  artifacts: EvidenceBundleArtifact[];
};

export type EvidenceBundleVerification =
  | {
      valid: true;
      bundleId: string;
      bundleHash: string;
      eventCount: number;
      artifactCount: number;
    }
  | {
      valid: false;
      reason: string;
      expected?: string | null;
      actual?: string | null;
    };

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

function normalizeGeneratedAt(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("generatedAt must be a valid date");
  }

  return date.toISOString();
}

function normalizeActor(actor: EvidenceBundleActor): EvidenceBundleActor {
  return {
    type: actor.type,
    id: normalizeRequiredString(actor.id, "generatedBy.id"),
    ...(actor.label
      ? { label: normalizeRequiredString(actor.label, "generatedBy.label") }
      : {}),
  };
}

function normalizeArtifacts(
  artifacts: readonly EvidenceBundleArtifact[] | undefined,
): EvidenceBundleArtifact[] {
  return [...(artifacts ?? [])].map((artifact) => ({
    artifactId: normalizeRequiredString(artifact.artifactId, "artifactId"),
    label: normalizeRequiredString(artifact.label, "artifact.label"),
    mediaType: normalizeRequiredString(
      artifact.mediaType,
      "artifact.mediaType",
    ),
    ...(artifact.fileName
      ? {
          fileName: normalizeRequiredString(
            artifact.fileName,
            "artifact.fileName",
          ),
        }
      : {}),
    ...(typeof artifact.sizeBytes === "number"
      ? { sizeBytes: artifact.sizeBytes }
      : {}),
    ...(artifact.hash
      ? { hash: normalizeRequiredString(artifact.hash, "artifact.hash") }
      : {}),
    ...(artifact.hashAlgorithm
      ? { hashAlgorithm: artifact.hashAlgorithm }
      : {}),
    ...(artifact.role ? { role: artifact.role } : {}),
    ...(artifact.metadata
      ? {
          metadata: redactOperationalEvidenceMetadata(
            artifact.metadata,
          ) as Record<string, unknown>,
        }
      : {}),
  }));
}

function buildManifest(input: EvidenceBundleInput): EvidenceBundleManifest {
  if (input.events.length === 0) {
    throw new Error("Evidence bundle requires at least one event");
  }

  const chainVerification = verifyOperationalEvidenceChain(input.events);

  if (!chainVerification.valid) {
    throw new Error(
      `Invalid operational evidence chain: ${chainVerification.reason}`,
    );
  }

  return {
    bundleVersion: EVIDENCE_BUNDLE_VERSION,
    title: normalizeRequiredString(input.title, "title"),
    generatedAt: normalizeGeneratedAt(input.generatedAt),
    generatedBy: normalizeActor(input.generatedBy),
    caseId: normalizeOptionalString(input.caseId, "caseId"),
    intakeId: normalizeOptionalString(input.intakeId, "intakeId"),
    matterRef: normalizeOptionalString(input.matterRef, "matterRef"),
    protocolRef: normalizeOptionalString(input.protocolRef, "protocolRef"),
    commitRef: normalizeOptionalString(input.commitRef, "commitRef"),
    eventCount: input.events.length,
    artifactCount: input.artifacts?.length ?? 0,
    firstEventHash: input.events[0]?.hash ?? null,
    lastEventHash: input.events[input.events.length - 1]?.hash ?? null,
    chainVerification,
    summary: redactOperationalEvidenceMetadata(input.summary ?? {}),
    limitations: [...(input.limitations ?? [])].map((item) =>
      normalizeRequiredString(item, "limitation"),
    ),
  };
}

export function buildEvidenceBundle(
  input: EvidenceBundleInput,
): EvidenceBundle {
  const artifacts = normalizeArtifacts(input.artifacts);
  const manifest = buildManifest({
    ...input,
    artifacts,
  });

  const manifestHash = sha256Hex(stableCanonicalJson(manifest));

  const bundleHash = sha256Hex(
    stableCanonicalJson({
      manifestHash,
      eventHashes: input.events.map((event) => event.hash),
      artifacts,
    }),
  );

  return {
    ...manifest,
    bundleId: `eb_${bundleHash.slice(0, 32)}`,
    manifestHash,
    bundleHash,
    events: [...input.events],
    artifacts,
  };
}

export function verifyEvidenceBundle(
  bundle: EvidenceBundle,
): EvidenceBundleVerification {
  try {
    const rebuilt = buildEvidenceBundle({
      title: bundle.title,
      generatedAt: bundle.generatedAt,
      generatedBy: bundle.generatedBy,
      caseId: bundle.caseId,
      intakeId: bundle.intakeId,
      matterRef: bundle.matterRef,
      protocolRef: bundle.protocolRef,
      commitRef: bundle.commitRef,
      summary: bundle.summary as Record<string, unknown>,
      limitations: bundle.limitations,
      artifacts: bundle.artifacts,
      events: bundle.events,
    });

    if (bundle.manifestHash !== rebuilt.manifestHash) {
      return {
        valid: false,
        reason: "manifestHash mismatch",
        expected: rebuilt.manifestHash,
        actual: bundle.manifestHash,
      };
    }

    if (bundle.bundleHash !== rebuilt.bundleHash) {
      return {
        valid: false,
        reason: "bundleHash mismatch",
        expected: rebuilt.bundleHash,
        actual: bundle.bundleHash,
      };
    }

    if (bundle.bundleId !== rebuilt.bundleId) {
      return {
        valid: false,
        reason: "bundleId mismatch",
        expected: rebuilt.bundleId,
        actual: bundle.bundleId,
      };
    }

    return {
      valid: true,
      bundleId: bundle.bundleId,
      bundleHash: bundle.bundleHash,
      eventCount: bundle.events.length,
      artifactCount: bundle.artifacts.length,
    };
  } catch (error) {
    return {
      valid: false,
      reason:
        error instanceof Error ? error.message : "unknown verification error",
    };
  }
}
