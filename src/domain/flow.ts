import type { WizardResult } from '@/types/wizard';

export function resolveIntakeRoute(result: WizardResult): string {
  if (result.urgency === 'critical') return '/contact/critical';

  if (result.clientProfile === 'family_inheritance_conflict') {
    return '/contact/family';
  }

  if (
    result.clientProfile === 'court_related' ||
    result.clientProfile === 'legal_professional'
  ) {
    return '/contact/legal';
  }

  return '/contact/basic';
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
