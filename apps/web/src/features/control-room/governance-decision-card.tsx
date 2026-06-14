import type { GovernanceDecisionViewModel } from "./control-room-view-model";

type GovernanceDecisionCardProps = {
  decision: GovernanceDecisionViewModel;
};

export function GovernanceDecisionCard({
  decision,
}: GovernanceDecisionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
      <div className="flex flex-col gap-3 border-b border-slate-700/70 pb-5">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
          {decision.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-white">{decision.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          {decision.summary}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <h3 className="font-semibold text-emerald-100">Allowed</h3>
          <ul className="mt-4 space-y-2 text-sm text-emerald-50/90">
            {decision.allowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5">
          <h3 className="font-semibold text-rose-100">Blocked</h3>
          <ul className="mt-4 space-y-2 text-sm text-rose-50/90">
            {decision.blocked.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
