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
