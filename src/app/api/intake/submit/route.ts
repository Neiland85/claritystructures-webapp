import { NextResponse } from 'next/server';

import { buildIntakeSubmitHandler } from '@/application/intake/intake-submit';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const submitHandler = buildIntakeSubmitHandler({
  saveIntake: async (input) => {
    const saved = await prisma.intake.create({
      data: {
        wizardResult: input.wizardResult,
        decision: input.decision,
        explanation: input.explanation,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        needsReview: false,
      },
    });
    return { id: saved.id };
  },
  notify: async (input) => {
    // Best-effort notification - logs failure instead of throwing
    try {
      console.info('[INTAKE_NOTIFY]', {
        intakeId: input.intakeId,
        urgency: input.urgency,
        adminUrl: input.adminUrl,
      });
    } catch (notifyError) {
      console.error('[INTAKE_NOTIFY_ERROR]', notifyError);
    }
  },
  logger: console,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitHandler(body);

    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  } catch (error) {
    console.error('[INTAKE_SUBMIT_ERROR]', error);
    return NextResponse.json(
      { message: 'Unable to submit intake' },
      { status: 500 }
    );
  }
}
