import { timeline } from "./control-room-demo-data";

export function AssuranceTrail() {
  return (
    <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
      <h2 className="text-lg font-semibold text-white">Assurance trail</h2>
      <div className="mt-5 space-y-4">
        {timeline.map((event) => (
          <div
            key={`${event.time}-${event.type}`}
            className="grid gap-3 rounded-2xl border border-slate-700/70 bg-[#102433] p-4 md:grid-cols-[80px_260px_1fr]"
          >
            <p className="font-mono text-sm text-slate-400">{event.time}</p>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-sky-200">
              {event.type}
            </p>
            <p className="text-sm text-slate-300">{event.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
