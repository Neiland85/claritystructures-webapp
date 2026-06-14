export function GovernanceDecisionCard() {
  return (
    <div className="rounded-3xl border border-slate-700/70 bg-[#0D1B26] p-6">
      <div className="flex flex-col gap-3 border-b border-slate-700/70 pb-5">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
          Governance decision
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Transfer and legal derivation are blocked
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          The system can persist, classify, audit and request review. It cannot
          generate an external transfer package while consent is missing and the
          context boundary remains unclear.
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
  );
}
