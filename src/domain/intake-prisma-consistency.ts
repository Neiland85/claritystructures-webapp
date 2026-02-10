import type {
  IntakePriority as PrismaIntakePriority,
  IntakeStatus as PrismaIntakeStatus,
  IntakeTone as PrismaIntakeTone,
} from '@prisma/client';

import {
  INTAKE_PRIORITIES,
  INTAKE_STATUSES,
  INTAKE_TONES,
  type IntakePriority,
  type IntakeStatus,
  type IntakeTone,
} from './intake-records';

const toneDomainToPrisma: Record<IntakeTone, PrismaIntakeTone> = {
  basic: 'basic',
  family: 'family',
  legal: 'legal',
  critical: 'critical',
};

const priorityDomainToPrisma: Record<IntakePriority, PrismaIntakePriority> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
};

const statusDomainToPrisma: Record<IntakeStatus, PrismaIntakeStatus> = {
  RECEIVED: 'RECEIVED',
  ALERT_QUEUED: 'ALERT_QUEUED',
  DONE: 'DONE',
};

const assertSameLiterals = <A extends string, B extends A>(
  _a: readonly A[],
  _b: readonly B[]
 ) => {
  void _a;
  void _b;
};

assertSameLiterals(
  INTAKE_TONES,
  Object.values(toneDomainToPrisma)
);

assertSameLiterals(
  INTAKE_PRIORITIES,
  Object.values(priorityDomainToPrisma)
);

assertSameLiterals(
  INTAKE_STATUSES,
  Object.values(statusDomainToPrisma)
);
