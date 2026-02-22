"use client";

import { useReducer, useEffect } from "react";
import type {
  WizardResult,
  ClientProfile,
  UrgencyLevel,
} from "@claritystructures/domain";
import { decideIntake } from "@claritystructures/domain";
import {
  getClientProfiles,
  getUrgencyLevels,
  getDataSensitivityLevels,
  getEstimatedIncidentStarts,
} from "@/constants/wizardOptions";
import { useTranslation } from "@/i18n/useTranslation";
import { wizardDict } from "@/i18n/wizard";
import { useLang } from "@/components/LanguageProvider";
import AnimatedLogo from "./AnimatedLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import { trackEvent } from "@/lib/analytics";

type Props = {
  onComplete: (data: WizardResult) => void;
};

type Phase = "TRIAGE" | "COGNITIVE" | "CONTEXT" | "TRACE";

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
  whatsappControl: boolean | null;
  familySuspect: boolean | null;
  constantSurveillance: boolean | null;
  // V2 context signals
  isOngoing: boolean | null;
  hasAccessToDevices: boolean | null;
  dataSensitivityLevel: "low" | "medium" | "high" | null;
  estimatedIncidentStart: "unknown" | "recent" | "weeks" | "months" | null;
  thirdPartiesInvolved: boolean | null;
};

type WizardAction =
  | { type: "SET_PHASE"; payload: Phase }
  | { type: "UPDATE_FIELD"; field: keyof WizardState; value: any };

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
  whatsappControl: null,
  familySuspect: null,
  constantSurveillance: null,
  // V2 context signals
  isOngoing: null,
  hasAccessToDevices: null,
  dataSensitivityLevel: null,
  estimatedIncidentStart: null,
  thirdPartiesInvolved: null,
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

