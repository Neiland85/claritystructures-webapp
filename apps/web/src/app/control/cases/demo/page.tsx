const readinessItems = [
  {
    label: "Context",
    status: "Unclear",
    tone: "review",
    detail: "Context boundary requires human review before evidence handling.",
  },
  {
    label: "Consent",
    status: "Pending",
    tone: "blocked",
    detail: "No active authorization for external transfer.",
  },
  {
    label: "Privacy",
    status: "Review required",
    tone: "legal",
    detail: "Sensitive/legal signals detected in the case intake.",
  },
  {
    label: "Evidence",
    status: "Scoped",
    tone: "ok",
    detail: "18 candidate items in scope, 7 marked out of scope.",
  },
  {
    label: "Transfer",
    status: "Blocked",
    tone: "blocked",
    detail: "Controlled transfer package cannot be generated yet.",
  },
  {
    label: "Audit",
    status: "Healthy",
    tone: "ok",
    detail: "Assurance trail is recording operational events.",
  },
] as const;

const allowedActions = [
  "Add review note",
  "Run readiness check",
  "Classify scope",
  "Request legal/privacy review",
  "Export internal summary",
];

const blockedActions = [
  {
    action: "Generate transfer package",
    reason: "Missing active authorization record.",
    unlock: "Register consent and close scope matrix.",
  },
  {
    action: "Legal derivation",
    reason: "Case requires human review before derivation.",
    unlock: "Resolve privacy boundary and review requirement.",
  },
  {
    action: "Mark evidence-ready",
    reason: "Context boundary is still unclear.",
    unlock: "Complete context classification.",
  },
];

const timeline = [
  {
    time: "23:40",
    type: "CASE_FILE_CREATED",
    result: "Governed case file initialized.",
  },
  {
    time: "23:42",
    type: "GOVERNANCE_DECISION_RECORDED",
    result: "Guardian decision generated with blocked transfer actions.",
  },
  {
    time: "23:44",
    type: "CONTROL_GATE_BLOCKED",
    result: "Transfer package gate blocked: consent missing.",
  },
  {
    time: "23:46",
    type: "PRIVACY_REVIEW_REQUIRED",
    result: "Sensitive/legal indicators require review.",
  },
];

const notes = [
  {
    author: "System",
    scope: "privacy",
    text: "Privacy baseline exists, but DPO/legal validation remains pending before formal compliance claims.",
  },
  {
    author: "Reviewer",
    scope: "context",
    text: "Do not treat intake material as evidence-ready until context boundary is resolved.",
  },
];

function toneClass(tone: string) {
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

export default function ControlRoomDemoPage() {
  return (
    <main className="min-h-screen bg-[#071018] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
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
                Operational surface for a sensitive case context. This mock
                route visualizes readiness, blocked actions, governance
                decision, privacy boundary, transfer state and assurance trail.
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

        <section className="grid gap-6 lg:grid-cols-[280px_1fr_330px]">
          <aside className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-5">
            <h2 className="text-lg font-semibold text-white">
              Readiness radar
            </h2>
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
                  <p className="mt-2 text-xs leading-5 opacity-80">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
              <div className="flex flex-col gap-3 border-b border-slate-700/70 pb-5">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                  Governance decision
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Transfer and legal derivation are blocked
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-slate-300">
                  The system can persist, classify, audit and request review. It
                  cannot generate an external transfer package while consent is
                  missing and the context boundary remains unclear.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                  <h3 className="font-semibold text-emerald-100">Allowed</h3>
                  <ul className="mt-4 space-y-2 text-sm text-emerald-50/90">
                    <li>persist_intake</li>
                    <li>classify_context</li>
                    <li>record_audit_event</li>
                    <li>request_review</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5">
                  <h3 className="font-semibold text-rose-100">Blocked</h3>
                  <ul className="mt-4 space-y-2 text-sm text-rose-50/90">
                    <li>evidence_handling</li>
                    <li>legal_derivation</li>
                    <li>external_transfer</li>
                    <li>transfer_packet_generation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
              <h2 className="text-lg font-semibold text-white">
                Assurance trail
              </h2>
              <div className="mt-5 space-y-4">
                {timeline.map((event) => (
                  <div
                    key={`${event.time}-${event.type}`}
                    className="grid gap-3 rounded-2xl border border-slate-700/70 bg-[#102433] p-4 md:grid-cols-[80px_260px_1fr]"
                  >
                    <p className="font-mono text-sm text-slate-400">
                      {event.time}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-sky-200">
                      {event.type}
                    </p>
                    <p className="text-sm text-slate-300">{event.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-5">
              <h2 className="text-lg font-semibold text-white">
                Available actions
              </h2>
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
              <h2 className="text-lg font-semibold text-rose-100">
                Blocked actions
              </h2>
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
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-violet-300/30 bg-violet-300/10 p-6">
            <h2 className="text-lg font-semibold text-violet-100">
              Privacy boundary
            </h2>
            <p className="mt-3 text-sm leading-6 text-violet-50/80">
              Privacy baseline exists, but this case requires review before any
              claim of transfer readiness or legal derivation.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
            <h2 className="text-lg font-semibold text-white">Review notes</h2>
            <div className="mt-5 space-y-3">
              {notes.map((note) => (
                <div
                  key={`${note.author}-${note.scope}`}
                  className="rounded-2xl border border-slate-700/70 bg-[#102433] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {note.author}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {note.scope}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
