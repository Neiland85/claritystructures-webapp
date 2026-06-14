import { ActionsPanel } from "./_components/actions-panel";
import { AssuranceTrail } from "./_components/assurance-trail";
import { ControlRoomHeader } from "./_components/control-room-header";
import { GovernanceDecisionCard } from "./_components/governance-decision-card";
import { PrivacyBoundaryCard } from "./_components/privacy-boundary-card";
import { ReadinessRadar } from "./_components/readiness-radar";
import { ReviewNotesPanel } from "./_components/review-notes-panel";

export default function ControlRoomDemoPage() {
  return (
    <main className="min-h-screen bg-[#071018] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <ControlRoomHeader />

        <section className="grid gap-6 lg:grid-cols-[280px_1fr_330px]">
          <ReadinessRadar />

          <section className="flex flex-col gap-6">
            <GovernanceDecisionCard />
            <AssuranceTrail />
          </section>

          <ActionsPanel />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PrivacyBoundaryCard />
          <ReviewNotesPanel />
        </section>
      </div>
    </main>
  );
}
