export function toneClass(tone: string) {
  switch (tone) {
    case "ok":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
    case "review":
      return "border-amber-300/40 bg-amber-300/10 text-amber-100";
    case "legal":
      return "border-violet-300/40 bg-violet-300/10 text-violet-100";
    case "blocked":
      return "border-rose-300/40 bg-rose-300/10 text-rose-100";
    default:
      return "border-slate-400/30 bg-slate-400/10 text-slate-100";
  }
}
