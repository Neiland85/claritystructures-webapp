export function ControlRoomHeader() {
  return (
    <section className="rounded-3xl border border-emerald-300/20 bg-[#0D1B26] p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">
            Control Room
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            EV-2026-DEMO · Governed Case File
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Operational surface for a sensitive case context. This mock route
            visualizes readiness, blocked actions, governance decision, privacy
            boundary, transfer state and assurance trail.
          </p>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[420px]">
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-200/80">
              Readiness
            </p>
            <p className="mt-2 text-lg font-semibold text-amber-100">
              Under review
            </p>
          </div>
          <div className="rounded-2xl border border-violet-300/30 bg-violet-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-violet-200/80">
              Sensitivity
            </p>
            <p className="mt-2 text-lg font-semibold text-violet-100">
              Legal / sensitive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