export default function Wizard({ onComplete }: Props) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const t = useTranslation(wizardDict);
  const lang = useLang();

  const clientProfiles = getClientProfiles(lang);
  const urgencyLevels = getUrgencyLevels(lang);
  const dataSensitivityLevels = getDataSensitivityLevels(lang);
  const estimatedIncidentStarts = getEstimatedIncidentStarts(lang);

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
    whatsappControl,
    familySuspect,
    constantSurveillance,
    isOngoing,
    hasAccessToDevices,
    dataSensitivityLevel,
    estimatedIncidentStart,
    thirdPartiesInvolved,
  } = state;

  const isStep1Complete = clientProfile && urgency;

  useEffect(() => {
    trackEvent({
      name: "wizard.step_view",
      timestamp: Date.now(),
      payload: { phase },
    });
  }, [phase]);

  function updateField(field: keyof WizardState, value: any) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  function submit() {
    if (!clientProfile || !urgency) return;

    const severityScore =
      (urgency === "critical" ? 40 : 0) +
      (physicalSafetyRisk ? 30 : 0) +
      (financialAssetRisk ? 15 : 0) +
      (attackerHasPasswords ? 10 : 0) +
      (evidenceIsAutoDeleted ? 5 : 0);

    trackEvent({
      name: "wizard.step_submit",
      timestamp: Date.now(),
      payload: { phase, severityScore },
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
      narrativeTracing: {
        whatsappControlLoss: whatsappControl ?? false,
        familySuspects: familySuspect ?? false,
        perceivedSurveillance: constantSurveillance ?? false,
      },
      incident: "unspecified",
      devices: 0,
      actionsTaken: [],
      evidenceSources: [],
      objective: "document",
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
    t("phase_trace"),
  ];

  return (
    <div className="relative min-h-[700px] w-full max-w-4xl mx-auto dark pt-20">
      <div className="absolute top-0 right-0 p-8 z-50 flex items-center gap-3">
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
        className="glass p-6 md:p-12 rounded-3xl shadow-2xl animate-in backdrop-blur-3xl max-w-2xl mx-auto"
        role="form"
        aria-label={`${t("step")} ${phaseIndex + 1} ${t("of")} ${phaseLabels.length}: ${phaseLabels[phaseIndex]}`}
      >
        {phase === "TRIAGE" && (
          <div className="space-y-6 md:space-y-10">
            <header className="space-y-1">
              <h1 className="text-xl md:text-3xl font-light tracking-tight text-white/95 leading-tight">
                {t("triage_title")}
              </h1>
              <p className="text-xs md:text-sm text-white/40 font-light">
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
                  <button
                    key={opt.value}
                    role="radio"
                    aria-checked={clientProfile === opt.value}
                    onClick={() => updateField("clientProfile", opt.value)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      clientProfile === opt.value
                        ? "bg-white/10 border-white/40 ring-1 ring-white/20"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="font-medium text-sm text-white/80">
                      {opt.label}
                    </div>
                  </button>
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
                  <button
                    key={opt.value}
                    role="radio"
                    aria-checked={urgency === opt.value}
                    onClick={() => updateField("urgency", opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      urgency === opt.value
                        ? "bg-white text-black border-white"
                        : "bg-white/5 border-white/10 hover:border-white/20 text-white/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            <section
              aria-label={t("triage_physical_integrity")}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5"
            >
              <fieldset className="space-y-3">
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
                    aria-checked={physicalSafetyRisk === true}
                    onClick={() => updateField("physicalSafetyRisk", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_threat_real")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={physicalSafetyRisk === false}
                    onClick={() => updateField("physicalSafetyRisk", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_safe_zone")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3">
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
                    aria-checked={financialAssetRisk === true}
                    onClick={() => updateField("financialAssetRisk", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === true ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_at_risk")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={financialAssetRisk === false}
                    onClick={() => updateField("financialAssetRisk", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_protected")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3">
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
                    aria-checked={attackerHasPasswords === true}
                    onClick={() => updateField("attackerHasPasswords", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_passwords_compromised")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={attackerHasPasswords === false}
                    onClick={() => updateField("attackerHasPasswords", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${attackerHasPasswords === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_passwords_safe")}
                  </button>
                </div>
              </fieldset>
              <fieldset className="space-y-3">
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
                    aria-checked={evidenceIsAutoDeleted === true}
                    onClick={() => updateField("evidenceIsAutoDeleted", true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_auto_deleting")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={evidenceIsAutoDeleted === false}
                    onClick={() => updateField("evidenceIsAutoDeleted", false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${evidenceIsAutoDeleted === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    {t("triage_evidence_stable")}
                  </button>
                </div>
              </fieldset>
            </section>

            <button
              onClick={() =>
                dispatch({ type: "SET_PHASE", payload: "COGNITIVE" })
              }
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
          <div className="space-y-8 animate-in">
            <header>
              <h1 className="text-2xl font-light tracking-tight text-white/90">
                {t("cognitive_title")}
              </h1>
              <p className="text-sm text-white/40 mt-1 font-light leading-relaxed">
                {t("cognitive_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section
                aria-labelledby="omnipotence-heading"
                className="space-y-3"
              >
                <h2 id="omnipotence-heading" className="text-sm text-white/70">
                  {t("cognitive_q_omnipotence")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="omnipotence-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={perceivedOmnipotence === true}
                    onClick={() => updateField("perceivedOmnipotence", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${perceivedOmnipotence === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_total_surveillance")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={perceivedOmnipotence === false}
                    onClick={() => updateField("perceivedOmnipotence", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${perceivedOmnipotence === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_restricted_tech")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="verifiable-heading"
                className="space-y-3"
              >
                <h2 id="verifiable-heading" className="text-sm text-white/70">
                  {t("cognitive_q_verifiable")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="verifiable-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={isVerifiable === true}
                    onClick={() => updateField("isVerifiable", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isVerifiable === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_material_proof")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={isVerifiable === false}
                    onClick={() => updateField("isVerifiable", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isVerifiable === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_circumstantial")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="distortion-heading"
                className="space-y-3"
              >
                <h2 id="distortion-heading" className="text-sm text-white/70">
                  {t("cognitive_q_distortion")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="distortion-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={distortionIndicator === false}
                    onClick={() => updateField("distortionIndicator", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${distortionIndicator === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_clear_narrative")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={distortionIndicator === true}
                    onClick={() => updateField("distortionIndicator", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${distortionIndicator === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_confusion_memory")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="emotional-distress-heading"
                className="space-y-3"
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
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={hasEmotionalDistress === true}
                    onClick={() => updateField("hasEmotionalDistress", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${hasEmotionalDistress === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_emotional_yes")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={hasEmotionalDistress === false}
                    onClick={() => updateField("hasEmotionalDistress", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${hasEmotionalDistress === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_emotional_no")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="shock-level-heading"
                className="space-y-3"
              >
                <h2 id="shock-level-heading" className="text-sm text-white/70">
                  {t("cognitive_q_shock_level")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="shock-level-heading"
                  className="flex gap-2"
                >
                  <button
                    role="radio"
                    aria-checked={shockLevel === "low"}
                    onClick={() => updateField("shockLevel", "low")}
                    className={`flex-1 py-3 rounded-xl border transition-all text-xs ${shockLevel === "low" ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_shock_low")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={shockLevel === "medium"}
                    onClick={() => updateField("shockLevel", "medium")}
                    className={`flex-1 py-3 rounded-xl border transition-all text-xs ${shockLevel === "medium" ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_shock_medium")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={shockLevel === "high"}
                    onClick={() => updateField("shockLevel", "high")}
                    className={`flex-1 py-3 rounded-xl border transition-all text-xs ${shockLevel === "high" ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("cognitive_shock_high")}
                  </button>
                </div>
              </section>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() =>
                    dispatch({ type: "SET_PHASE", payload: "TRIAGE" })
                  }
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                >
                  {t("cognitive_back")}
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: "SET_PHASE", payload: "CONTEXT" })
                  }
                  className="flex-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-sm shadow-lg shadow-white/5"
                >
                  {t("cognitive_next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "CONTEXT" && (
          <div className="space-y-8 animate-in">
            <header>
              <h1 className="text-2xl font-light tracking-tight text-white/90">
                {t("context_title")}
              </h1>
              <p className="text-sm text-white/40 mt-1 font-light leading-relaxed">
                {t("context_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section aria-labelledby="ongoing-heading" className="space-y-3">
                <h2 id="ongoing-heading" className="text-sm text-white/70">
                  {t("context_q_ongoing")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="ongoing-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={isOngoing === true}
                    onClick={() => updateField("isOngoing", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isOngoing === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_active_now")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={isOngoing === false}
                    onClick={() => updateField("isOngoing", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isOngoing === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_finished")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="incident-start-heading"
                className="space-y-3"
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
                  className="grid grid-cols-2 gap-3"
                >
                  {estimatedIncidentStarts.map((opt) => (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={estimatedIncidentStart === opt.value}
                      onClick={() =>
                        updateField("estimatedIncidentStart", opt.value)
                      }
                      className={`py-3 rounded-xl border transition-all text-xs ${estimatedIncidentStart === opt.value ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                    >
                      {opt.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="sensitivity-heading"
                className="space-y-3"
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
                      aria-checked={dataSensitivityLevel === opt.value}
                      onClick={() =>
                        updateField("dataSensitivityLevel", opt.value)
                      }
                      className={`flex-1 py-3 rounded-xl border transition-all text-xs ${dataSensitivityLevel === opt.value ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
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
                className="space-y-3"
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
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={hasAccessToDevices === true}
                    onClick={() => updateField("hasAccessToDevices", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${hasAccessToDevices === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_has_access")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={hasAccessToDevices === false}
                    onClick={() => updateField("hasAccessToDevices", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${hasAccessToDevices === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_no_access")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="third-parties-heading"
                className="space-y-3"
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
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={thirdPartiesInvolved === true}
                    onClick={() => updateField("thirdPartiesInvolved", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${thirdPartiesInvolved === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_yes_third_parties")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={thirdPartiesInvolved === false}
                    onClick={() => updateField("thirdPartiesInvolved", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${thirdPartiesInvolved === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("context_no_only_me")}
                  </button>
                </div>
              </section>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() =>
                    dispatch({ type: "SET_PHASE", payload: "COGNITIVE" })
                  }
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                >
                  {t("context_back")}
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: "SET_PHASE", payload: "TRACE" })
                  }
                  className="flex-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-sm shadow-lg shadow-white/5"
                >
                  {t("context_next")}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "TRACE" && (
          <div className="space-y-8 animate-in">
            <header>
              <h1 className="text-2xl font-light tracking-tight text-white/90">
                {t("trace_title")}
              </h1>
              <p className="text-sm text-white/40 mt-1 font-light leading-relaxed">
                {t("trace_subtitle")}
              </p>
            </header>

            <div className="space-y-8">
              <section aria-labelledby="whatsapp-heading" className="space-y-3">
                <h2
                  id="whatsapp-heading"
                  className="text-sm text-white/70 font-light"
                >
                  {t("trace_q_whatsapp")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="whatsapp-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={whatsappControl === true}
                    onClick={() => updateField("whatsappControl", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${whatsappControl === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_identified")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={whatsappControl === false}
                    onClick={() => updateField("whatsappControl", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${whatsappControl === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_full_control")}
                  </button>
                </div>
              </section>

              <section aria-labelledby="family-heading" className="space-y-3">
                <h2
                  id="family-heading"
                  className="text-sm text-white/70 font-light"
                >
                  {t("trace_q_family")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="family-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={familySuspect === true}
                    onClick={() => updateField("familySuspect", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${familySuspect === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_close_suspect")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={familySuspect === false}
                    onClick={() => updateField("familySuspect", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${familySuspect === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_environment_clear")}
                  </button>
                </div>
              </section>

              <section
                aria-labelledby="surveillance-heading"
                className="space-y-3"
              >
                <h2
                  id="surveillance-heading"
                  className="text-sm text-white/70 font-light"
                >
                  {t("trace_q_surveillance")}
                </h2>
                <div
                  role="radiogroup"
                  aria-labelledby="surveillance-heading"
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    role="radio"
                    aria-checked={constantSurveillance === true}
                    onClick={() => updateField("constantSurveillance", true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${constantSurveillance === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_physical_perception")}
                  </button>
                  <button
                    role="radio"
                    aria-checked={constantSurveillance === false}
                    onClick={() => updateField("constantSurveillance", false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${constantSurveillance === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    {t("trace_digital_only")}
                  </button>
                </div>
              </section>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() =>
                    dispatch({ type: "SET_PHASE", payload: "CONTEXT" })
                  }
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                >
                  {t("trace_back")}
                </button>
                <button
                  onClick={submit}
                  className="flex-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-sm shadow-lg shadow-white/5"
                >
                  {t("trace_submit")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
