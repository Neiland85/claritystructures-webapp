type WizardProgressProps = {
  readonly phaseLabels: readonly string[];
  readonly phaseIndex: number;
  readonly ariaLabel: string;
  readonly completedLabel: string;
  readonly currentLabel: string;
};

export function WizardProgress({
  phaseLabels,
  phaseIndex,
  ariaLabel,
  completedLabel,
  currentLabel,
}: WizardProgressProps) {
  return (
    <>
      <nav aria-label={ariaLabel} className="sr-only">
        <ol>
          {phaseLabels.map((label, i) => (
            <li
              key={label}
              aria-current={i === phaseIndex ? "step" : undefined}
            >
              {label}{" "}
              {i < phaseIndex
                ? completedLabel
                : i === phaseIndex
                  ? currentLabel
                  : ""}
            </li>
          ))}
        </ol>
      </nav>

      <div
        aria-hidden="true"
        className="flex gap-1.5 sm:gap-2 max-w-3xl mx-auto mb-5 sm:mb-6 px-1 sm:px-2"
      >
        {phaseLabels.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= phaseIndex
                ? "bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </>
  );
}
