import type { ClientProfile, UrgencyLevel } from "@claritystructures/domain";
import type { ReactNode } from "react";
import { WizardNavigation } from "./WizardNavigation";

type TriageOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

type WizardTriageLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly sectionProfile: string;
  readonly sectionUrgency: string;
  readonly physicalIntegrity: string;
  readonly financialAssets: string;
  readonly credentialAccess: string;
  readonly evidenceVolatility: string;
  readonly threatReal: string;
  readonly safeZone: string;
  readonly atRisk: string;
  readonly protected: string;
  readonly passwordsCompromised: string;
  readonly passwordsSafe: string;
  readonly autoDeleting: string;
  readonly evidenceStable: string;
  readonly next: string;
};

type WizardTriagePhaseProps = {
  readonly clientProfiles: readonly TriageOption<ClientProfile>[];
  readonly urgencyLevels: readonly TriageOption<UrgencyLevel>[];
  readonly clientProfile: ClientProfile | null;
  readonly urgency: UrgencyLevel | null;
  readonly physicalSafetyRisk: boolean | null;
  readonly financialAssetRisk: boolean | null;
  readonly attackerHasPasswords: boolean | null;
  readonly evidenceIsAutoDeleted: boolean | null;
  readonly labels: WizardTriageLabels;
  readonly onClientProfileChange: (value: ClientProfile) => void;
  readonly onUrgencyChange: (value: UrgencyLevel) => void;
  readonly onPhysicalSafetyRiskChange: (value: boolean) => void;
  readonly onFinancialAssetRiskChange: (value: boolean) => void;
  readonly onAttackerHasPasswordsChange: (value: boolean) => void;
  readonly onEvidenceIsAutoDeletedChange: (value: boolean) => void;
  readonly onNext: () => void;
  readonly nextDisabled: boolean;
};

type TriageRadioOptionProps = {
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly className: string;
  readonly children: ReactNode;
};

function TriageRadioOption({
  selected,
  onSelect,
  className,
  children,
}: TriageRadioOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected ? "true" : "false"}
      onClick={onSelect}
      className={className}
    >
      {children}
    </button>
  );
}

export function WizardTriagePhase({
  clientProfiles,
  urgencyLevels,
  clientProfile,
  urgency,
  physicalSafetyRisk,
  financialAssetRisk,
  attackerHasPasswords,
  evidenceIsAutoDeleted,
  labels,
  onClientProfileChange,
  onUrgencyChange,
  onPhysicalSafetyRiskChange,
  onFinancialAssetRiskChange,
  onAttackerHasPasswordsChange,
  onEvidenceIsAutoDeletedChange,
  onNext,
  nextDisabled,
}: WizardTriagePhaseProps) {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="space-y-3 border-b border-white/10 pb-6">
        <h1 className="text-[2rem] sm:text-3xl md:text-4xl font-light tracking-tight text-white/95 leading-tight">
          {labels.title}
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
          {labels.subtitle}
        </p>
      </header>

      <section aria-labelledby="client-profile-heading" className="space-y-4">
        <h2
          id="client-profile-heading"
          className="text-xs uppercase tracking-widest text-white/30 font-semibold"
        >
          {labels.sectionProfile}
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="client-profile-heading"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {clientProfiles.map((opt) => (
            <TriageRadioOption
              key={opt.value}
              selected={clientProfile === opt.value}
              onSelect={() => onClientProfileChange(opt.value)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                clientProfile === opt.value
                  ? "bg-white/15 border-white/50 ring-1 ring-white/30 shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                  : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07]"
              }`}
            >
              <div className="font-medium text-sm text-white/80">
                {opt.label}
              </div>
            </TriageRadioOption>
          ))}
        </div>
      </section>

      <section aria-labelledby="urgency-heading" className="space-y-4">
        <h2
          id="urgency-heading"
          className="text-xs uppercase tracking-widest text-white/30 font-semibold"
        >
          {labels.sectionUrgency}
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="urgency-heading"
          className="flex flex-wrap gap-2"
        >
          {urgencyLevels.map((opt) => (
            <TriageRadioOption
              key={opt.value}
              selected={urgency === opt.value}
              onSelect={() => onUrgencyChange(opt.value)}
              className={`px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                urgency === opt.value
                  ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                  : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07] text-white/60"
              }`}
            >
              {opt.label}
            </TriageRadioOption>
          ))}
        </div>
      </section>

      <section
        aria-label={labels.physicalIntegrity}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10"
      >
        <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <legend className="text-xs text-white/40 text-center block">
            {labels.physicalIntegrity}
          </legend>
          <div
            role="radiogroup"
            aria-label={labels.physicalIntegrity}
            className="flex gap-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={physicalSafetyRisk === true ? "true" : "false"}
              onClick={() => onPhysicalSafetyRiskChange(true)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.threatReal}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={physicalSafetyRisk === false ? "true" : "false"}
              onClick={() => onPhysicalSafetyRiskChange(false)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.safeZone}
            </button>
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <legend className="text-xs text-white/40 text-center block">
            {labels.financialAssets}
          </legend>
          <div
            role="radiogroup"
            aria-label={labels.financialAssets}
            className="flex gap-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={financialAssetRisk === true ? "true" : "false"}
              onClick={() => onFinancialAssetRiskChange(true)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === true ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.atRisk}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={financialAssetRisk === false ? "true" : "false"}
              onClick={() => onFinancialAssetRiskChange(false)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.protected}
            </button>
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <legend className="text-xs text-white/40 text-center block">
            {labels.credentialAccess}
          </legend>
          <div
            role="radiogroup"
            aria-label={labels.credentialAccess}
            className="flex gap-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={attackerHasPasswords === true ? "true" : "false"}
              onClick={() => onAttackerHasPasswordsChange(true)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.passwordsCompromised}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={attackerHasPasswords === false ? "true" : "false"}
              onClick={() => onAttackerHasPasswordsChange(false)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.passwordsSafe}
            </button>
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <legend className="text-xs text-white/40 text-center block">
            {labels.evidenceVolatility}
          </legend>
          <div
            role="radiogroup"
            aria-label={labels.evidenceVolatility}
            className="flex gap-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={evidenceIsAutoDeleted === true ? "true" : "false"}
              onClick={() => onEvidenceIsAutoDeletedChange(true)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.autoDeleting}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={evidenceIsAutoDeleted === false ? "true" : "false"}
              onClick={() => onEvidenceIsAutoDeletedChange(false)}
              className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {labels.evidenceStable}
            </button>
          </div>
        </fieldset>
      </section>

      <WizardNavigation
        primaryLabel={labels.next}
        onPrimary={onNext}
        primaryDisabled={nextDisabled}
        variant="triage"
      />
    </div>
  );
}
