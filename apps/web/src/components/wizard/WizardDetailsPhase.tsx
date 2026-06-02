import { WizardAriaOption } from "./WizardAriaOption";
import { WizardNavigation } from "./WizardNavigation";

type NavigationDirection = "forward" | "back";

type DetailsOption<T extends string | number> = {
  readonly value: T;
  readonly label: string;
};

type WizardDetailsLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly qIncident: string;
  readonly qDevices: string;
  readonly qEvidenceSources: string;
  readonly qActionsTaken: string;
  readonly qObjective: string;
  readonly back: string;
  readonly submit: string;
  readonly submitting: string;
};

type WizardDetailsPhaseProps = {
  readonly navigationDirection: NavigationDirection;
  readonly incidentTypes: readonly DetailsOption<string>[];
  readonly deviceCounts: readonly DetailsOption<number>[];
  readonly evidenceSourceOptions: readonly DetailsOption<string>[];
  readonly actionTakenOptions: readonly DetailsOption<string>[];
  readonly objectiveOptions: readonly DetailsOption<string>[];
  readonly incident: string | null;
  readonly devices: number | null;
  readonly evidenceSources: readonly string[];
  readonly actionsTaken: readonly string[];
  readonly objective: string | null;
  readonly isSubmitting: boolean;
  readonly labels: WizardDetailsLabels;
  readonly onIncidentChange: (value: string) => void;
  readonly onDevicesChange: (value: number) => void;
  readonly onEvidenceSourceToggle: (value: string) => void;
  readonly onActionTakenToggle: (value: string) => void;
  readonly onObjectiveChange: (value: string) => void;
  readonly onBack: () => void;
  readonly onSubmit: () => void;
};

export function WizardDetailsPhase({
  navigationDirection,
  incidentTypes,
  deviceCounts,
  evidenceSourceOptions,
  actionTakenOptions,
  objectiveOptions,
  incident,
  devices,
  evidenceSources,
  actionsTaken,
  objective,
  isSubmitting,
  labels,
  onIncidentChange,
  onDevicesChange,
  onEvidenceSourceToggle,
  onActionTakenToggle,
  onObjectiveChange,
  onBack,
  onSubmit,
}: WizardDetailsPhaseProps) {
  return (
    <div
      key="DETAILS"
      className={`space-y-8 md:space-y-10 ${navigationDirection === "forward" ? "slide-in-right" : "slide-in-left"}`}
    >
      <header className="space-y-3 border-b border-white/10 pb-6">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/95">
          {labels.title}
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
          {labels.subtitle}
        </p>
      </header>

      <div className="space-y-8">
        <section
          aria-labelledby="incident-type-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="incident-type-heading" className="text-sm text-white/70">
            {labels.qIncident}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="incident-type-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {incidentTypes.map((opt) => (
              <WizardAriaOption
                key={opt.value}
                role="radio"
                checked={incident === opt.value}
                onClick={() => onIncidentChange(opt.value)}
                className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${incident === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label}
              </WizardAriaOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="device-count-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="device-count-heading" className="text-sm text-white/70">
            {labels.qDevices}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="device-count-heading"
            className="flex gap-2"
          >
            {deviceCounts.map((opt) => (
              <WizardAriaOption
                key={opt.value}
                role="radio"
                checked={devices === opt.value}
                onClick={() => onDevicesChange(opt.value)}
                className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${devices === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label}
              </WizardAriaOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="evidence-sources-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="evidence-sources-heading" className="text-sm text-white/70">
            {labels.qEvidenceSources}
          </h2>
          <div
            role="group"
            aria-labelledby="evidence-sources-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {evidenceSourceOptions.map((opt) => (
              <WizardAriaOption
                key={opt.value}
                role="checkbox"
                checked={evidenceSources.includes(opt.value)}
                onClick={() => onEvidenceSourceToggle(opt.value)}
                className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${evidenceSources.includes(opt.value) ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label}
              </WizardAriaOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="actions-taken-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="actions-taken-heading" className="text-sm text-white/70">
            {labels.qActionsTaken}
          </h2>
          <div
            role="group"
            aria-labelledby="actions-taken-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {actionTakenOptions.map((opt) => (
              <WizardAriaOption
                key={opt.value}
                role="checkbox"
                checked={actionsTaken.includes(opt.value)}
                onClick={() => onActionTakenToggle(opt.value)}
                className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${actionsTaken.includes(opt.value) ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label}
              </WizardAriaOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="objective-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="objective-heading" className="text-sm text-white/70">
            {labels.qObjective}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="objective-heading"
            className="grid grid-cols-1 gap-3"
          >
            {objectiveOptions.map((opt) => (
              <WizardAriaOption
                key={opt.value}
                role="radio"
                checked={objective === opt.value}
                onClick={() => onObjectiveChange(opt.value)}
                className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${objective === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label}
              </WizardAriaOption>
            ))}
          </div>
        </section>

        <WizardNavigation
          backLabel={labels.back}
          onBack={onBack}
          primaryLabel={isSubmitting ? labels.submitting : labels.submit}
          onPrimary={onSubmit}
          primaryDisabled={isSubmitting || !incident || !objective}
          variant="submit"
        />
      </div>
    </div>
  );
}
