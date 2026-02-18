/**
 * Retention Policy — Pure Domain Constants and Rules
 *
 * Defines the data retention schedule for the legal-tech platform.
 * All durations are in months. No side effects.
 */

export const RETENTION_POLICY = {
  /** Raw intake + decision artifacts: 24 months */
  intake_data: 24,
  /** Security/audit logs: 36 months */
  audit_logs: 36,
  /** Unqualified/out-of-scope leads: 6 months */
  unqualified_leads: 6,
} as const;

export type RetentionCategory = keyof typeof RETENTION_POLICY;

/**
 * Compute the cutoff date for a given retention category.
 * Records older than this date are eligible for purge.
 */
export function computeRetentionCutoff(
  category: RetentionCategory,
  now?: Date,
): Date {
  const referenceDate = now ?? new Date();
  const months = RETENTION_POLICY[category];
  const cutoff = new Date(referenceDate);
  cutoff.setMonth(cutoff.getMonth() - months);
  return cutoff;
}

/**
 * Check if a record is eligible for purge based on its creation date.
 */
export function isEligibleForPurge(
  createdAt: Date,
  category: RetentionCategory,
  now?: Date,
): boolean {
  const cutoff = computeRetentionCutoff(category, now);
  return createdAt < cutoff;
}
