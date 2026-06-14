import { readinessItems } from "./control-room-demo-data";
import { toneClass } from "./control-room-style";

export function ReadinessRadar() {
  return (
    <aside className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-5">
      <h2 className="text-lg font-semibold text-white">Readiness radar</h2>
      <div className="mt-5 flex flex-col gap-3">
        {readinessItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-4 ${toneClass(item.tone)}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{item.label}</p>
              <p className="text-xs uppercase tracking-[0.18em] opacity-80">
                {item.status}
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 opacity-80">{item.detail}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
