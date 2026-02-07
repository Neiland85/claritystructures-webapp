import type { WizardResult } from '@/types/wizard';

export type IntakeRoute =
  | 'basic'
  | 'family'
  | 'legal'
  | 'critical';

export function resolveIntakeRoute(result: WizardResult): IntakeRoute {
  // CRÍTICO: riesgo legal o emocional grave
  if (result.urgency === 'critical') {
    return 'critical';
  }

  // Conflictos familiares / herencias
  if (result.clientProfile === 'family_inheritance_conflict') {
    return 'family';
  }

  // Abogados o procesos judiciales
  if (
    result.clientProfile === 'legal_professional' ||
    result.clientProfile === 'court_related'
  ) {
    return 'legal';
  }

  // Resto de casos
  return 'basic';
}
