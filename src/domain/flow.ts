import type { WizardResult } from '@/types/wizard';

import type { IntakeTone } from './intake-records';

export const INTAKE_ROUTE_BY_TONE: Record<IntakeTone, string> = {
  basic: '/contact/basic',
  family: '/contact/family',
  legal: '/contact/legal',
  critical: '/contact/critical',
};

/**
 * Canonical intake routing.
 * Returns a path segment WITHOUT the language prefix.
 */
export function resolveIntakeRoute(result: WizardResult): string {
  // Highest priority: critical urgency
  if (result.urgency === 'critical') {
    return INTAKE_ROUTE_BY_TONE.critical;
  }

  // Family / inheritance conflicts
  if (result.clientProfile === 'family_inheritance_conflict') {
    return INTAKE_ROUTE_BY_TONE.family;
  }

  // Legal / court-related cases
  if (
    result.clientProfile === 'legal_professional' ||
    result.clientProfile === 'court_related'
  ) {
    return INTAKE_ROUTE_BY_TONE.legal;
  }

  // Default safe route
  return INTAKE_ROUTE_BY_TONE.basic;
}
