import { NextResponse } from 'next/server';

import {
  createSubmitIntakeUseCase,
  type AuditTrail,
  type IntakeRepository,
  type Notifier
} from '@/application/intake/submit-intake.usecase';

import type { ContactIntakeInput } from '@claritystructures/domain';
import { decideIntake } from '@claritystructures/domain';

export const runtime = 'nodejs';
