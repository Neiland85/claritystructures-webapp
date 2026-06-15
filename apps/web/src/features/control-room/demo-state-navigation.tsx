import Link from "next/link";

export type ControlRoomDemoStateLink = {
  caseId: string;
  status: "found" | "not_found" | "blocked" | "unavailable";
  label: string;
  description: string;
};

const demoStateLinks: ControlRoomDemoStateLink[] = [
  {
    caseId: "EV-2026-DEMO",
    status: "found",
    label: "Resolved governed case",
    description: "Loads the governed demo case file through the repository.",
  },
  {
    caseId: "future-real-case",
    status: "not_found",
    label: "Controlled not_found",
    description: "Exercises the safe fallback when no governed case exists.",
  },
  {
    caseId: "blocked-case",
    status: "blocked",
    label: "Controlled blocked",
    description: "Exercises the policy-gated fallback path.",
  },
  {
    caseId: "unavailable-case",
    status: "unavailable",
    label: "Controlled unavailable",
    description: "Exercises the source-unavailable fallback path.",
  },
];

export type DemoStateNavigationProps = {
  activeCaseId: string;
};

export function DemoStateNavigation({
  activeCaseId,
}: DemoStateNavigationProps) {
  return (
    <nav
      aria-label="Control Room demo resolver states"
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30"
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Demo resolver states
        </p>
        <h2 className="text-lg font-semibold text-white">
          Exercise the resolver without changing infrastructure
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          These links drive the same dynamic route through controlled repository
          outcomes: found, not_found, blocked, and unavailable.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {demoStateLinks.map((item) => {
          const active = item.caseId === activeCaseId;

          return (
            <Link
              key={item.caseId}
              href={`/control/cases/${item.caseId}`}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-xl border border-cyan-300 bg-cyan-300/15 p-3 text-cyan-50 shadow-lg shadow-cyan-950/30"
                  : "rounded-xl border border-slate-700 bg-slate-950/40 p-3 text-slate-200 transition hover:border-cyan-400/70 hover:bg-cyan-400/10"
              }
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                {item.status}
              </span>
              <span className="mt-2 block text-sm font-semibold">
                {item.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-300">
                {item.description}
              </span>
              <span className="mt-3 block rounded-lg bg-slate-950/50 px-2 py-1 font-mono text-[11px] text-slate-300">
                /control/cases/{item.caseId}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
