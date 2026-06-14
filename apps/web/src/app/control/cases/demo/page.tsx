import { ActionsPanel } from "./_components/actions-panel";
import { AssuranceTrail } from "./_components/assurance-trail";
import { controlRoomDemoViewModel } from "./_components/control-room-demo-data";
import { ControlRoomHeader } from "./_components/control-room-header";
import { GovernanceDecisionCard } from "./_components/governance-decision-card";
import { PrivacyBoundaryCard } from "./_components/privacy-boundary-card";
import { ReadinessRadar } from "./_components/readiness-radar";
import { ReviewNotesPanel } from "./_components/review-notes-panel";

export default function ControlRoomDemoPage() {
  const viewModel = controlRoomDemoViewModel;

  return (
    <main className="min-h-screen bg-[#071018] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <ControlRoomHeader viewModel={viewModel} />

        <section className="grid gap-6 lg:grid-cols-[280px_1fr_330px]">
          <ReadinessRadar items={viewModel.readiness} />

          <section className="flex flex-col gap-6">
            <GovernanceDecisionCard decision={viewModel.governanceDecision} />
            <AssuranceTrail events={viewModel.assuranceTrail} />
          </section>

          <ActionsPanel
            allowedActions={viewModel.allowedActions}
            blockedActions={viewModel.blockedActions}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PrivacyBoundaryCard
            title={viewModel.privacyBoundary.title}
            text={viewModel.privacyBoundary.text}
          />
          <ReviewNotesPanel notes={viewModel.reviewNotes} />
        </section>
      </div>
    </main>
  );
}
