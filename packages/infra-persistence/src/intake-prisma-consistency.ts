import type {
  IntakePriority,
  IntakeStatus,
  IntakeTone,
} from "@claritystructures/domain";

import {
  IntakeTone as PrismaIntakeTone,
  IntakePriority as PrismaIntakePriority,
  IntakeStatus as PrismaIntakeStatus,
} from "../generated/prisma/index";

/**
 * Compile-time consistency check: Domain enums ↔ Prisma enums.
 *
 * Now that the Prisma schema uses native enums aligned with the domain,
 * we verify both directions at the type level — no runtime cost.
 */

// Domain → Prisma mapping (compile error if values diverge)
const toneDomainToPrisma: Record<IntakeTone, PrismaIntakeTone> = {
  basic: PrismaIntakeTone.basic,
  family: PrismaIntakeTone.family,
  legal: PrismaIntakeTone.legal,
  critical: PrismaIntakeTone.critical,
};

const priorityDomainToPrisma: Record<IntakePriority, PrismaIntakePriority> = {
  low: PrismaIntakePriority.low,
  medium: PrismaIntakePriority.medium,
  high: PrismaIntakePriority.high,
  critical: PrismaIntakePriority.critical,
};

const statusDomainToPrisma: Record<IntakeStatus, PrismaIntakeStatus> = {
  pending: PrismaIntakeStatus.pending,
  accepted: PrismaIntakeStatus.accepted,
  rejected: PrismaIntakeStatus.rejected,
};

// Helper to ensure exhaustive mapping
type AssertKeys<T, U> = T extends U ? (U extends T ? true : never) : never;

// Compile-time check: Ensure Domain Enum keys match mapped keys
type _CheckTone = AssertKeys<IntakeTone, keyof typeof toneDomainToPrisma>;
type _CheckPriority = AssertKeys<
  IntakePriority,
  keyof typeof priorityDomainToPrisma
>;
type _CheckStatus = AssertKeys<IntakeStatus, keyof typeof statusDomainToPrisma>;

// Runtime check: Verify values actually match (bidirectional)
const verifyBidirectionalMapping = <
  DomainKey extends string,
  PrismaValue extends string,
>(
  mapping: Record<DomainKey, PrismaValue>,
  domainName: string,
) => {
  const domainValues = new Set(Object.keys(mapping));
  const prismaValues = new Set(Object.values(mapping));

  if (domainValues.size !== prismaValues.size) {
    throw new Error(
      `[Consistency] ${domainName} mapping is not 1:1. Domain: ${domainValues.size}, Prisma: ${prismaValues.size}`,
    );
  }
};

// Execute checks
verifyBidirectionalMapping(toneDomainToPrisma, "IntakeTone");
verifyBidirectionalMapping(priorityDomainToPrisma, "IntakePriority");
verifyBidirectionalMapping(statusDomainToPrisma, "IntakeStatus");
