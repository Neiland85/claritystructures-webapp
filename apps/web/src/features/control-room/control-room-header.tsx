import type { ControlRoomViewModel } from "./control-room-view-model";

type ControlRoomHeaderProps = {
  viewModel: Pick<
    ControlRoomViewModel,
    "caseRef" | "title" | "subtitle" | "status"
  >;
};

export function ControlRoomHeader({ viewModel }: ControlRoomHeaderProps) {
  return (
    <section className="rounded-3xl border border-emerald-300/20 bg-[#0D1B26] p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">
            Control Room
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            {viewModel.caseRef} · {viewModel.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {viewModel.subtitle}
          </p>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[420px]">
          {viewModel.status.map((item) => (
            <div
              key={item.label}
              className={
                item.tone === "legal"
                  ? "rounded-2xl border border-violet-300/30 bg-violet-300/10 p-4"
                  : "rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4"
              }
            >
              <p
                className={
                  item.tone === "legal"
                    ? "text-xs uppercase tracking-[0.25em] text-violet-200/80"
                    : "text-xs uppercase tracking-[0.25em] text-amber-200/80"
                }
              >
                {item.label}
              </p>
              <p
                className={
                  item.tone === "legal"
                    ? "mt-2 text-lg font-semibold text-violet-100"
                    : "mt-2 text-lg font-semibold text-amber-100"
                }
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
