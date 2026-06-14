import type { ReviewNoteViewModel } from "./control-room-view-model";

type ReviewNotesPanelProps = {
  notes: ReviewNoteViewModel[];
};

export function ReviewNotesPanel({ notes }: ReviewNotesPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
      <h2 className="text-lg font-semibold text-white">Review notes</h2>
      <div className="mt-5 space-y-3">
        {notes.map((note) => (
          <div
            key={`${note.author}-${note.scope}`}
            className="rounded-2xl border border-slate-700/70 bg-[#102433] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{note.author}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {note.scope}
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
