import type { ControlRoomSource } from "./control-room-source";
import type { ControlRoomViewModel } from "./control-room-view-model";

export function toControlRoomViewModel(
  source: ControlRoomSource,
): ControlRoomViewModel {
  return {
    caseRef: source.caseRef,
    title: source.title,
    subtitle: source.subtitle,

    status: source.status.map((item) => ({
      label: item.label,
      value: item.value,
      tone: item.tone,
    })),

    readiness: source.readiness.map((item) => ({
      label: item.label,
      status: item.status,
      tone: item.tone,
      detail: item.detail,
    })),

    governanceDecision: {
      eyebrow: source.governanceDecision.eyebrow,
      title: source.governanceDecision.title,
      summary: source.governanceDecision.summary,
      allowed: [...source.governanceDecision.allowed],
      blocked: [...source.governanceDecision.blocked],
    },

    allowedActions: [...source.allowedActions],

    blockedActions: source.blockedActions.map((item) => ({
      action: item.action,
      reason: item.reason,
      unlock: item.unlock,
    })),

    assuranceTrail: source.assuranceTrail.map((event) => ({
      time: event.time,
      type: event.type,
      result: event.result,
    })),

    privacyBoundary: {
      title: source.privacyBoundary.title,
      text: source.privacyBoundary.text,
    },

    reviewNotes: source.reviewNotes.map((note) => ({
      author: note.author,
      scope: note.scope,
      text: note.text,
    })),
  };
}
