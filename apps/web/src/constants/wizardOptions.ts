import type { ClientProfile, UrgencyLevel } from "@claritystructures/domain";

export const clientProfiles: {
  value: ClientProfile;
  label: string;
  description?: string;
}[] = [
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
];

export const urgencyLevels: {
  value: UrgencyLevel;
  label: string;
}[] = [
  {
    value: "informational",
    label: "Consulta informativa / preventiva",
  },
  {
    value: "time_sensitive",
    label: "Riesgo de pérdida de pruebas o datos",
  },
  {
    value: "legal_risk",
    label: "Riesgo legal inmediato",
  },
  {
    value: "critical",
    label: "Situación crítica (impacto legal o emocional grave)",
  },
];

export const dataSensitivityLevels: {
  value: "low" | "medium" | "high";
  label: string;
  description: string;
}[] = [
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
];

export const estimatedIncidentStarts: {
  value: "unknown" | "recent" | "weeks" | "months";
  label: string;
}[] = [
  { value: "unknown", label: "No lo sé" },
  { value: "recent", label: "Reciente (días)" },
  { value: "weeks", label: "Semanas" },
  { value: "months", label: "Meses o más" },
];
