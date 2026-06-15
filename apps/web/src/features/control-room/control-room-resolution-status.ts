import type { ControlRoomCaseSourceResult } from "./control-room-case-repository";

export type ControlRoomResolutionStatus = ControlRoomCaseSourceResult["status"];

export type ControlRoomResolutionStatusCopy = {
  eyebrow: string;
  title: string;
  message: string;
};

export function getControlRoomResolutionStatusCopy(args: {
  caseId: string;
  status: ControlRoomResolutionStatus;
  reason?: string;
  resolvedCaseRef?: string;
}): ControlRoomResolutionStatusCopy {
  const { caseId, status, reason, resolvedCaseRef } = args;

  if (status === "found") {
    return {
      eyebrow: "CONTROL ROOM SOURCE",
      title: "Case source resolved",
      message: `Resolver loaded governed case ${resolvedCaseRef ?? caseId} for route ${caseId}.`,
    };
  }

  if (status === "not_found") {
    return {
      eyebrow: "CONTROLLED FALLBACK",
      title: "Case id not found",
      message:
        reason ??
        `No governed case file exists for ${caseId}. The current demo view remains available as a safe fallback.`,
    };
  }

  if (status === "blocked") {
    return {
      eyebrow: "CONTROLLED FALLBACK",
      title: "Access blocked by policy gate",
      message:
        reason ??
        `The governed case exists, but a policy gate blocks exposure for ${caseId}.`,
    };
  }

  return {
    eyebrow: "CONTROLLED FALLBACK",
    title: "Source unavailable",
    message:
      reason ??
      `The repository could not answer safely for ${caseId}. The current demo view remains available as a safe fallback.`,
  };
}
