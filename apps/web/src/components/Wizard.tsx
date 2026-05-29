"use client";

import { useLang } from "@/components/LanguageProvider";
import {
  getActionsTaken,
  getClientProfiles,
  getDataSensitivityLevels,
  getDeviceCounts,
  getEstimatedIncidentStarts,
  getEvidenceSources,
  getIncidentTypes,
  getObjectives,
  getUrgencyLevels,
} from "@/constants/wizardOptions";
import { useWizardContractContext } from "@/hooks/wizard/useWizardContractContext";
import { useTranslation } from "@/i18n/useTranslation";
import { wizardDict } from "@/i18n/wizard";
import { trackEvent } from "@/lib/analytics";
import type {
  ClientProfile,
  UrgencyLevel,
  WizardResult,
} from "@claritystructures/domain";
import { decideIntake } from "@claritystructures/domain";
import { type ReactNode, useEffect, useReducer, useRef, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  onComplete: (data: WizardResult) => void;
};

type Phase = "TRIAGE" | "COGNITIVE" | "CONTEXT" | "DETAILS";

type WizardState = {
  phase: Phase;
  clientProfile: ClientProfile | null;
  urgency: UrgencyLevel | null;
  hasEmotionalDistress: boolean | null;
  physicalSafetyRisk: boolean | null;
  financialAssetRisk: boolean | null;
  attackerHasPasswords: boolean | null;
  evidenceIsAutoDeleted: boolean | null;
  perceivedOmnipotence: boolean | null;
  isVerifiable: boolean | null;
  distortionIndicator: boolean | null;
  shockLevel: "low" | "medium" | "high";
  // V2 context signals
  isOngoing: boolean | null;
  hasAccessToDevices: boolean | null;
  dataSensitivityLevel: "low" | "medium" | "high" | null;
  estimatedIncidentStart: "unknown" | "recent" | "weeks" | "months" | null;
  thirdPartiesInvolved: boolean | null;
  // DETAILS phase fields (fed into decision engine)
  incident: string | null;
  devices: number | null;
  evidenceSources: string[];
  actionsTaken: string[];
  objective: string | null;
};

type WizardFieldUpdateAction<K extends keyof WizardState = keyof WizardState> =
  {
    type: "UPDATE_FIELD";
    field: K;
    value: WizardState[K];
  };

type WizardAction =
  | { type: "SET_PHASE"; payload: Phase }
  | WizardFieldUpdateAction;

const initialState: WizardState = {
  phase: "TRIAGE",
  clientProfile: null,
  urgency: null,
  hasEmotionalDistress: null,
  physicalSafetyRisk: null,
  financialAssetRisk: null,
  attackerHasPasswords: null,
  evidenceIsAutoDeleted: null,
  perceivedOmnipotence: null,
  isVerifiable: null,
  distortionIndicator: null,
  shockLevel: "low",
  // V2 context signals
  isOngoing: null,
  hasAccessToDevices: null,
  dataSensitivityLevel: null,
  estimatedIncidentStart: null,
  thirdPartiesInvolved: null,
  // DETAILS phase fields
  incident: null,
  devices: null,
  evidenceSources: [],
  actionsTaken: [],
  objective: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.payload };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

type WizardRadioOptionProps = {
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly className: string;
  readonly children: ReactNode;
};

