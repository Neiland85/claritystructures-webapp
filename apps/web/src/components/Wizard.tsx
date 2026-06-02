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
import { useEffect, useReducer, useRef, useState } from "react";
import { WizardNavigation } from "./wizard/WizardNavigation";
import { WizardDetailsPhase } from "./wizard/WizardDetailsPhase";
import { WizardCognitivePhase } from "./wizard/WizardCognitivePhase";
import { WizardContextPhase } from "./wizard/WizardContextPhase";
import { WizardPhaseShell } from "./wizard/WizardPhaseShell";
import { WizardTriagePhase } from "./wizard/WizardTriagePhase";

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
    <WizardPhaseShell
      phaseLabels={phaseLabels}
      phaseIndex={phaseIndex}
      ariaFormProgressLabel={t("aria_form_progress")}
      completedLabel={t("completed")}
      currentLabel={t("current")}
      stepLabel={t("step")}
      ofLabel={t("of")}
    >
      {phase === "TRIAGE" && (
        <WizardTriagePhase
          clientProfiles={clientProfiles}
          urgencyLevels={urgencyLevels}
          clientProfile={clientProfile}
          urgency={urgency}
          physicalSafetyRisk={physicalSafetyRisk}
          financialAssetRisk={financialAssetRisk}
          attackerHasPasswords={attackerHasPasswords}
          evidenceIsAutoDeleted={evidenceIsAutoDeleted}
          labels={{
            title: t("triage_title"),
            subtitle: t("triage_subtitle"),
            sectionProfile: t("triage_section_profile"),
            sectionUrgency: t("triage_section_urgency"),
            physicalIntegrity: t("triage_physical_integrity"),
            financialAssets: t("triage_financial_assets"),
            credentialAccess: t("triage_credential_access"),
            evidenceVolatility: t("triage_evidence_volatility"),
            threatReal: t("triage_threat_real"),
            safeZone: t("triage_safe_zone"),
            atRisk: t("triage_at_risk"),
            protected: t("triage_protected"),
            passwordsCompromised: t("triage_passwords_compromised"),
            passwordsSafe: t("triage_passwords_safe"),
            autoDeleting: t("triage_auto_deleting"),
            evidenceStable: t("triage_evidence_stable"),
            next: t("triage_next"),
          }}
          onClientProfileChange={(value) => updateField("clientProfile", value)}
          onUrgencyChange={(value) => updateField("urgency", value)}
          onPhysicalSafetyRiskChange={(value) =>
            updateField("physicalSafetyRisk", value)
          }
          onFinancialAssetRiskChange={(value) =>
            updateField("financialAssetRisk", value)
          }
          onAttackerHasPasswordsChange={(value) =>
            updateField("attackerHasPasswords", value)
          }
          onEvidenceIsAutoDeletedChange={(value) =>
            updateField("evidenceIsAutoDeleted", value)
          }
          onNext={() => navigateTo("COGNITIVE", "forward")}
          nextDisabled={!isStep1Complete}
        />
      )}

      {phase === "COGNITIVE" && (
        <WizardCognitivePhase
          navigationDirection={navigationDirection.current}
          perceivedOmnipotence={perceivedOmnipotence}
          isVerifiable={isVerifiable}
          distortionIndicator={distortionIndicator}
          hasEmotionalDistress={hasEmotionalDistress}
          shockLevel={shockLevel}
          labels={{
            title: t("cognitive_title"),
            subtitle: t("cognitive_subtitle"),
            qOmnipotence: t("cognitive_q_omnipotence"),
            totalSurveillance: t("cognitive_total_surveillance"),
            restrictedTech: t("cognitive_restricted_tech"),
            qVerifiable: t("cognitive_q_verifiable"),
            materialProof: t("cognitive_material_proof"),
            circumstantial: t("cognitive_circumstantial"),
            qDistortion: t("cognitive_q_distortion"),
            clearNarrative: t("cognitive_clear_narrative"),
            confusionMemory: t("cognitive_confusion_memory"),
            qEmotionalDistress: t("cognitive_q_emotional_distress"),
            emotionalYes: t("cognitive_emotional_yes"),
            emotionalNo: t("cognitive_emotional_no"),
            qShockLevel: t("cognitive_q_shock_level"),
            shockLow: t("cognitive_shock_low"),
            shockMedium: t("cognitive_shock_medium"),
            shockHigh: t("cognitive_shock_high"),
            back: t("cognitive_back"),
            next: t("cognitive_next"),
          }}
          onPerceivedOmnipotenceChange={(value) =>
            updateField("perceivedOmnipotence", value)
          }
          onIsVerifiableChange={(value) => updateField("isVerifiable", value)}
          onDistortionIndicatorChange={(value) =>
            updateField("distortionIndicator", value)
          }
          onHasEmotionalDistressChange={(value) =>
            updateField("hasEmotionalDistress", value)
          }
          onShockLevelChange={(value) => updateField("shockLevel", value)}
          onBack={() => navigateTo("TRIAGE", "back")}
          onNext={() => navigateTo("CONTEXT", "forward")}
        />
      )}

      {phase === "CONTEXT" && (
        <WizardContextPhase
          navigationDirection={navigationDirection.current}
          estimatedIncidentStarts={estimatedIncidentStarts}
          dataSensitivityLevels={dataSensitivityLevels}
          isOngoing={isOngoing}
          estimatedIncidentStart={estimatedIncidentStart}
          dataSensitivityLevel={dataSensitivityLevel}
          hasAccessToDevices={hasAccessToDevices}
          thirdPartiesInvolved={thirdPartiesInvolved}
          labels={{
            title: t("context_title"),
            subtitle: t("context_subtitle"),
            qOngoing: t("context_q_ongoing"),
            activeNow: t("context_active_now"),
            finished: t("context_finished"),
            qStart: t("context_q_start"),
            qSensitivity: t("context_q_sensitivity"),
            qDeviceAccess: t("context_q_device_access"),
            hasAccess: t("context_has_access"),
            noAccess: t("context_no_access"),
            qThirdParties: t("context_q_third_parties"),
            yesThirdParties: t("context_yes_third_parties"),
            noOnlyMe: t("context_no_only_me"),
            back: t("context_back"),
            next: t("context_next"),
          }}
          onIsOngoingChange={(value) => updateField("isOngoing", value)}
          onEstimatedIncidentStartChange={(value) =>
            updateField("estimatedIncidentStart", value)
          }
          onDataSensitivityLevelChange={(value) =>
            updateField("dataSensitivityLevel", value)
          }
          onHasAccessToDevicesChange={(value) =>
            updateField("hasAccessToDevices", value)
          }
          onThirdPartiesInvolvedChange={(value) =>
            updateField("thirdPartiesInvolved", value)
          }
          onBack={() => navigateTo("COGNITIVE", "back")}
          onNext={() => navigateTo("DETAILS", "forward")}
        />
      )}

      {phase === "DETAILS" && (
        <WizardDetailsPhase
          navigationDirection={navigationDirection.current}
          incidentTypes={incidentTypes}
          deviceCounts={deviceCounts}
          evidenceSourceOptions={evidenceSourceOptions}
          actionTakenOptions={actionTakenOptions}
          objectiveOptions={objectiveOptions}
          incident={incident}
          devices={devices}
          evidenceSources={evidenceSources}
          actionsTaken={actionsTaken}
          objective={objective}
          isSubmitting={isSubmitting}
          labels={{
            title: t("details_title"),
            subtitle: t("details_subtitle"),
            qIncident: t("details_q_incident"),
            qDevices: t("details_q_devices"),
            qEvidenceSources: t("details_q_evidence_sources"),
            qActionsTaken: t("details_q_actions_taken"),
            qObjective: t("details_q_objective"),
            back: t("details_back"),
            submit: t("details_submit"),
            submitting: t("details_submitting"),
          }}
          onIncidentChange={(value) => updateField("incident", value)}
          onDevicesChange={(value) => updateField("devices", value)}
          onEvidenceSourceToggle={(value) =>
            toggleArrayField("evidenceSources", value)
          }
          onActionTakenToggle={(value) =>
            toggleArrayField("actionsTaken", value)
          }
          onObjectiveChange={(value) => updateField("objective", value)}
          onBack={() => navigateTo("CONTEXT", "back")}
          onSubmit={submit}
        />
      )}
    </WizardPhaseShell>
  );
}
