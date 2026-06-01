import type { ReactNode } from "react";
import AnimatedLogo from "../AnimatedLogo";
import LanguageSwitcher from "../LanguageSwitcher";
import { WizardProgress } from "./WizardProgress";

type WizardPhaseShellProps = {
  readonly phaseLabels: readonly string[];
  readonly phaseIndex: number;
  readonly ariaFormProgressLabel: string;
  readonly completedLabel: string;
  readonly currentLabel: string;
  readonly stepLabel: string;
  readonly ofLabel: string;
  readonly children: ReactNode;
};

export function WizardPhaseShell({
  phaseLabels,
  phaseIndex,
  ariaFormProgressLabel,
  completedLabel,
  currentLabel,
  stepLabel,
  ofLabel,
  children,
}: WizardPhaseShellProps) {
  return (
    <div className="relative min-h-[760px] w-full max-w-5xl mx-auto dark px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-10">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 p-1.5 sm:p-2 z-50 flex origin-top-right scale-90 sm:scale-100 items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-black/20 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <LanguageSwitcher />
        <AnimatedLogo />
      </div>

      <WizardProgress
        phaseLabels={phaseLabels}
        phaseIndex={phaseIndex}
        ariaLabel={ariaFormProgressLabel}
        completedLabel={completedLabel}
        currentLabel={currentLabel}
      />

      <div
        className="glass relative overflow-hidden p-5 sm:p-6 md:p-12 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] animate-in backdrop-blur-3xl max-w-3xl mx-auto"
        role="region"
        aria-label={`${stepLabel} ${phaseIndex + 1} ${ofLabel} ${phaseLabels.length}: ${phaseLabels[phaseIndex]}`}
      >
        {children}
      </div>
    </div>
  );
}
