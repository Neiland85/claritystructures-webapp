import type { WizardResult } from '@/types/wizard';

/**
 * Canonical intake routing.
 * Returns a path segment WITHOUT the language prefix.
 */
export function resolveIntakeRoute(result: WizardResult): string {
  // Highest priority: critical urgency
  if (result.urgency === 'critical') {
    return '/contact/critical';
  }

  // Family / inheritance conflicts
  if (result.clientProfile === 'family_inheritance_conflict') {
    return '/contact/family';
  }

  // Legal / court-related cases
  if (
    result.clientProfile === 'legal_professional' ||
    result.clientProfile === 'court_related'
  ) {
    return '/contact/legal';
  }

  // Default safe route
  return '/contact/basic';
}
