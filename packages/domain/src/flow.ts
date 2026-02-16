import type { WizardResult } from "./wizard-result";

import { decideIntake, INTAKE_ROUTE_BY_TONE } from "./decision";

export { INTAKE_ROUTE_BY_TONE };

/**
 * Canonical intake routing.
 * Returns a path segment WITHOUT the language prefix.
 */
export function resolveIntakeRoute(result: WizardResult): string {
  return decideIntake(result).route;
}
