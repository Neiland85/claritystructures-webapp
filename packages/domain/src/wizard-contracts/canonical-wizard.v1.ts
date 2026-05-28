import type {
  CanonicalSignal,
  QuestionContract,
  WizardLocale,
  WizardPhase,
} from "./question-contract";
import type { SnippetContract } from "./snippet-contract";
import type { WizardEventContract, WizardEventName } from "./event-contract";

export const WIZARD_CONTRACT_ID = "clarity.intake.wizard" as const;
export const WIZARD_CONTRACT_VERSION = "1.0.0" as const;

export const WIZARD_PHASES: readonly WizardPhase[] = [
  "TRIAGE",
  "COGNITIVE",
  "CONTEXT",
  "DETAILS",
] as const;

export const WIZARD_LOCALES: readonly WizardLocale[] = ["es", "en"] as const;

export const CANONICAL_SIGNALS: readonly CanonicalSignal[] = [
  "routing.private_case",
  "routing.family_dispute",
  "routing.legal_professional",
  "routing.court_related",
  "risk.time_sensitive",
  "risk.legal",
  "risk.critical",
  "risk.physical_safety",
  "risk.financial_asset",
  "risk.credential_compromise",
  "risk.evidence_volatility",
  "risk.emotional_distress",
  "risk.cognitive_distortion",
  "evidence.none",
  "evidence.full_device",
  "evidence.screenshots",
  "evidence.messages_only",
  "evidence.mixed",
  "exposure.active",
  "exposure.potential",
  "exposure.contained",
  "privacy.high_sensitivity",
  "privacy.personal_data",
  "legal.derivation_candidate",
  "consent.contact_permission",
] as const;

export const WIZARD_EVENTS: readonly WizardEventContract[] = [
  {
    name: "WizardStarted",
    version: "1.0.0",
    description: "The intake wizard was opened.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardQuestionViewed",
    version: "1.0.0",
    description: "A canonical wizard question was displayed.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardQuestionAnswered",
    version: "1.0.0",
    description: "A canonical wizard question was answered.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "personal",
    },
  },
  {
    name: "WizardPhaseCompleted",
    version: "1.0.0",
    description: "A wizard phase was completed.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardSignalDerived",
    version: "1.0.0",
    description: "A canonical signal was derived from an answer.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardSnippetShown",
    version: "1.0.0",
    description: "A contextual snippet was shown to the user.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardDecisionComputed",
    version: "1.0.0",
    description: "The deterministic decision engine computed a result.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardCompleted",
    version: "1.0.0",
    description: "The wizard was completed.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "WizardAbandoned",
    version: "1.0.0",
    description: "The wizard was abandoned before completion.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "none",
    },
  },
  {
    name: "ConsentCaptured",
    version: "1.0.0",
    description: "A consent action was captured.",
    privacy: {
      allowPii: false,
      allowFreeText: false,
      classification: "personal",
    },
  },
  {
    name: "ContactSubmitted",
    version: "1.0.0",
    description: "The user submitted a contact intent.",
    privacy: {
      allowPii: true,
      allowFreeText: true,
      classification: "personal",
    },
  },
] as const;

const answerEvents = [
  {
    name: "WizardQuestionAnswered",
    trigger: "on_answer",
    includeAnswer: false,
    includeSignals: true,
  },
] as const;

const noPiiAnalytics = {
  pii: false,
  sensitive: false,
  classification: "none",
  retention: "standard",
  analyticsAllowed: true,
  freeText: false,
} as const;

const sensitiveNoAnalytics = {
  pii: false,
  sensitive: true,
  classification: "sensitive",
  retention: "legal_hold_candidate",
  analyticsAllowed: false,
  freeText: false,
} as const;

const freeTextPersonalNoAnalytics = {
  pii: true,
  sensitive: true,
  classification: "personal",
  retention: "legal_hold_candidate",
  analyticsAllowed: false,
  freeText: true,
} as const;

