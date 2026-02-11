import { NextResponse } from 'next/server';

import { buildIntakeSubmitHandler } from '@/application/intake/intake-submit';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const submitHandler = buildIntakeSubmitHandler({
  async saveIntake(input) {
    const saved = await prisma.intake.create({
      data: {
        wizardResult: input.wizardResult,
        decision: input.decision,
        explanation: input.explanation,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
      },
    });
    return { id: saved.id };
  },
  async notify(input) {
    console.info('[INTAKE_NOTIFY]', {
      intakeId: input.intakeId,
      urgency: input.urgency,
      adminUrl: input.adminUrl,
    });
  },
  logger: console,
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await submitHandler(payload);

    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  } catch (error) {
    console.error('[INTAKE_SUBMIT_ERROR]', error);
    return NextResponse.json(
      { message: 'Unable to submit intake' },
      { status: 500 },
    );
  }
}
