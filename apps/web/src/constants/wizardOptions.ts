import type { ClientProfile, UrgencyLevel } from "@claritystructures/domain";
import type { Lang } from "@/components/LanguageProvider";

type ProfileOption = {
  value: ClientProfile;
  label: string;
  description?: string;
};

type UrgencyOption = {
  value: UrgencyLevel;
  label: string;
};

type SensitivityOption = {
  value: "low" | "medium" | "high";
  label: string;
  description: string;
};

type IncidentStartOption = {
  value: "unknown" | "recent" | "weeks" | "months";
  label: string;
};

type IncidentTypeOption = {
  value: string;
  label: string;
};

type DeviceCountOption = {
  value: number;
  label: string;
};

type EvidenceSourceOption = {
  value: string;
  label: string;
};

type ActionTakenOption = {
  value: string;
  label: string;
};

type ObjectiveOption = {
  value: string;
  label: string;
};

const clientProfileLabels: Record<Lang, ProfileOption[]> = {
  es: [
    {
      value: "private_individual",
      label: "Particular afectado directamente",
      description: "Soy la persona perjudicada",
    },
    {
      value: "family_inheritance_conflict",
      label: "Conflicto familiar / herencia",
      description:
        "Disputas entre familiares, posible ocultación o borrado de pruebas",
    },
    {
      value: "legal_professional",
      label: "Abogado / despacho legal",
      description: "Actúo en representación de un cliente",
    },
    {
      value: "court_related",
      label: "Procedimiento judicial en curso",
      description: "Juzgado, fiscalía o medidas ya iniciadas",
    },
    {
      value: "other",
      label: "Otro contexto",
    },
  ],
  en: [
    {
      value: "private_individual",
      label: "Directly affected individual",
      description: "I am the person harmed",
    },
    {
      value: "family_inheritance_conflict",
      label: "Family conflict / inheritance",
      description:
        "Family disputes, possible concealment or deletion of evidence",
    },
    {
      value: "legal_professional",
      label: "Lawyer / legal firm",
      description: "I am acting on behalf of a client",
    },
    {
      value: "court_related",
      label: "Ongoing court proceedings",
      description: "Court, prosecution or measures already initiated",
    },
    {
      value: "other",
      label: "Other context",
    },
  ],
};

const urgencyLevelLabels: Record<Lang, UrgencyOption[]> = {
  es: [
    { value: "informational", label: "Consulta informativa / preventiva" },
    {
      value: "time_sensitive",
      label: "Riesgo de pérdida de pruebas o datos",
    },
    { value: "legal_risk", label: "Riesgo legal inmediato" },
    {
      value: "critical",
      label: "Situación crítica (impacto legal o emocional grave)",
    },
  ],
  en: [
    { value: "informational", label: "Informational / preventive inquiry" },
    { value: "time_sensitive", label: "Risk of evidence or data loss" },
    { value: "legal_risk", label: "Immediate legal risk" },
    {
      value: "critical",
      label: "Critical situation (severe legal or emotional impact)",
    },
  ],
};

const dataSensitivityLabels: Record<Lang, SensitivityOption[]> = {
  es: [
    { value: "low", label: "Baja", description: "Datos generales" },
    {
      value: "medium",
      label: "Media",
      description: "Datos personales identificables",
    },
    {
      value: "high",
      label: "Alta",
      description: "Datos íntimos, financieros o médicos",
    },
  ],
  en: [
    { value: "low", label: "Low", description: "General data" },
    {
      value: "medium",
      label: "Medium",
      description: "Personally identifiable data",
    },
    {
      value: "high",
      label: "High",
      description: "Intimate, financial or medical data",
    },
  ],
};