export const WIZARD_SNIPPETS: readonly SnippetContract[] = [
  {
    id: "snippet.boundary.not_legal_advice",
    version: "1.0.0",
    kind: "legal_boundary",
    severity: "info",
    body: {
      es: "Esta evaluación no sustituye asesoramiento legal. Sirve para ordenar riesgos técnicos, preservar contexto y orientar próximos pasos.",
      en: "This assessment does not replace legal advice. It helps order technical risks, preserve context and guide next steps.",
    },
    privacyClassification: "none",
    mustNotClaim: [
      "No afirmar que el resultado tiene validez judicial automática.",
      "No afirmar que sustituye la dirección letrada.",
    ],
  },
  {
    id: "snippet.evidence.do_not_modify_originals",
    version: "1.0.0",
    kind: "evidence_advice",
    severity: "warning",
    body: {
      es: "No borres, edites, reenvíes ni reorganices archivos originales. Si hay riesgo de pérdida, conserva el dispositivo y documenta fecha, origen y contexto.",
      en: "Do not delete, edit, forward or reorganize original files. If there is risk of loss, preserve the device and document date, origin and context.",
    },
    appliesWhen: [
      {
        field: "risk.evidence_volatility",
        operator: "equals",
        value: true,
      },
    ],
    privacyClassification: "none",
  },
  {
    id: "snippet.risk.physical_safety",
    version: "1.0.0",
    kind: "warning",
    severity: "critical",
    body: {
      es: "Si existe amenaza física real, prioriza seguridad personal y servicios de emergencia. La parte técnica no debe retrasar una actuación urgente.",
      en: "If there is a real physical threat, prioritize personal safety and emergency services. Technical review must not delay urgent action.",
    },
    appliesWhen: [
      {
        field: "risk.physical_safety",
        operator: "equals",
        value: true,
      },
    ],
    privacyClassification: "none",
  },
  {
    id: "snippet.privacy.data_minimization",
    version: "1.0.0",
    kind: "privacy_notice",
    severity: "info",
    body: {
      es: "Evita incluir datos íntimos o identificadores innecesarios en texto libre. La clasificación inicial debe recoger señales, no una declaración completa.",
      en: "Avoid including intimate data or unnecessary identifiers in free text. The initial classification should capture signals, not a full statement.",
    },
    privacyClassification: "none",
  },
  {
    id: "snippet.credentials.rotate_access",
    version: "1.0.0",
    kind: "operational_instruction",
    severity: "warning",
    body: {
      es: "Si sospechas que alguien conoce tus contraseñas, no improvises: prioriza recuperación de cuentas, MFA y registro de cambios realizados.",
      en: "If you suspect someone knows your passwords, do not improvise: prioritize account recovery, MFA and a record of changes made.",
    },
    appliesWhen: [
      {
        field: "risk.credential_compromise",
        operator: "equals",
        value: true,
      },
    ],
    privacyClassification: "none",
  },
] as const;

