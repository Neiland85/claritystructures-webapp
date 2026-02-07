import type { WizardResult } from '@/types/wizard';

export type IntakeFlow = 'A' | 'B' | 'C';

export function resolveFlow(result: WizardResult): IntakeFlow {
  if (
    result.clientProfile === 'legal_professional' ||
    result.clientProfile === 'court_related'
  ) {
    return 'B';
  }

  if (
    result.urgency === 'critical' ||
    result.clientProfile === 'family_inheritance_conflict'
  ) {
    return 'A';
  }

  return 'C';
}
