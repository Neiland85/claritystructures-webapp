import type { GovernedCaseFile } from "../../../../../packages/domain/src/governed-casefile";
import type {
  ControlRoomSource,
  ControlRoomSourceReadinessItem,
  ControlRoomSourceStatus,
  ControlRoomSourceTone,
} from "./control-room-source";

function readinessTone(
  readinessState: GovernedCaseFile["readinessState"],
): ControlRoomSourceTone {
  if (readinessState === "ready" || readinessState === "closed") {
    return "ok";
  }

  if (readinessState === "blocked") {
    return "blocked";
  }

  return "review";
}

function privacyTone(
  privacyBoundary: GovernedCaseFile["privacyBoundary"],
): Extract<ControlRoomSourceTone, "review" | "legal"> {
  if (privacyBoundary?.status === "blocked") {
    return "legal";
  }

  return "review";
}

function sensitivityValue(
  sensitivity: GovernedCaseFile["sensitivity"],
): string {
  if (sensitivity === "legal_sensitive") {
    return "Legal / sensitive";
  }

  if (sensitivity === "sensitive") {
    return "Sensitive";
  }

  return "Standard";
}

function transferReadinessTone(
  transferReadiness: GovernedCaseFile["transferReadiness"],
): ControlRoomSourceTone {
  if (transferReadiness?.status === "ready") {
    return "ok";
  }

  if (transferReadiness?.status === "not_ready") {
    return "blocked";
  }

  return "review";
}

function buildStatus(caseFile: GovernedCaseFile): ControlRoomSourceStatus[] {
  return [
    {
      label: "Readiness",
      value: caseFile.readinessState.replaceAll("_", " "),
      tone: caseFile.readinessState === "blocked" ? "review" : "review",
    },
    {
      label: "Sensitivity",
      value: sensitivityValue(caseFile.sensitivity),
      tone: privacyTone(caseFile.privacyBoundary),
    },
  ];
}

function buildReadiness(
  caseFile: GovernedCaseFile,
): ControlRoomSourceReadinessItem[] {
  return [
    {
      label: "Context",
      status: caseFile.contextBoundaryState.replaceAll("_", " "),
      tone:
        caseFile.contextBoundaryState === "approved" ||
        caseFile.contextBoundaryState === "scoped"
          ? "ok"
          : "review",
      detail:
        caseFile.scopeMatrix[0]?.rationale ??
        "Context boundary requires review before evidence handling.",
    },
    {
      label: "Privacy",
      status:
        caseFile.privacyBoundary?.status.replaceAll("_", " ") ??
        "review required",
      tone: privacyTone(caseFile.privacyBoundary),
      detail:
        caseFile.privacyBoundary?.rationale ??
        "Privacy boundary requires review.",
    },
    {
      label: "Transfer",
      status:
        caseFile.transferReadiness?.status.replaceAll("_", " ") ??
        "review required",
      tone: transferReadinessTone(caseFile.transferReadiness),
      detail:
        caseFile.transferReadiness?.rationale ??
        "Transfer readiness requires review.",
    },
    {
      label: "Audit",
      status: caseFile.assuranceTrail.length > 0 ? "healthy" : "empty",
      tone: caseFile.assuranceTrail.length > 0 ? "ok" : "review",
      detail:
        caseFile.assuranceTrail.length > 0
          ? "Assurance trail is recording operational events."
          : "No assurance events have been recorded yet.",
    },
  ];
}

export function toControlRoomSource(
  caseFile: GovernedCaseFile,
): ControlRoomSource {
  const blockedActions = caseFile.governanceSummary?.blockedActions ?? [];
  const allowedActions = caseFile.governanceSummary?.allowedActions ?? [];

  return {
    caseRef: caseFile.caseRef,
    title: caseFile.title,
    subtitle:
      "Operational surface generated from a governed case-file domain object.",

    status: buildStatus(caseFile),
    readiness: buildReadiness(caseFile),

    governanceDecision: {
      eyebrow: "Governance decision",
      title:
        blockedActions.length > 0
          ? "Controlled actions are blocked"
          : "Controlled actions are available",
      summary:
        caseFile.governanceSummary?.status === "blocked"
          ? "The case file can continue internal review, but controlled external or transfer actions remain blocked."
          : "The case file has no blocked governance gates in the current summary.",
      allowed: [...allowedActions],
      blocked: blockedActions.map((action) => action.gate),
    },

    allowedActions: [...allowedActions],

    blockedActions: blockedActions.map((action) => ({
      action: action.gate,
      reason: action.reason,
      unlock: action.unlock ?? "Resolve the control gate requirement.",
    })),

    assuranceTrail: caseFile.assuranceTrail.map((event) => ({
      time: event.occurredAt,
      type: event.type,
      result: event.summary,
    })),

    privacyBoundary: {
      title: "Privacy boundary",
      text:
        caseFile.privacyBoundary?.rationale ??
        "Privacy boundary requires review.",
    },

    reviewNotes: caseFile.reviewNotes.map((note) => ({
      author: note.author,
      scope: note.scope,
      text: note.text,
    })),
  };
}
