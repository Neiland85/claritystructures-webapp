import type { ReactNode } from "react";

type WizardNavigationVariant = "triage" | "phase" | "submit";

type WizardNavigationProps = {
  readonly backLabel?: ReactNode;
  readonly onBack?: () => void;
  readonly primaryLabel: ReactNode;
  readonly onPrimary: () => void;
  readonly primaryDisabled?: boolean;
  readonly variant?: WizardNavigationVariant;
};

export function WizardNavigation({
  backLabel,
  onBack,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  variant = "phase",
}: WizardNavigationProps) {
  const primaryClassName =
    variant === "phase"
      ? "flex-[2] py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all duration-200 text-sm shadow-[0_0_30px_rgba(255,255,255,0.16)]"
      : variant === "submit"
        ? `flex-2 py-4 rounded-xl font-bold transition-all text-sm shadow-lg shadow-white/5 ${
            primaryDisabled
              ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              : "bg-white text-black hover:bg-neutral-200"
          }`
        : `w-full py-4 rounded-xl font-semibold transition-all ${
            primaryDisabled
              ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              : "bg-white text-black hover:bg-neutral-200"
          }`;

  const primaryButton = (
    <button
      onClick={onPrimary}
      disabled={primaryDisabled}
      aria-disabled={primaryDisabled}
      className={primaryClassName}
    >
      {primaryLabel}
    </button>
  );

  if (!backLabel || !onBack) {
    return primaryButton;
  }

  return (
    <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        onClick={onBack}
        className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 text-sm"
      >
        {backLabel}
      </button>
      {primaryButton}
    </div>
  );
}
