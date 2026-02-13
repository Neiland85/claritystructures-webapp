import type {
  IntakePriority,
  IntakeStatus,
  IntakeTone,
} from "@claritystructures/domain";

import {
  IntakeTone as PrismaIntakeTone,
  IntakePriority as PrismaIntakePriority,
  IntakeStatus as PrismaIntakeStatus,
} from "../generated/prisma/client.js";

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

// Reverse check: ensure every Prisma value is covered
const _tonePrismaToDomain: Record<PrismaIntakeTone, IntakeTone> =
  toneDomainToPrisma as Record<PrismaIntakeTone, IntakeTone>;
const _priorityPrismaToDomain: Record<PrismaIntakePriority, IntakePriority> =
  priorityDomainToPrisma as Record<PrismaIntakePriority, IntakePriority>;
const _statusPrismaToDomain: Record<PrismaIntakeStatus, IntakeStatus> =
  statusDomainToPrisma as Record<PrismaIntakeStatus, IntakeStatus>;
