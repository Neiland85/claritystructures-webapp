import { NextResponse } from 'next/server';

import {
  createSubmitIntakeUseCase,
  type AuditTrail,
  type IntakeRepository,
  type Notifier,
} from '@/application/intake/submit-intake.usecase';
import {
  decideIntake,
  type SubmitIntakePayload,
} from '@/application/intake/decide-intake';
import { createIntakeSubmissionEmailNotifier } from '@/infra/mail/intake-submission-email-notifier';

export const runtime = 'nodejs';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isSubmitIntakePayload(value: unknown): value is SubmitIntakePayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isString(candidate.clientProfile) &&
    isString(candidate.urgency) &&
    (candidate.hasEmotionalDistress === undefined || isBoolean(candidate.hasEmotionalDistress)) &&
    isString(candidate.incident) &&
    isNumber(candidate.devices) &&
    isStringArray(candidate.actionsTaken) &&
    isStringArray(candidate.evidenceSources) &&
    isString(candidate.objective) &&
    isString(candidate.email) &&
    (candidate.phone === undefined || isString(candidate.phone)) &&
    isString(candidate.message) &&
    isBoolean(candidate.consent)
  );
}

const intakeRepository: IntakeRepository<SubmitIntakePayload> = {
  async save(record) {
    // Example persistence adapter.
    // Replace with Prisma/DB write.
    console.info('[INTAKE_SAVE]', record);
    return { id: crypto.randomUUID() };
  },
};

let emailNotifier: Notifier<SubmitIntakePayload> | undefined;

const notifier: Notifier<SubmitIntakePayload> = {
  async intakeSubmitted(event) {
    if (!emailNotifier) {
      emailNotifier = createIntakeSubmissionEmailNotifier();
    }

    await emailNotifier.intakeSubmitted(event);
  },
};

const auditTrail: AuditTrail<SubmitIntakePayload> = {
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
    const payload = await request.json();

    if (!isSubmitIntakePayload(payload)) {
      return NextResponse.json({ message: 'Invalid intake payload' }, { status: 400 });
    }

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
