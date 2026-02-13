"use client";

import { useState } from "react";
import type {
  WizardResult,
  ClientProfile,
  UrgencyLevel,
} from "@claritystructures/domain";
import { clientProfiles, urgencyLevels } from "@/constants/wizardOptions";
import AnimatedLogo from "./AnimatedLogo";

type Props = {
  onComplete: (data: WizardResult) => void;
};

type Phase = "TRIAGE" | "COGNITIVE" | "TRACE";

export default function Wizard({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("TRIAGE");

  // Phase 1 State
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(
    null,
  );
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
  const [hasEmotionalDistress, setHasEmotionalDistress] = useState<
    boolean | null
  >(null);
  const [physicalSafetyRisk, setPhysicalSafetyRisk] = useState<boolean | null>(
    null,
  );
  const [financialAssetRisk, setFinancialAssetRisk] = useState<boolean | null>(
    null,
  );
  const [attackerHasPasswords, setAttackerHasPasswords] = useState<
    boolean | null
  >(null);
  const [evidenceIsAutoDeleted, setEvidenceIsAutoDeleted] = useState<
    boolean | null
  >(null);

  // Phase 2 State (Cognitive/Psychological)
  const [perceivedOmnipotence, setPerceivedOmnipotence] = useState<
    boolean | null
  >(null);
  const [isVerifiable, setIsVerifiable] = useState<boolean | null>(null);
  const [distortionIndicator, setDistortionIndicator] = useState<
    boolean | null
  >(null);
  const [shockLevel, setShockLevel] = useState<"low" | "medium" | "high">(
    "low",
  );

  // Phase 3 State (Narrative Tracing)
  const [whatsappControl, setWhatsappControl] = useState<boolean | null>(null);
  const [familySuspect, setFamilySuspect] = useState<boolean | null>(null);
  const [constantSurveillance, setConstantSurveillance] = useState<
    boolean | null
  >(null);

  const isStep1Complete = clientProfile && urgency;

  function submit() {
    if (!clientProfile || !urgency) return;

    onComplete({
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
    });
  }

  return (
    <div className="relative min-h-[700px] w-full max-w-4xl mx-auto dark pt-20">
      {/* Absolute Logo Area (Top Right) */}
      <div className="absolute top-0 right-0 p-8 z-50">
        <AnimatedLogo />
      </div>

      <div className="glass p-6 md:p-12 rounded-3xl shadow-2xl animate-in backdrop-blur-3xl max-w-2xl mx-auto">
        {phase === "TRIAGE" && (
          <div className="space-y-6 md:space-y-10">
            <header className="space-y-1">
              <h1 className="text-xl md:text-3xl font-light tracking-tight text-white/95 leading-tight">
                Triage de Emergencia Técnica
              </h1>
              <p className="text-xs md:text-sm text-white/40 font-light">
                Evaluación inicial para clasificación pericial y legal.
              </p>
            </header>

            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">
                Situación Actual
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clientProfiles.map((opt: any) => (
                  <button
                    key={opt.value}
                    onClick={() => setClientProfile(opt.value)}
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

            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-white/30 font-semibold">
                Nivel de Urgencia
              </h2>
              <div className="flex flex-wrap gap-2">
                {urgencyLevels.map((opt: any) => (
                  <button
                    key={opt.value}
                    onClick={() => setUrgency(opt.value)}
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

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-3">
                <label className="text-xs text-white/40 text-center block">
                  Integridad Física
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhysicalSafetyRisk(true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === true ? "bg-critical text-white border-critical" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    AMENAZA REAL
                  </button>
                  <button
                    onClick={() => setPhysicalSafetyRisk(false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${physicalSafetyRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    ZONA SEGURA
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs text-white/40 text-center block">
                  Activos Financieros
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFinancialAssetRisk(true)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === true ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    EN RIESGO
                  </button>
                  <button
                    onClick={() => setFinancialAssetRisk(false)}
                    className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${financialAssetRisk === false ? "bg-white/20 text-white border-white/40" : "bg-white/5 border-white/10 text-white/40"}`}
                  >
                    PROTEGIDOS
                  </button>
                </div>
              </div>
            </section>

            <button
              onClick={() => setPhase("COGNITIVE")}
              disabled={!isStep1Complete}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                isStep1Complete
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              Siguiente Paso: Evaluación de Contexto
            </button>
          </div>
        )}

        {phase === "COGNITIVE" && (
          <div className="space-y-8 animate-in">
            <header>
              <h1 className="text-2xl font-light tracking-tight text-white/90">
                Evaluación de Estabilidad
              </h1>
              <p className="text-sm text-white/40 mt-1 font-light leading-relaxed">
                Necesitamos entender tu percepción sensorial para ajustar el
                motor de triage.
              </p>
            </header>

            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="text-sm text-white/70">
                  ¿Sientes que el atacante tiene capacidades omnipresentes (te
                  vigila en todo momento)?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPerceivedOmnipotence(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${perceivedOmnipotence === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    VIGILANCIA TOTAL
                  </button>
                  <button
                    onClick={() => setPerceivedOmnipotence(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${perceivedOmnipotence === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    TECNOLÓGICO RESTRICTO
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm text-white/70">
                  ¿Los eventos reportados pueden ser contrastados con pruebas
                  físicas (logs, fotos)?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsVerifiable(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isVerifiable === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    PRUEBAS MATERIALES
                  </button>
                  <button
                    onClick={() => setIsVerifiable(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${isVerifiable === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    SOSPECHAS INDICIARIAS
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm text-white/70">
                  ¿Te sientes capaz de narrar los hechos cronológicamente de
                  forma clara?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDistortionIndicator(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${distortionIndicator === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    NARREACIÓN CLARA
                  </button>
                  <button
                    onClick={() => setDistortionIndicator(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${distortionIndicator === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    CONFUSIÓN / MEMORIA
                  </button>
                </div>
              </section>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setPhase("TRIAGE")}
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                >
                  Volver
                </button>
                <button
                  onClick={() => setPhase("TRACE")}
                  className="flex-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-sm shadow-lg shadow-white/5"
                >
                  Continuar Trazado Forense
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "TRACE" && (
          <div className="space-y-8 animate-in">
            <header>
              <h1 className="text-2xl font-light tracking-tight text-white/90">
                Trazado de Narrativa Forense
              </h1>
              <p className="text-sm text-white/40 mt-1 font-light leading-relaxed">
                Última fase: detección de patrones de intrusión e ingeniería
                social.
              </p>
            </header>

            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="text-sm text-white/70 font-light">
                  ¿Sientes que has perdido o estás perdiendo el control de tus
                  comunicaciones (WhatsApp, Telegram, etc.)?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setWhatsappControl(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${whatsappControl === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    IDENTIFICADO
                  </button>
                  <button
                    onClick={() => setWhatsappControl(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${whatsappControl === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    CONTROL INTEGRAL
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm text-white/70 font-light">
                  ¿Sospechas que detrás de estas anomalías podrían encontrarse
                  familiares directos o personas de tu entorno cercano?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFamilySuspect(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${familySuspect === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    SOSPECHA CERCANA
                  </button>
                  <button
                    onClick={() => setFamilySuspect(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${familySuspect === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    ENTORNO DESCARTADO
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm text-white/70 font-light">
                  ¿Te sientes bajo una vigilancia constante que excede lo
                  puramente digital (persecución, ruidos, eventos físicos)?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConstantSurveillance(true)}
                    className={`py-3 rounded-xl border transition-all text-xs ${constantSurveillance === true ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    PERCEPCIÓN FÍSICA
                  </button>
                  <button
                    onClick={() => setConstantSurveillance(false)}
                    className={`py-3 rounded-xl border transition-all text-xs ${constantSurveillance === false ? "bg-white/10 border-white/40" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/5"}`}
                  >
                    SOLO DIGITAL
                  </button>
                </div>
              </section>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setPhase("COGNITIVE")}
                  className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm"
                >
                  Volver
                </button>
                <button
                  onClick={submit}
                  className="flex-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all text-sm shadow-lg shadow-white/5"
                >
                  Finalizar Informe Triage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
