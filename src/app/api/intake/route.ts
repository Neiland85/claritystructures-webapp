import { NextResponse } from 'next/server';

import { assessIntake } from '@/domain/priority';
import { resolveIntakeRoute } from '@/domain/flow';
import {
  createSubmitIntakeUseCase,
  type AuditTrail,
  type IntakeDecision,
  type IntakeRepository,
  type Notifier,
} from '@/application/intake/submit-intake.usecase';
import type { WizardResult } from '@/types/wizard';

export const runtime = 'nodejs';

type SubmitIntakePayload = WizardResult & {
  email: string;
  message: string;
  consent: boolean;
};

type SubmitIntakeDecision = IntakeDecision & {
  priority: string;
  flags: string[];
  recommendedAction: string;
};

const decideIntake = (payload: SubmitIntakePayload): SubmitIntakeDecision => {
  const assessment = assessIntake(payload);

  return {
    nextRoute: resolveIntakeRoute(payload),
    priority: assessment.priority,
    flags: assessment.flags,
    recommendedAction: assessment.recommendedAction,
  };
};

const intakeRepository: IntakeRepository<SubmitIntakePayload, SubmitIntakeDecision> = {
  async save(record) {
    // Example persistence adapter.
    // Replace with Prisma/DB write.
    console.info('[INTAKE_SAVE]', record);
    return { id: crypto.randomUUID() };
  },
};

const notifier: Notifier<SubmitIntakePayload, SubmitIntakeDecision> = {
  async intakeSubmitted(event) {
    // Example notifier adapter.
    // Replace with email/queue integration.
    console.info('[INTAKE_NOTIFY]', event.intakeId);
  },
};

const auditTrail: AuditTrail<SubmitIntakePayload, SubmitIntakeDecision> = {
  async record(entry) {
    // Example audit adapter.
    // Replace with append-only audit store.
    console.info('[INTAKE_AUDIT]', entry.action, entry.intakeId);
  },
};

const submitIntake = createSubmitIntakeUseCase({
  decideIntake,
  intakeRepository,
  notifier,
  auditTrail,
});

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SubmitIntakePayload;

    const result = await submitIntake({
      payload,
      requestedBy: 'api:intake',
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[SUBMIT_INTAKE_ERROR]', error);
    return NextResponse.json({ message: 'Unable to submit intake' }, { status: 500 });
  }
}