export const WIZARD_QUESTIONS: readonly QuestionContract[] = [
  {
    id: "q.context.client_profile",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "single_choice",
    canonicalKey: "clientProfile",
    required: true,
    title: {
      es: "Situación actual",
      en: "Current situation",
    },
    description: {
      es: "Define desde qué posición llega el caso.",
      en: "Define the position from which the case arrives.",
    },
    options: [
      {
        id: "client.private_individual",
        value: "private_individual",
        label: {
          es: "Particular afectado directamente",
          en: "Directly affected individual",
        },
        signalMapping: {
          signals: ["routing.private_case"],
        },
      },
      {
        id: "client.family_inheritance_conflict",
        value: "family_inheritance_conflict",
        label: {
          es: "Conflicto familiar / herencia",
          en: "Family conflict / inheritance",
        },
        signalMapping: {
          signals: ["routing.family_dispute"],
        },
      },
      {
        id: "client.legal_professional",
        value: "legal_professional",
        label: {
          es: "Abogado / despacho legal",
          en: "Lawyer / legal firm",
        },
        signalMapping: {
          signals: ["routing.legal_professional", "legal.derivation_candidate"],
        },
      },
      {
        id: "client.court_related",
        value: "court_related",
        label: {
          es: "Procedimiento judicial en curso",
          en: "Ongoing court proceedings",
        },
        signalMapping: {
          signals: ["routing.court_related", "legal.derivation_candidate"],
        },
      },
      {
        id: "client.other",
        value: "other",
        label: {
          es: "Otro contexto",
          en: "Other context",
        },
      },
    ],
    snippets: [
      {
        snippetId: "snippet.boundary.not_legal_advice",
      },
    ],
    emits: answerEvents,
    privacy: noPiiAnalytics,
  },
  {
    id: "q.context.urgency",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "single_choice",
    canonicalKey: "urgency",
    required: true,
    title: {
      es: "Nivel de urgencia",
      en: "Urgency level",
    },
    options: [
      {
        id: "urgency.informational",
        value: "informational",
        label: {
          es: "Consulta informativa / preventiva",
          en: "Informational / preventive inquiry",
        },
        signalMapping: {
          riskLevel: "low",
        },
      },
      {
        id: "urgency.time_sensitive",
        value: "time_sensitive",
        label: {
          es: "Riesgo de pérdida de pruebas o datos",
          en: "Risk of evidence or data loss",
        },
        signalMapping: {
          signals: ["risk.time_sensitive", "risk.evidence_volatility"],
          riskLevel: "medium",
        },
      },
      {
        id: "urgency.legal_risk",
        value: "legal_risk",
        label: {
          es: "Riesgo legal inmediato",
          en: "Immediate legal risk",
        },
        signalMapping: {
          signals: ["risk.legal", "legal.derivation_candidate"],
          riskLevel: "high",
        },
      },
      {
        id: "urgency.critical",
        value: "critical",
        label: {
          es: "Situación crítica",
          en: "Critical situation",
        },
        signalMapping: {
          signals: ["risk.critical"],
          riskLevel: "imminent",
        },
      },
    ],
    snippets: [
      {
        snippetId: "snippet.evidence.do_not_modify_originals",
        showWhen: [
          {
            field: "risk.evidence_volatility",
            operator: "equals",
            value: true,
          },
        ],
      },
    ],
    emits: answerEvents,
    privacy: noPiiAnalytics,
  },
  {
    id: "q.risk.physical_safety",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "boolean",
    canonicalKey: "physicalSafetyRisk",
    required: false,
    title: {
      es: "Integridad física",
      en: "Physical safety",
    },
    helper: {
      es: "Marca solo si existe una amenaza real o riesgo inmediato.",
      en: "Mark only when there is a real threat or immediate risk.",
    },
    signalMapping: {
      signals: ["risk.physical_safety"],
      riskLevel: "imminent",
    },
    snippets: [
      {
        snippetId: "snippet.risk.physical_safety",
      },
    ],
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.risk.financial_assets",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "boolean",
    canonicalKey: "financialAssetRisk",
    required: false,
    title: {
      es: "Activos financieros",
      en: "Financial assets",
    },
    signalMapping: {
      signals: ["risk.financial_asset"],
      riskLevel: "high",
    },
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.risk.credentials",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "boolean",
    canonicalKey: "attackerHasPasswords",
    required: false,
    title: {
      es: "Credenciales comprometidas",
      en: "Compromised credentials",
    },
    signalMapping: {
      signals: ["risk.credential_compromise"],
      exposureState: "active",
    },
    snippets: [
      {
        snippetId: "snippet.credentials.rotate_access",
      },
    ],
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.evidence.volatility",
    version: "1.0.0",
    phase: "TRIAGE",
    kind: "boolean",
    canonicalKey: "evidenceIsAutoDeleted",
    required: false,
    title: {
      es: "Volatilidad de pruebas",
      en: "Evidence volatility",
    },
    signalMapping: {
      signals: ["risk.evidence_volatility"],
      exposureState: "active",
    },
    snippets: [
      {
        snippetId: "snippet.evidence.do_not_modify_originals",
      },
    ],
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.cognitive.emotional_distress",
    version: "1.0.0",
    phase: "COGNITIVE",
    kind: "boolean",
    canonicalKey: "hasEmotionalDistress",
    required: false,
    title: {
      es: "Carga emocional",
      en: "Emotional distress",
    },
    helper: {
      es: "Marca si la situación está generando bloqueo, ansiedad intensa o dificultad para ordenar los hechos.",
      en: "Mark this if the situation is causing blockage, intense anxiety or difficulty ordering the facts.",
    },
    signalMapping: {
      signals: ["risk.emotional_distress"],
    },
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.cognitive.information_verifiable",
    version: "1.0.0",
    phase: "COGNITIVE",
    kind: "boolean",
    canonicalKey: "isVerifiable",
    required: false,
    title: {
      es: "Información verificable",
      en: "Verifiable information",
    },
    helper: {
      es: "Indica si existen hechos, archivos, mensajes, fechas o soportes concretos que puedan revisarse técnicamente.",
      en: "Indicate whether there are facts, files, messages, dates or concrete sources that can be technically reviewed.",
    },
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.context.data_sensitivity",
    version: "1.0.0",
    phase: "CONTEXT",
    kind: "single_choice",
    canonicalKey: "dataSensitivityLevel",
    required: false,
    title: {
      es: "Sensibilidad de los datos",
      en: "Data sensitivity",
    },
    options: [
      {
        id: "sensitivity.low",
        value: "low",
        label: {
          es: "Baja",
          en: "Low",
        },
      },
      {
        id: "sensitivity.medium",
        value: "medium",
        label: {
          es: "Media",
          en: "Medium",
        },
        signalMapping: {
          signals: ["privacy.personal_data"],
        },
      },
      {
        id: "sensitivity.high",
        value: "high",
        label: {
          es: "Alta",
          en: "High",
        },
        signalMapping: {
          signals: ["privacy.high_sensitivity"],
          riskLevel: "high",
        },
      },
    ],
    snippets: [
      {
        snippetId: "snippet.privacy.data_minimization",
      },
    ],
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.context.incident_start",
    version: "1.0.0",
    phase: "CONTEXT",
    kind: "single_choice",
    canonicalKey: "estimatedIncidentStart",
    required: false,
    title: {
      es: "Inicio estimado",
      en: "Estimated start",
    },
    options: [
      {
        id: "start.unknown",
        value: "unknown",
        label: {
          es: "No lo sé",
          en: "I don't know",
        },
      },
      {
        id: "start.recent",
        value: "recent",
        label: {
          es: "Reciente",
          en: "Recent",
        },
      },
      {
        id: "start.weeks",
        value: "weeks",
        label: {
          es: "Semanas",
          en: "Weeks",
        },
        signalMapping: {
          signals: ["exposure.potential"],
        },
      },
      {
        id: "start.months",
        value: "months",
        label: {
          es: "Meses o más",
          en: "Months or more",
        },
        signalMapping: {
          signals: ["exposure.potential"],
        },
      },
    ],
    emits: answerEvents,
    privacy: noPiiAnalytics,
  },
  {
    id: "q.details.incident_summary",
    version: "1.0.0",
    phase: "DETAILS",
    kind: "text",
    canonicalKey: "incident",
    required: false,
    title: {
      es: "Resumen del incidente",
      en: "Incident summary",
    },
    helper: {
      es: "Evita nombres completos, DNI, direcciones o datos íntimos en esta fase inicial.",
      en: "Avoid full names, IDs, addresses or intimate data at this initial stage.",
    },
    validation: {
      maxLength: 1200,
    },
    snippets: [
      {
        snippetId: "snippet.privacy.data_minimization",
      },
    ],
    emits: [
      {
        name: "WizardQuestionAnswered",
        trigger: "on_answer",
        includeAnswer: false,
        includeSignals: true,
      },
    ],
    privacy: freeTextPersonalNoAnalytics,
  },
  {
    id: "q.details.evidence_sources",
    version: "1.0.0",
    phase: "DETAILS",
    kind: "multi_choice",
    canonicalKey: "evidenceSources",
    required: false,
    title: {
      es: "Fuentes de evidencia",
      en: "Evidence sources",
    },
    options: [
      {
        id: "evidence.phone_device",
        value: "phone_device",
        label: {
          es: "Teléfono móvil",
          en: "Mobile phone",
        },
        signalMapping: {
          signals: ["evidence.full_device"],
          evidenceLevel: "full_device",
        },
      },
      {
        id: "evidence.computer_device",
        value: "computer_device",
        label: {
          es: "Ordenador / portátil",
          en: "Computer / laptop",
        },
        signalMapping: {
          signals: ["evidence.full_device"],
          evidenceLevel: "full_device",
        },
      },
      {
        id: "evidence.screenshots",
        value: "screenshots",
        label: {
          es: "Capturas de pantalla",
          en: "Screenshots",
        },
        signalMapping: {
          signals: ["evidence.screenshots"],
          evidenceLevel: "screenshots",
        },
      },
      {
        id: "evidence.messages",
        value: "messages",
        label: {
          es: "Mensajería / WhatsApp / SMS",
          en: "Messaging / WhatsApp / SMS",
        },
        signalMapping: {
          signals: ["evidence.messages_only"],
          evidenceLevel: "messages_only",
        },
      },
      {
        id: "evidence.email",
        value: "email",
        label: {
          es: "Correo electrónico",
          en: "Email",
        },
        signalMapping: {
          signals: ["evidence.messages_only"],
          evidenceLevel: "messages_only",
        },
      },
      {
        id: "evidence.mixed",
        value: "mixed",
        label: {
          es: "Varias fuentes",
          en: "Mixed sources",
        },
        signalMapping: {
          signals: ["evidence.mixed"],
          evidenceLevel: "mixed",
        },
      },
    ],
    snippets: [
      {
        snippetId: "snippet.evidence.do_not_modify_originals",
      },
    ],
    emits: answerEvents,
    privacy: sensitiveNoAnalytics,
  },
  {
    id: "q.details.objective",
    version: "1.0.0",
    phase: "DETAILS",
    kind: "single_choice",
    canonicalKey: "objective",
    required: false,
    title: {
      es: "Objetivo principal",
      en: "Main objective",
    },
    options: [
      {
        id: "objective.document",
        value: "document",
        label: {
          es: "Documentar técnicamente",
          en: "Technical documentation",
        },
      },
      {
        id: "objective.preserve",
        value: "preserve",
        label: {
          es: "Preservar evidencia",
          en: "Preserve evidence",
        },
        signalMapping: {
          signals: ["risk.evidence_volatility"],
        },
      },
      {
        id: "objective.legal_derivation",
        value: "legal_derivation",
        label: {
          es: "Preparar derivación legal",
          en: "Prepare legal derivation",
        },
        signalMapping: {
          signals: ["legal.derivation_candidate"],
        },
      },
      {
        id: "objective.prevention",
        value: "prevention",
        label: {
          es: "Prevención / contención",
          en: "Prevention / containment",
        },
        signalMapping: {
          signals: ["exposure.contained"],
          exposureState: "contained",
        },
      },
    ],
    emits: answerEvents,
    privacy: noPiiAnalytics,
  },
] as const;

export const canonicalWizardV1 = {
  id: WIZARD_CONTRACT_ID,
  version: WIZARD_CONTRACT_VERSION,
  locales: WIZARD_LOCALES,
  phases: WIZARD_PHASES,
  questions: WIZARD_QUESTIONS,
  snippets: WIZARD_SNIPPETS,
  events: WIZARD_EVENTS,
  signals: CANONICAL_SIGNALS,
} as const;

export type CanonicalWizardV1 = typeof canonicalWizardV1;

export function getKnownWizardEventNames(): readonly WizardEventName[] {
  return WIZARD_EVENTS.map((event) => event.name);
}
