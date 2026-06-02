import type { ReactNode } from "react";
import { WizardNavigation } from "./WizardNavigation";

type NavigationDirection = "forward" | "back";
type DataSensitivityLevel = "low" | "medium" | "high";
type EstimatedIncidentStart = "unknown" | "recent" | "weeks" | "months";

type ContextOption<T extends string> = {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
};

type WizardContextLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly qOngoing: string;
  readonly activeNow: string;
  readonly finished: string;
  readonly qStart: string;
  readonly qSensitivity: string;
  readonly qDeviceAccess: string;
  readonly hasAccess: string;
  readonly noAccess: string;
  readonly qThirdParties: string;
  readonly yesThirdParties: string;
  readonly noOnlyMe: string;
  readonly back: string;
  readonly next: string;
};

type WizardContextPhaseProps = {
  readonly navigationDirection: NavigationDirection;
  readonly estimatedIncidentStarts: readonly ContextOption<EstimatedIncidentStart>[];
  readonly dataSensitivityLevels: readonly ContextOption<DataSensitivityLevel>[];
  readonly isOngoing: boolean | null;
  readonly estimatedIncidentStart: EstimatedIncidentStart | null;
  readonly dataSensitivityLevel: DataSensitivityLevel | null;
  readonly hasAccessToDevices: boolean | null;
  readonly thirdPartiesInvolved: boolean | null;
  readonly labels: WizardContextLabels;
  readonly onIsOngoingChange: (value: boolean) => void;
  readonly onEstimatedIncidentStartChange: (
    value: EstimatedIncidentStart,
  ) => void;
  readonly onDataSensitivityLevelChange: (value: DataSensitivityLevel) => void;
  readonly onHasAccessToDevicesChange: (value: boolean) => void;
  readonly onThirdPartiesInvolvedChange: (value: boolean) => void;
  readonly onBack: () => void;
  readonly onNext: () => void;
};

type ContextRadioOptionProps = {
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly className: string;
  readonly children: ReactNode;
};

function ContextRadioOption({
  selected,
  onSelect,
  className,
  children,
}: ContextRadioOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={className}
    >
      {children}
    </button>
  );
}

export function WizardContextPhase({
  navigationDirection,
  estimatedIncidentStarts,
  dataSensitivityLevels,
  isOngoing,
  estimatedIncidentStart,
  dataSensitivityLevel,
  hasAccessToDevices,
  thirdPartiesInvolved,
  labels,
  onIsOngoingChange,
  onEstimatedIncidentStartChange,
  onDataSensitivityLevelChange,
  onHasAccessToDevicesChange,
  onThirdPartiesInvolvedChange,
  onBack,
  onNext,
}: WizardContextPhaseProps) {
  return (
    <div
      key="CONTEXT"
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
          aria-labelledby="ongoing-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="ongoing-heading" className="text-sm text-white/70">
            {labels.qOngoing}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="ongoing-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <ContextRadioOption
              selected={isOngoing === true}
              onSelect={() => onIsOngoingChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isOngoing === true ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.activeNow}
            </ContextRadioOption>
            <ContextRadioOption
              selected={isOngoing === false}
              onSelect={() => onIsOngoingChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isOngoing === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.finished}
            </ContextRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="incident-start-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="incident-start-heading" className="text-sm text-white/70">
            {labels.qStart}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="incident-start-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {estimatedIncidentStarts.map((opt) => (
              <ContextRadioOption
                key={opt.value}
                selected={estimatedIncidentStart === opt.value}
                onSelect={() => onEstimatedIncidentStartChange(opt.value)}
                className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${estimatedIncidentStart === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                {opt.label.toUpperCase()}
              </ContextRadioOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="sensitivity-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="sensitivity-heading" className="text-sm text-white/70">
            {labels.qSensitivity}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="sensitivity-heading"
            className="flex gap-2"
          >
            {dataSensitivityLevels.map((opt) => (
              <ContextRadioOption
                key={opt.value}
                selected={dataSensitivityLevel === opt.value}
                onSelect={() => onDataSensitivityLevelChange(opt.value)}
                className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${dataSensitivityLevel === opt.value ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.18)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
              >
                <div className="font-medium">{opt.label.toUpperCase()}</div>
                <div className="text-[10px] mt-0.5 opacity-60">
                  {opt.description}
                </div>
              </ContextRadioOption>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="device-access-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="device-access-heading" className="text-sm text-white/70">
            {labels.qDeviceAccess}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="device-access-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <ContextRadioOption
              selected={hasAccessToDevices === true}
              onSelect={() => onHasAccessToDevicesChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasAccessToDevices === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.hasAccess}
            </ContextRadioOption>
            <ContextRadioOption
              selected={hasAccessToDevices === false}
              onSelect={() => onHasAccessToDevicesChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasAccessToDevices === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.noAccess}
            </ContextRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="third-parties-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="third-parties-heading" className="text-sm text-white/70">
            {labels.qThirdParties}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="third-parties-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <ContextRadioOption
              selected={thirdPartiesInvolved === true}
              onSelect={() => onThirdPartiesInvolvedChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${thirdPartiesInvolved === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.yesThirdParties}
            </ContextRadioOption>
            <ContextRadioOption
              selected={thirdPartiesInvolved === false}
              onSelect={() => onThirdPartiesInvolvedChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${thirdPartiesInvolved === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.noOnlyMe}
            </ContextRadioOption>
          </div>
        </section>

        <WizardNavigation
          backLabel={labels.back}
          onBack={onBack}
          primaryLabel={labels.next}
          onPrimary={onNext}
        />
      </div>
    </div>
  );
}
