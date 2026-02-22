import type { Lang } from "@/components/LanguageProvider";

export const wizardDict = {
  es: {
    // Phase labels
    phase_triage: "Triage",
    phase_cognitive: "Evaluación",
    phase_context: "Contexto",
    phase_trace: "Trazado",
    completed: "(completado)",
    current: "(actual)",
    step: "Paso",
    of: "de",
    aria_form_progress: "Progreso del formulario",

    // TRIAGE phase
    triage_title: "Triage de Emergencia Técnica",
    triage_subtitle: "Evaluación inicial para clasificación pericial y legal.",
    triage_section_profile: "Situación Actual",
    triage_section_urgency: "Nivel de Urgencia",
    triage_physical_integrity: "Integridad Física",
    triage_financial_assets: "Activos Financieros",
    triage_threat_real: "AMENAZA REAL",
    triage_safe_zone: "ZONA SEGURA",
    triage_at_risk: "EN RIESGO",
    triage_protected: "PROTEGIDOS",
    triage_credential_access: "Credenciales Comprometidas",
    triage_passwords_compromised: "CONTRASEÑAS EXPUESTAS",
    triage_passwords_safe: "CREDENCIALES SEGURAS",
    triage_evidence_volatility: "Volatilidad de Pruebas",
    triage_auto_deleting: "AUTOBORRADO ACTIVO",
    triage_evidence_stable: "PRUEBAS ESTABLES",
    triage_next: "Siguiente Paso: Evaluación de Contexto",

    // COGNITIVE phase
    cognitive_q_emotional_distress:
      "¿Estás experimentando angustia emocional significativa a causa de esta situación?",
    cognitive_emotional_yes: "ANGUSTIA SEVERA",
    cognitive_emotional_no: "ESTABLE EMOCIONALMENTE",
    cognitive_q_shock_level:
      "¿Cuál es tu nivel actual de impacto emocional o shock?",
    cognitive_shock_low: "BAJO",
    cognitive_shock_medium: "MODERADO",
    cognitive_shock_high: "SEVERO",
    cognitive_title: "Evaluación de Estabilidad",
    cognitive_subtitle:
      "Necesitamos entender tu percepción sensorial para ajustar el motor de triage.",
    cognitive_q_omnipotence:
      "¿Sientes que el atacante tiene capacidades omnipresentes (te vigila en todo momento)?",
    cognitive_total_surveillance: "VIGILANCIA TOTAL",
    cognitive_restricted_tech: "TECNOLÓGICO RESTRICTO",
    cognitive_q_verifiable:
      "¿Los eventos reportados pueden ser contrastados con pruebas físicas (logs, fotos)?",
    cognitive_material_proof: "PRUEBAS MATERIALES",
    cognitive_circumstantial: "SOSPECHAS INDICIARIAS",
    cognitive_q_distortion:
      "¿Te sientes capaz de narrar los hechos cronológicamente de forma clara?",
    cognitive_clear_narrative: "NARRACIÓN CLARA",
    cognitive_confusion_memory: "CONFUSIÓN / MEMORIA",
    cognitive_back: "Volver",
    cognitive_next: "Siguiente Paso: Contexto",

    // CONTEXT phase
    context_title: "Contexto del Incidente",
    context_subtitle:
      "Información adicional para clasificar la exposición y alcance.",
    context_q_ongoing: "¿El incidente sigue activo en este momento?",
    context_active_now: "ACTIVO AHORA",
    context_finished: "YA FINALIZADO",
    context_q_start: "¿Cuándo comenzó aproximadamente el incidente?",
    context_q_sensitivity:
      "¿Qué nivel de sensibilidad tienen los datos afectados?",
    context_q_device_access:
      "¿Tienes acceso físico a los dispositivos afectados?",
    context_has_access: "SÍ, TENGO ACCESO",
    context_no_access: "NO TENGO ACCESO",
    context_q_third_parties:
      "¿Hay terceros involucrados o afectados por el incidente?",
    context_yes_third_parties: "SÍ, HAY TERCEROS",
    context_no_only_me: "NO, SOLO YO",
    context_back: "Volver",
    context_next: "Continuar Trazado Forense",

    // TRACE phase
    trace_title: "Trazado de Narrativa Forense",
    trace_subtitle:
      "Última fase: detección de patrones de intrusión e ingeniería social.",
    trace_q_whatsapp:
      "¿Sientes que has perdido o estás perdiendo el control de tus comunicaciones (WhatsApp, Telegram, etc.)?",
    trace_identified: "IDENTIFICADO",
    trace_full_control: "CONTROL INTEGRAL",
    trace_q_family:
      "¿Sospechas que detrás de estas anomalías podrían encontrarse familiares directos o personas de tu entorno cercano?",
    trace_close_suspect: "SOSPECHA CERCANA",
    trace_environment_clear: "ENTORNO DESCARTADO",
    trace_q_surveillance:
      "¿Te sientes bajo una vigilancia constante que excede lo puramente digital (persecución, ruidos, eventos físicos)?",
    trace_physical_perception: "PERCEPCIÓN FÍSICA",
    trace_digital_only: "SOLO DIGITAL",
    trace_back: "Volver",
    trace_submit: "Finalizar Informe Triage",
  },
  en: {
    // Phase labels
    phase_triage: "Triage",
    phase_cognitive: "Assessment",
    phase_context: "Context",
    phase_trace: "Tracing",
    completed: "(completed)",
    current: "(current)",
    step: "Step",
    of: "of",
    aria_form_progress: "Form progress",

    // TRIAGE phase
    triage_title: "Technical Emergency Triage",
    triage_subtitle: "Initial assessment for expert and legal classification.",
    triage_section_profile: "Current Situation",
    triage_section_urgency: "Urgency Level",
    triage_physical_integrity: "Physical Safety",
    triage_financial_assets: "Financial Assets",
    triage_threat_real: "REAL THREAT",
    triage_safe_zone: "SAFE ZONE",
    triage_at_risk: "AT RISK",
    triage_protected: "PROTECTED",
    triage_credential_access: "Compromised Credentials",
    triage_passwords_compromised: "PASSWORDS EXPOSED",
    triage_passwords_safe: "CREDENTIALS SAFE",
    triage_evidence_volatility: "Evidence Volatility",
    triage_auto_deleting: "AUTO-DELETING ACTIVE",
    triage_evidence_stable: "EVIDENCE STABLE",
    triage_next: "Next Step: Context Assessment",

    // COGNITIVE phase
    cognitive_q_emotional_distress:
      "Are you experiencing significant emotional distress because of this situation?",
    cognitive_emotional_yes: "SEVERE DISTRESS",
    cognitive_emotional_no: "EMOTIONALLY STABLE",
    cognitive_q_shock_level:
      "What is your current level of emotional impact or shock?",
    cognitive_shock_low: "LOW",
    cognitive_shock_medium: "MODERATE",
    cognitive_shock_high: "SEVERE",
    cognitive_title: "Stability Assessment",
    cognitive_subtitle:
      "We need to understand your sensory perception to calibrate the triage engine.",
    cognitive_q_omnipotence:
      "Do you feel the attacker has omnipresent capabilities (watching you at all times)?",
    cognitive_total_surveillance: "TOTAL SURVEILLANCE",
    cognitive_restricted_tech: "RESTRICTED TECH",
    cognitive_q_verifiable:
      "Can the reported events be corroborated with physical evidence (logs, photos)?",
    cognitive_material_proof: "MATERIAL EVIDENCE",
    cognitive_circumstantial: "CIRCUMSTANTIAL SUSPICION",
    cognitive_q_distortion:
      "Are you able to narrate the events chronologically in a clear manner?",
    cognitive_clear_narrative: "CLEAR NARRATIVE",
    cognitive_confusion_memory: "CONFUSION / MEMORY",
    cognitive_back: "Back",
    cognitive_next: "Next Step: Context",

    // CONTEXT phase
    context_title: "Incident Context",
    context_subtitle: "Additional information to classify exposure and scope.",
    context_q_ongoing: "Is the incident still active right now?",
    context_active_now: "ACTIVE NOW",
    context_finished: "ALREADY RESOLVED",
    context_q_start: "When did the incident approximately begin?",
    context_q_sensitivity: "What sensitivity level do the affected data have?",
    context_q_device_access:
      "Do you have physical access to the affected devices?",
    context_has_access: "YES, I HAVE ACCESS",
    context_no_access: "NO ACCESS",
    context_q_third_parties:
      "Are there third parties involved or affected by the incident?",
    context_yes_third_parties: "YES, THIRD PARTIES",
    context_no_only_me: "NO, JUST ME",
    context_back: "Back",
    context_next: "Continue Forensic Tracing",

    // TRACE phase
    trace_title: "Forensic Narrative Tracing",
    trace_subtitle:
      "Final phase: detection of intrusion patterns and social engineering.",
    trace_q_whatsapp:
      "Do you feel you have lost or are losing control of your communications (WhatsApp, Telegram, etc.)?",
    trace_identified: "IDENTIFIED",
    trace_full_control: "FULL CONTROL",
    trace_q_family:
      "Do you suspect that direct family members or people close to you could be behind these anomalies?",
    trace_close_suspect: "CLOSE SUSPICION",
    trace_environment_clear: "ENVIRONMENT CLEARED",
    trace_q_surveillance:
      "Do you feel under constant surveillance that goes beyond the purely digital (persecution, noises, physical events)?",
    trace_physical_perception: "PHYSICAL PERCEPTION",
    trace_digital_only: "DIGITAL ONLY",
    trace_back: "Back",
    trace_submit: "Finalize Triage Report",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type WizardDictKey = keyof (typeof wizardDict)["es"];
