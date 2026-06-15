import { getControlRoomResolutionStatusCopy } from "./control-room-resolution-status";
import type { ControlRoomResolutionStatus } from "./control-room-resolution-status";

export type ResolutionStatusBannerProps = {
  caseId: string;
  source: "in-memory";
  status: ControlRoomResolutionStatus;
  reason?: string;
  resolvedCaseRef?: string;
};

export function ResolutionStatusBanner({
  caseId,
  source,
  status,
  reason,
  resolvedCaseRef,
}: ResolutionStatusBannerProps) {
  const copy = getControlRoomResolutionStatusCopy({
    caseId,
    status,
    reason,
    resolvedCaseRef,
  });

  return (
    <section
      aria-label="Control Room resolver status"
      className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            {copy.title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            {copy.message}
          </p>
        </div>

        <dl className="grid gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-500">source</dt>
            <dd>{source}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-slate-500">status</dt>
            <dd>{status}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
