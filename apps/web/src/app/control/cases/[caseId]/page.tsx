import {
  ActionsPanel,
  AssuranceTrail,
  ControlRoomHeader,
  getControlRoomViewModel,
  GovernanceDecisionCard,
  PrivacyBoundaryCard,
  ReadinessRadar,
  ReviewNotesPanel,
} from "@/features/control-room";

type ControlCasePageProps = {
  params: Promise<{
    caseId: string;
  }>;
};

export default async function ControlCasePage({
  params,
}: ControlCasePageProps) {
  const { caseId } = await params;
  const { viewModel, source } = await getControlRoomViewModel(caseId);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-2xl shadow-cyan-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Dynamic governed case route
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            /control/cases/{caseId}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            This route is wired through getControlRoomViewModel(caseId), an
            internal resolver that currently returns the governed case-file
            fixture chain. It prepares the product path for real governed case
            loading without adding a database, API route, persistence, or Prisma
            migration. Current source: {source}.
          </p>
        </section>

        <ControlRoomHeader viewModel={viewModel} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ReadinessRadar items={viewModel.readiness} />
          <GovernanceDecisionCard decision={viewModel.governanceDecision} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ActionsPanel
            allowedActions={viewModel.allowedActions}
            blockedActions={viewModel.blockedActions}
          />
          <AssuranceTrail events={viewModel.assuranceTrail} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <PrivacyBoundaryCard
            title={viewModel.privacyBoundary.title}
            text={viewModel.privacyBoundary.text}
          />
          <ReviewNotesPanel notes={viewModel.reviewNotes} />
        </div>
      </div>
    </main>
  );
}