function WizardRadioOption({
  selected,
  onSelect,
  className,
  children,
}: WizardRadioOptionProps) {
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

export default function Wizard({ onComplete }: Props) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const t = useTranslation(wizardDict);
  const lang = useLang();

  const clientProfiles = getClientProfiles(lang);
  const urgencyLevels = getUrgencyLevels(lang);
  const dataSensitivityLevels = getDataSensitivityLevels(lang);
  const estimatedIncidentStarts = getEstimatedIncidentStarts(lang);
  const incidentTypes = getIncidentTypes(lang);
  const deviceCounts = getDeviceCounts(lang);
  const evidenceSourceOptions = getEvidenceSources(lang);
  const actionTakenOptions = getActionsTaken(lang);
  const objectiveOptions = getObjectives(lang);

  const {
    phase,
    clientProfile,
    urgency,
    hasEmotionalDistress,
    physicalSafetyRisk,
    financialAssetRisk,
    attackerHasPasswords,
    evidenceIsAutoDeleted,
    perceivedOmnipotence,
    isVerifiable,
    distortionIndicator,
    shockLevel,
    isOngoing,
    hasAccessToDevices,
    dataSensitivityLevel,
    estimatedIncidentStart,
    thirdPartiesInvolved,
    incident,
    devices,
    evidenceSources,
    actionsTaken,
    objective,
  } = state;

  const isStep1Complete = clientProfile && urgency;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigationDirection = useRef<"forward" | "back">("forward");

  const contractContext = useWizardContractContext({
    clientProfile,
    urgency,
    hasEmotionalDistress,
    physicalSafetyRisk,
    financialAssetRisk,
    attackerHasPasswords,
    evidenceIsAutoDeleted,
    perceivedOmnipotence,
    isVerifiable,
    distortionIndicator,
    shockLevel,
    isOngoing,
    hasAccessToDevices,
    dataSensitivityLevel,
    estimatedIncidentStart,
    thirdPartiesInvolved,
    incident,
    devices: devices === null ? [] : [String(devices)],
    evidenceSources,
    actionsTaken,
    objective,
  });

  useEffect(() => {
    trackEvent({
      name: "wizard.step_view",
      timestamp: Date.now(),
      payload: { phase },
    });
  }, [phase]);

  function navigateTo(targetPhase: Phase, direction: "forward" | "back") {
    navigationDirection.current = direction;
    dispatch({ type: "SET_PHASE", payload: targetPhase });
  }

  function updateField<K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  function toggleArrayField(
    field: "evidenceSources" | "actionsTaken",
    value: string,
  ) {
    const current = state[field] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    dispatch({ type: "UPDATE_FIELD", field, value: next });
  }

  function submit() {
    if (!clientProfile || !urgency) return;
    setIsSubmitting(true);

    const severityScore =
      (urgency === "critical" ? 40 : 0) +
      (physicalSafetyRisk ? 30 : 0) +
      (financialAssetRisk ? 15 : 0) +
      (attackerHasPasswords ? 10 : 0) +
      (evidenceIsAutoDeleted ? 5 : 0);

    trackEvent({
      name: "wizard.step_submit",
      timestamp: Date.now(),
      payload: {
        phase,
        severityScore,
        contractSignalCount: contractContext.signals.length,
        contractSnippetCount: contractContext.snippets.length,
        hasLegalDerivationSignal: contractContext.hasLegalDerivationSignal,
        hasEvidenceVolatilitySignal:
          contractContext.hasEvidenceVolatilitySignal,
        hasCredentialCompromiseSignal:
          contractContext.hasCredentialCompromiseSignal,
        hasPhysicalSafetySignal: contractContext.hasPhysicalSafetySignal,
        hasSensitivePrivacySignal: contractContext.hasSensitivePrivacySignal,
      },
    });

    trackEvent({
      name: "wizard.risk_classified",
      timestamp: Date.now(),
      payload: {
        severityScore,
        critical: severityScore >= 70,
      },
    });

    const result: WizardResult = {
      clientProfile,
      urgency,
      hasEmotionalDistress: hasEmotionalDistress ?? false,
      physicalSafetyRisk: physicalSafetyRisk ?? false,
      financialAssetRisk: financialAssetRisk ?? false,
      attackerHasPasswords: attackerHasPasswords ?? false,
      evidenceIsAutoDeleted: evidenceIsAutoDeleted ?? false,
      cognitiveProfile: {
        coherenceScore: distortionIndicator ? 2 : 5,
        cognitiveDistortion: distortionIndicator ?? false,
        perceivedOmnipotenceOfAttacker: perceivedOmnipotence ?? false,
        isInformationVerifiable: isVerifiable ?? true,
        emotionalShockLevel: shockLevel,
      },
      incident: incident ?? "unspecified",
      devices: devices ?? 0,
      actionsTaken: actionsTaken,
      evidenceSources: evidenceSources,
      objective: objective ?? "document",
      // V2 context signals (only included when answered)
      ...(isOngoing !== null && { isOngoing }),
      ...(hasAccessToDevices !== null && { hasAccessToDevices }),
      ...(dataSensitivityLevel !== null && { dataSensitivityLevel }),
      ...(estimatedIncidentStart !== null && { estimatedIncidentStart }),
      ...(thirdPartiesInvolved !== null && { thirdPartiesInvolved }),
    };

    trackEvent({
      name: "wizard.completed",
      timestamp: Date.now(),
      payload: {
        tone: result.urgency,
        priority: decideIntake(result).priority,
      },
    });

    onComplete(result);
  }

  const phaseIndex =
    phase === "TRIAGE"
      ? 0
      : phase === "COGNITIVE"
        ? 1
        : phase === "CONTEXT"
          ? 2
          : 3;
  const phaseLabels = [
    t("phase_triage"),
    t("phase_cognitive"),
    t("phase_context"),
    t("phase_details"),
  ];

  return (
    <div className="relative min-h-[760px] w-full max-w-5xl mx-auto dark px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-10">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 p-1.5 sm:p-2 z-50 flex origin-top-right scale-90 sm:scale-100 items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-black/20 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <LanguageSwitcher />
        <AnimatedLogo />
      </div>

      <nav aria-label={t("aria_form_progress")} className="sr-only">
        <ol>
          {phaseLabels.map((label, i) => (
            <li
              key={label}
              aria-current={i === phaseIndex ? "step" : undefined}
            >
              {label}{" "}
              {i < phaseIndex
                ? t("completed")
                : i === phaseIndex
                  ? t("current")
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

      <div
        className="glass relative overflow-hidden p-5 sm:p-6 md:p-12 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] animate-in backdrop-blur-3xl max-w-3xl mx-auto"
        role="region"
        aria-label={`${t("step")} ${phaseIndex + 1} ${t("of")} ${phaseLabels.length}: ${phaseLabels[phaseIndex]}`}
      >
        {phase === "TRIAGE" && (
          <div className="space-y-6 md:space-y-10">
            <header className="space-y-3 border-b border-white/10 pb-6">
              <h1 className="text-[2rem] sm:text-3xl md:text-4xl font-light tracking-tight text-white/95 leading-tight">
                {t("triage_title")}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
                {t("triage_subtitle")}
              </p>
            </header>

            <section
              aria-labelledby="client-profile-heading"
              className="space-y-4"
            >
              <h2
                id="client-profile-heading"
                className="text-xs uppercase tracking-widest text-white/30 font-semibold"
              >
                {t("triage_section_profile")}
              </h2>
              <div
                role="radiogroup"
                aria-labelledby="client-profile-heading"
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {clientProfiles.map((opt) => (
                  <WizardRadioOption
                    key={opt.value}
                    selected={clientProfile === opt.value}
                    onSelect={() => updateField("clientProfile", opt.value)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                      clientProfile === opt.value
                        ? "bg-white/15 border-white/50 ring-1 ring-white/30 shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                        : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="font-medium text-sm text-white/80">
                      {opt.label}
                    </div>
                  </WizardRadioOption>
                ))}
              </div>
            </section>

            <section aria-labelledby="urgency-heading" className="space-y-4">
              <h2
                id="urgency-heading"
                className="text-xs uppercase tracking-widest text-white/30 font-semibold"
              >
                {t("triage_section_urgency")}
              </h2>
              <div
                role="radiogroup"
                aria-labelledby="urgency-heading"
                className="flex flex-wrap gap-2"
              >
                {urgencyLevels.map((opt) => (
                  <WizardRadioOption
                    key={opt.value}
                    selected={urgency === opt.value}
                    onSelect={() => updateField("urgency", opt.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 ${
                      urgency === opt.value
                        ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                        : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07] text-white/60"
                    }`}
                  >
                    {opt.label}
                  </WizardRadioOption>
                ))}
              </div>
            </section>

            <section
              aria-label={t("triage_physical_integrity")}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10"
            >
              <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <legend className="text-xs text-white/40 text-center block">
                  {t("triage_physical_integrity")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("triage_physical_integrity")}
                  className="flex gap-2"
                >
                  <button
                    role="radio"
                    aria-checked={
                      physicalSafetyRisk === true ? "true" : "false"
                    }
                    onClick={() => updateField("physicalSafetyRisk", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_threat_real")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      physicalSafetyRisk === false ? "true" : "false"
                    }
                    onClick={() => updateField("physicalSafetyRisk", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_safe_zone")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <legend className="text-xs text-white/40 text-center block">
                  {t("triage_financial_assets")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("triage_financial_assets")}
                  className="flex gap-2"
                >
                  <button
                    role="radio"
                    aria-checked={
                      financialAssetRisk === true ? "true" : "false"
                    }
                    onClick={() => updateField("financialAssetRisk", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === true ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_at_risk")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      financialAssetRisk === false ? "true" : "false"
                    }
                    onClick={() => updateField("financialAssetRisk", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_protected")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <legend className="text-xs text-white/40 text-center block">
                  {t("triage_credential_access")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("triage_credential_access")}
                  className="flex gap-2"
                >
                  <button
                    role="radio"
                    aria-checked={
                      attackerHasPasswords === true ? "true" : "false"
                    }
                    onClick={() => updateField("attackerHasPasswords", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_passwords_compromised")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      attackerHasPasswords === false ? "true" : "false"
                    }
                    onClick={() => updateField("attackerHasPasswords", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_passwords_safe")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <legend className="text-xs text-white/40 text-center block">
                  {t("triage_evidence_volatility")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("triage_evidence_volatility")}
                  className="flex gap-2"
                >
                  <button
                    role="radio"
                    aria-checked={
                      evidenceIsAutoDeleted === true ? "true" : "false"
                    }
                    onClick={() => updateField("evidenceIsAutoDeleted", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_auto_deleting")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      evidenceIsAutoDeleted === false ? "true" : "false"
                    }
                    onClick={() => updateField("evidenceIsAutoDeleted", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_evidence_stable")}
                  </button>
                </div>
              </fieldset>
            </section>

            <button
              onClick={() => navigateTo("COGNITIVE", "forward")}
              disabled={!isStep1Complete}
              aria-disabled={!isStep1Complete}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                isStep1Complete
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              {t("triage_next")}
            </button>
          </div>
        )}

        {phase === "COGNITIVE" && (
          <div
            key="COGNITIVE"
            className={`space-y-8 md:space-y-10 ${navigationDirection.current === "forward" ? "slide-in-right" : "slide-in-left"}`}
          >
            <header className="space-y-3 border-b border-white/10 pb-6">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/95">
                {t("cognitive_title")}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
                {t("cognitive_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section
                aria-labelledby="omnipotence-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="omnipotence-heading" className="text-sm text-white/70">
                  {t("cognitive_q_omnipotence")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="omnipotence-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <WizardRadioOption
                    selected={perceivedOmnipotence === true}
                    onSelect={() => updateField("perceivedOmnipotence", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${perceivedOmnipotence === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_total_surveillance")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={perceivedOmnipotence === false}
                    onSelect={() => updateField("perceivedOmnipotence", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${perceivedOmnipotence === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_restricted_tech")}
                  </WizardRadioOption>
                </div>
              </section>

              <section
                aria-labelledby="verifiable-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="verifiable-heading" className="text-sm text-white/70">
                  {t("cognitive_q_verifiable")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="verifiable-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <WizardRadioOption
                    selected={isVerifiable === true}
                    onSelect={() => updateField("isVerifiable", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isVerifiable === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_material_proof")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={isVerifiable === false}
                    onSelect={() => updateField("isVerifiable", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isVerifiable === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_circumstantial")}
                  </WizardRadioOption>
                </div>
              </section>

              <section
                aria-labelledby="distortion-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="distortion-heading" className="text-sm text-white/70">
                  {t("cognitive_q_distortion")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="distortion-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <WizardRadioOption
                    selected={distortionIndicator === false}
                    onSelect={() => updateField("distortionIndicator", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${distortionIndicator === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_clear_narrative")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={distortionIndicator === true}
                    onSelect={() => updateField("distortionIndicator", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${distortionIndicator === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_confusion_memory")}
                  </WizardRadioOption>
                </div>
              </section>

              <section
                aria-labelledby="emotional-distress-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="emotional-distress-heading"
                  className="text-sm text-white/70"
                >
                  {t("cognitive_q_emotional_distress")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="emotional-distress-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <WizardRadioOption
                    selected={hasEmotionalDistress === true}
                    onSelect={() => updateField("hasEmotionalDistress", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasEmotionalDistress === true ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_emotional_yes")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={hasEmotionalDistress === false}
                    onSelect={() => updateField("hasEmotionalDistress", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasEmotionalDistress === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_emotional_no")}
                  </WizardRadioOption>
                </div>
              </section>

              <section
                aria-labelledby="shock-level-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="shock-level-heading" className="text-sm text-white/70">
                  {t("cognitive_q_shock_level")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="shock-level-heading"
                  className="flex gap-2"
                >
                  <WizardRadioOption
                    selected={shockLevel === "low"}
                    onSelect={() => updateField("shockLevel", "low")}
                    className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "low" ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_shock_low")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={shockLevel === "medium"}
                    onSelect={() => updateField("shockLevel", "medium")}
                    className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "medium" ? "bg-white/20 text-white border-white/40" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_shock_medium")}
                  </WizardRadioOption>
                  <WizardRadioOption
                    selected={shockLevel === "high"}
                    onSelect={() => updateField("shockLevel", "high")}
                    className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${shockLevel === "high" ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("cognitive_shock_high")}
                  </WizardRadioOption>
                </div>
              </section>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigateTo("TRIAGE", "back")}
                  className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 text-sm"
                >
                  {t("cognitive_back")}
                </button>
                <button
                  onClick={() => navigateTo("CONTEXT", "forward")}
                  className="flex-[2] py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all duration-200 text-sm shadow-[0_0_30px_rgba(255,255,255,0.16)]"
                >
                  {t("cognitive_next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "CONTEXT" && (
          <div
            key="CONTEXT"
            className={`space-y-8 md:space-y-10 ${navigationDirection.current === "forward" ? "slide-in-right" : "slide-in-left"}`}
          >
            <header className="space-y-3 border-b border-white/10 pb-6">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/95">
                {t("context_title")}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
                {t("context_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section
                aria-labelledby="ongoing-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="ongoing-heading" className="text-sm text-white/70">
                  {t("context_q_ongoing")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="ongoing-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={isOngoing === true ? "true" : "false"}
                    onClick={() => updateField("isOngoing", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isOngoing === true ? "bg-critical text-white border-critical" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_active_now")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={isOngoing === false ? "true" : "false"}
                    onClick={() => updateField("isOngoing", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${isOngoing === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_finished")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="incident-start-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="incident-start-heading"
                  className="text-sm text-white/70"
                >
                  {t("context_q_start")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="incident-start-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {estimatedIncidentStarts.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={
                        estimatedIncidentStart === opt.value ? "true" : "false"
                      }
                      onClick={() =>
                        updateField("estimatedIncidentStart", opt.value)
                      }
                      className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${estimatedIncidentStart === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="sensitivity-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="sensitivity-heading" className="text-sm text-white/70">
                  {t("context_q_sensitivity")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="sensitivity-heading"
                  className="flex gap-2"
                >
                  {dataSensitivityLevels.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={
                        dataSensitivityLevel === opt.value ? "true" : "false"
                      }
                      onClick={() =>
                        updateField("dataSensitivityLevel", opt.value)
                      }
                      className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${dataSensitivityLevel === opt.value ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.18)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      <div className="font-medium">
                        {opt.label.toUpperCase()}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-60">
                        {opt.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="device-access-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="device-access-heading"
                  className="text-sm text-white/70"
                >
                  {t("context_q_device_access")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="device-access-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={
                      hasAccessToDevices === true ? "true" : "false"
                    }
                    onClick={() => updateField("hasAccessToDevices", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasAccessToDevices === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_has_access")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      hasAccessToDevices === false ? "true" : "false"
                    }
                    onClick={() => updateField("hasAccessToDevices", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${hasAccessToDevices === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_no_access")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="third-parties-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="third-parties-heading"
                  className="text-sm text-white/70"
                >
                  {t("context_q_third_parties")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="third-parties-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={
                      thirdPartiesInvolved === true ? "true" : "false"
                    }
                    onClick={() => updateField("thirdPartiesInvolved", true)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${thirdPartiesInvolved === true ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_yes_third_parties")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={
                      thirdPartiesInvolved === false ? "true" : "false"
                    }
                    onClick={() => updateField("thirdPartiesInvolved", false)}
                    className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${thirdPartiesInvolved === false ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                  >
                    {t("context_no_only_me")}
                  </button>
                </div>
              </section>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigateTo("COGNITIVE", "back")}
                  className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 text-sm"
                >
                  {t("context_back")}
                </button>
                <button
                  onClick={() => navigateTo("DETAILS", "forward")}
                  className="flex-[2] py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all duration-200 text-sm shadow-[0_0_30px_rgba(255,255,255,0.16)]"
                >
                  {t("context_next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "DETAILS" && (
          <div
            key="DETAILS"
            className={`space-y-8 md:space-y-10 ${navigationDirection.current === "forward" ? "slide-in-right" : "slide-in-left"}`}
          >
            <header className="space-y-3 border-b border-white/10 pb-6">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/95">
                {t("details_title")}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-white/45 font-light leading-relaxed">
                {t("details_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section
                aria-labelledby="incident-type-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="incident-type-heading"
                  className="text-sm text-white/70"
                >
                  {t("details_q_incident")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="incident-type-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {incidentTypes.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={incident === opt.value ? "true" : "false"}
                      onClick={() => updateField("incident", opt.value)}
                      className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${incident === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="device-count-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="device-count-heading" className="text-sm text-white/70">
                  {t("details_q_devices")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="device-count-heading"
                  className="flex gap-2"
                >
                  {deviceCounts.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={devices === opt.value ? "true" : "false"}
                      onClick={() => updateField("devices", opt.value)}
                      className={`flex-1 py-3 rounded-2xl border transition-all duration-200 text-xs ${devices === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="evidence-sources-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="evidence-sources-heading"
                  className="text-sm text-white/70"
                >
                  {t("details_q_evidence_sources")}
                </h2>
                <div
                  role="group"
                  aria-labelledby="evidence-sources-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {evidenceSourceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      role="checkbox"
                      aria-checked={
                        evidenceSources.includes(opt.value) ? "true" : "false"
                      }
                      onClick={() =>
                        toggleArrayField("evidenceSources", opt.value)
                      }
                      className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${evidenceSources.includes(opt.value) ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="actions-taken-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2
                  id="actions-taken-heading"
                  className="text-sm text-white/70"
                >
                  {t("details_q_actions_taken")}
                </h2>
                <div
                  role="group"
                  aria-labelledby="actions-taken-heading"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {actionTakenOptions.map((opt) => (
                    <button
                      key={opt.value}
                      role="checkbox"
                      aria-checked={
                        actionsTaken.includes(opt.value) ? "true" : "false"
                      }
                      onClick={() =>
                        toggleArrayField("actionsTaken", opt.value)
                      }
                      className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${actionsTaken.includes(opt.value) ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="objective-heading"
                className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <h2 id="objective-heading" className="text-sm text-white/70">
                  {t("details_q_objective")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="objective-heading"
                  className="grid grid-cols-1 gap-3"
                >
                  {objectiveOptions.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={objective === opt.value ? "true" : "false"}
                      onClick={() => updateField("objective", opt.value)}
                      className={`py-3 rounded-2xl border transition-all duration-200 text-xs ${objective === opt.value ? "bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "bg-white/[0.04] border-white/10 text-white/45 hover:bg-white/[0.07] hover:border-white/20"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigateTo("CONTEXT", "back")}
                  className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 text-sm"
                >
                  {t("details_back")}
                </button>
                <button
                  onClick={submit}
                  disabled={isSubmitting || !incident || !objective}
                  aria-disabled={isSubmitting || !incident || !objective}
                  className={`flex-2 py-4 rounded-xl font-bold transition-all text-sm shadow-lg shadow-white/5 ${
                    isSubmitting || !incident || !objective
                      ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {isSubmitting ? t("details_submitting") : t("details_submit")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