const estimatedIncidentStartLabels: Record<Lang, IncidentStartOption[]> = {
  es: [
    { value: "unknown", label: "No lo sé" },
    { value: "recent", label: "Reciente (días)" },
    { value: "weeks", label: "Semanas" },
    { value: "months", label: "Meses o más" },
  ],
  en: [
    { value: "unknown", label: "I don't know" },
    { value: "recent", label: "Recent (days)" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months or more" },
  ],
};

export function getClientProfiles(lang: Lang): ProfileOption[] {
  return clientProfileLabels[lang];
}

export function getUrgencyLevels(lang: Lang): UrgencyOption[] {
  return urgencyLevelLabels[lang];
}

export function getDataSensitivityLevels(lang: Lang): SensitivityOption[] {
  return dataSensitivityLabels[lang];
}

export function getEstimatedIncidentStarts(lang: Lang): IncidentStartOption[] {
  return estimatedIncidentStartLabels[lang];
}

// --- DETAILS phase options ---
// Values are designed to match keyword patterns in map-wizard-to-signals.ts

const incidentTypeLabels: Record<Lang, IncidentTypeOption[]> = {
  es: [
    { value: "harassment", label: "Acoso / hostigamiento" },
    { value: "stalking", label: "Stalking / persecución" },
    { value: "financial_fraud", label: "Fraude financiero" },
    { value: "identity_theft", label: "Suplantación de identidad" },
    { value: "data_breach", label: "Filtración de datos" },
    { value: "unauthorized_access", label: "Acceso no autorizado" },
    { value: "family_dispute", label: "Conflicto familiar" },
    { value: "other", label: "Otro" },
  ],
  en: [
    { value: "harassment", label: "Harassment" },
    { value: "stalking", label: "Stalking / persecution" },
    { value: "financial_fraud", label: "Financial fraud" },
    { value: "identity_theft", label: "Identity theft" },
    { value: "data_breach", label: "Data breach" },
    { value: "unauthorized_access", label: "Unauthorized access" },
    { value: "family_dispute", label: "Family dispute" },
    { value: "other", label: "Other" },
  ],
};

const deviceCountLabels: Record<Lang, DeviceCountOption[]> = {
  es: [
    { value: 0, label: "Ninguno" },
    { value: 1, label: "1 dispositivo" },
    { value: 2, label: "2 dispositivos" },
    { value: 3, label: "3 o más" },
  ],
  en: [
    { value: 0, label: "None" },
    { value: 1, label: "1 device" },
    { value: 2, label: "2 devices" },
    { value: 3, label: "3 or more" },
  ],
};

// Values contain keywords that map-wizard-to-signals.ts matches:
// "phone" → full_device, "screenshot" → screenshots, "whatsapp"/"email" → messages_only
const evidenceSourceLabels: Record<Lang, EvidenceSourceOption[]> = {
  es: [
    { value: "phone device", label: "Teléfono móvil" },
    { value: "computer laptop", label: "Ordenador / portátil" },
    { value: "tablet device", label: "Tablet" },
    { value: "screenshot screen capture", label: "Capturas de pantalla" },
    { value: "whatsapp chat", label: "WhatsApp / mensajería" },
    { value: "email message", label: "Correos electrónicos" },
    { value: "sms message", label: "SMS / mensajes de texto" },
    { value: "forensic device", label: "Informe forense previo" },
  ],
  en: [
    { value: "phone device", label: "Mobile phone" },
    { value: "computer laptop", label: "Computer / laptop" },
    { value: "tablet device", label: "Tablet" },
    { value: "screenshot screen capture", label: "Screenshots" },
    { value: "whatsapp chat", label: "WhatsApp / messaging" },
    { value: "email message", label: "Emails" },
    { value: "sms message", label: "SMS / text messages" },
    { value: "forensic device", label: "Previous forensic report" },
  ],
};

// Values contain keywords that map-wizard-to-signals.ts matches:
// "secured"/"blocked"/"reset" → contained, "report"/"escalate" → active, "monitor"/"review" → potential
const actionTakenLabels: Record<Lang, ActionTakenOption[]> = {
  es: [
    { value: "secured contained blocked", label: "Aseguré / bloqueé accesos" },
    { value: "reset passwords", label: "Cambié contraseñas" },
    { value: "report escalate", label: "Denuncié / informé" },
    { value: "monitor review collect", label: "Recopilé / monitoricé" },
    { value: "contact authority", label: "Contacté autoridades" },
    { value: "nothing", label: "No hice nada aún" },
  ],
  en: [
    { value: "secured contained blocked", label: "Secured / blocked access" },
    { value: "reset passwords", label: "Changed passwords" },
    { value: "report escalate", label: "Reported / escalated" },
    { value: "monitor review collect", label: "Collected / monitored" },
    { value: "contact authority", label: "Contacted authorities" },
    { value: "nothing", label: "Nothing yet" },
  ],
};

// Values match map-wizard-to-signals.ts objective matching:
// includes("prevent") → contained exposure state
const objectiveLabels: Record<Lang, ObjectiveOption[]> = {
  es: [
    { value: "document", label: "Documentar / preservar pruebas" },
    { value: "prevent", label: "Prevenir daño futuro" },
    { value: "legal_action", label: "Iniciar acción legal" },
    { value: "understand", label: "Entender qué ocurrió" },
    { value: "recover", label: "Recuperar datos / acceso" },
  ],
  en: [
    { value: "document", label: "Document / preserve evidence" },
    { value: "prevent", label: "Prevent future harm" },
    { value: "legal_action", label: "Initiate legal action" },
    { value: "understand", label: "Understand what happened" },
    { value: "recover", label: "Recover data / access" },
  ],
};

export function getIncidentTypes(lang: Lang): IncidentTypeOption[] {
  return incidentTypeLabels[lang];
}

export function getDeviceCounts(lang: Lang): DeviceCountOption[] {
  return deviceCountLabels[lang];
}

export function getEvidenceSources(lang: Lang): EvidenceSourceOption[] {
  return evidenceSourceLabels[lang];
}

export function getActionsTaken(lang: Lang): ActionTakenOption[] {
  return actionTakenLabels[lang];
}

export function getObjectives(lang: Lang): ObjectiveOption[] {
  return objectiveLabels[lang];
}
