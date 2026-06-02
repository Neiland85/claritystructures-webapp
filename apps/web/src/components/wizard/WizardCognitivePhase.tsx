import type { ReactNode } from "react";
import { WizardNavigation } from "./WizardNavigation";
import { WizardAriaOption } from "./WizardAriaOption";

type NavigationDirection = "forward" | "back";
type ShockLevel = "low" | "medium" | "high";

type WizardCognitiveLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly qOmnipotence: string;
  readonly totalSurveillance: string;
  readonly restrictedTech: string;
  readonly qVerifiable: string;
  readonly materialProof: string;
  readonly circumstantial: string;
  readonly qDistortion: string;
  readonly clearNarrative: string;
  readonly confusionMemory: string;
  readonly qEmotionalDistress: string;
  readonly emotionalYes: string;
  readonly emotionalNo: string;
  readonly qShockLevel: string;
  readonly shockLow: string;
  readonly shockMedium: string;
  readonly shockHigh: string;
  readonly back: string;
  readonly next: string;
};

type WizardCognitivePhaseProps = {
  readonly navigationDirection: NavigationDirection;
  readonly perceivedOmnipotence: boolean | null;
  readonly isVerifiable: boolean | null;
  readonly distortionIndicator: boolean | null;
  readonly hasEmotionalDistress: boolean | null;
  readonly shockLevel: ShockLevel;
  readonly labels: WizardCognitiveLabels;
  readonly onPerceivedOmnipotenceChange: (value: boolean) => void;
  readonly onIsVerifiableChange: (value: boolean) => void;
  readonly onDistortionIndicatorChange: (value: boolean) => void;
  readonly onHasEmotionalDistressChange: (value: boolean) => void;
  readonly onShockLevelChange: (value: ShockLevel) => void;
  readonly onBack: () => void;
  readonly onNext: () => void;
};

type CognitiveRadioOptionProps = {
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly className: string;
  readonly children: ReactNode;
};

function CognitiveRadioOption({
  selected,
  onSelect,
  className,
  children,
}: CognitiveRadioOptionProps) {
  return (
    <WizardAriaOption
      type="button"
      role="radio"
      checked={selected}
      onClick={onSelect}
      className={className}
    >
      {children}
    </WizardAriaOption>
  );
}

export function WizardCognitivePhase({
  navigationDirection,
  perceivedOmnipotence,
  isVerifiable,
  distortionIndicator,
  hasEmotionalDistress,
  shockLevel,
  labels,
  onPerceivedOmnipotenceChange,
  onIsVerifiableChange,
  onDistortionIndicatorChange,
  onHasEmotionalDistressChange,
  onShockLevelChange,
  onBack,
  onNext,
}: WizardCognitivePhaseProps) {
  return (
    <div
      key="COGNITIVE"
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
          aria-labelledby="omnipotence-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="omnipotence-heading" className="text-sm text-white/70">
            {labels.qOmnipotence}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="omnipotence-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <CognitiveRadioOption
              selected={perceivedOmnipotence === true}
              onSelect={() => onPerceivedOmnipotenceChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${perceivedOmnipotence === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.totalSurveillance}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={perceivedOmnipotence === false}
              onSelect={() => onPerceivedOmnipotenceChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${perceivedOmnipotence === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.restrictedTech}
            </CognitiveRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="verifiable-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="verifiable-heading" className="text-sm text-white/70">
            {labels.qVerifiable}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="verifiable-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <CognitiveRadioOption
              selected={isVerifiable === true}
              onSelect={() => onIsVerifiableChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isVerifiable === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.materialProof}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={isVerifiable === false}
              onSelect={() => onIsVerifiableChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isVerifiable === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.circumstantial}
            </CognitiveRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="distortion-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="distortion-heading" className="text-sm text-white/70">
            {labels.qDistortion}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="distortion-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <CognitiveRadioOption
              selected={distortionIndicator === false}
              onSelect={() => onDistortionIndicatorChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${distortionIndicator === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.clearNarrative}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={distortionIndicator === true}
              onSelect={() => onDistortionIndicatorChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${distortionIndicator === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.confusionMemory}
            </CognitiveRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="emotional-distress-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="emotional-distress-heading" className="text-sm text-white/70">
            {labels.qEmotionalDistress}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="emotional-distress-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <CognitiveRadioOption
              selected={hasEmotionalDistress === true}
              onSelect={() => onHasEmotionalDistressChange(true)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasEmotionalDistress === true ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.emotionalYes}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={hasEmotionalDistress === false}
              onSelect={() => onHasEmotionalDistressChange(false)}
              className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasEmotionalDistress === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.emotionalNo}
            </CognitiveRadioOption>
          </div>
        </section>

        <section
          aria-labelledby="shock-level-heading"
          className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <h2 id="shock-level-heading" className="text-sm text-white/70">
            {labels.qShockLevel}
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="shock-level-heading"
            className="flex gap-2"
          >
            <CognitiveRadioOption
              selected={shockLevel === "low"}
              onSelect={() => onShockLevelChange("low")}
              className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "low" ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.shockLow}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={shockLevel === "medium"}
              onSelect={() => onShockLevelChange("medium")}
              className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "medium" ? "bg-white/20 text-white border-white/40" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.shockMedium}
            </CognitiveRadioOption>
            <CognitiveRadioOption
              selected={shockLevel === "high"}
              onSelect={() => onShockLevelChange("high")}
              className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "high" ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
            >
              {labels.shockHigh}
            </CognitiveRadioOption>
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
