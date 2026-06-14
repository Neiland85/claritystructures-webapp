import type { BlockedActionViewModel } from "./control-room-view-model";

type ActionsPanelProps = {
  allowedActions: string[];
  blockedActions: BlockedActionViewModel[];
};

export function ActionsPanel({
  allowedActions,
  blockedActions,
}: ActionsPanelProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-5">
        <h2 className="text-lg font-semibold text-white">Available actions</h2>
        <div className="mt-5 flex flex-col gap-3">
          {allowedActions.map((action) => (
            <button
              key={action}
              className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-left text-sm font-medium text-emerald-50 transition hover:border-emerald-200/60 hover:bg-emerald-300/15"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-rose-300/30 bg-rose-300/10 p-5">
        <h2 className="text-lg font-semibold text-rose-100">Blocked actions</h2>
        <div className="mt-5 flex flex-col gap-4">
          {blockedActions.map((item) => (
            <div
              key={item.action}
              className="rounded-2xl border border-rose-200/20 bg-black/15 p-4"
            >
              <p className="font-medium text-rose-50">{item.action}</p>
              <p className="mt-2 text-xs leading-5 text-rose-100/80">
                Blocked: {item.reason}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Unlock: {item.unlock}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
