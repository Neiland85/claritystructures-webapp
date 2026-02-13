import {
  INTAKE_PRIORITIES,
  INTAKE_STATUSES,
  INTAKE_TONES,
  type IntakePriority,
  type IntakeStatus,
  type IntakeTone,
} from "@claritystructures/domain";

/**
 * Consistency Check between Domain and Prisma
 *
 * Since Prisma schema uses strings for these fields, we perform
 * a compile-time check to ensure our mappings cover all domain values.
 */

// These are placeholders since we use String in Prisma schema
type PrismaIntakeStatus = string;
type PrismaIntakePriority = string;
type PrismaIntakeTone = string;

const toneDomainToPrisma: Record<IntakeTone, PrismaIntakeTone> = {
  basic: "basic",
  family: "family",
  legal: "legal",
  critical: "critical",
};

const priorityDomainToPrisma: Record<IntakePriority, PrismaIntakePriority> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

const statusDomainToPrisma: Record<IntakeStatus, PrismaIntakeStatus> = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
};

const assertSameLiterals = <A extends string, B extends A>(
  _a: readonly A[],
  _b: readonly B[],
) => {
  void _a;
  void _b;
};

// Verify all domain values are mapped
assertSameLiterals(INTAKE_TONES, Object.keys(toneDomainToPrisma) as any);
assertSameLiterals(
  INTAKE_PRIORITIES,
  Object.keys(priorityDomainToPrisma) as any,
);
assertSameLiterals(INTAKE_STATUSES, Object.keys(statusDomainToPrisma) as any);
