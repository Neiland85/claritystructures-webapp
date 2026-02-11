import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { buildIntakeSubmitHandler } from '@/application/intake/intake-submit';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function makeNotifierTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function defaultNotify(input: {
  intakeId: string;
  contactEmail: string;
  urgency: string;
  adminUrl: string;
}): Promise<void> {
  const recipient = process.env.INTAKE_NOTIFICATION_EMAIL;

  if (!recipient) {
    return;
  }

  const transporter = makeNotifierTransport();

  await transporter.sendMail({
    from: process.env.INTAKE_FROM_EMAIL ?? 'no-reply@claritystructures.com',
    to: recipient,
    subject: '[Intake] New legal-tech submission',
    text: `New intake submitted.\n\nID: ${input.intakeId}\nContact: ${input.contactEmail}\nUrgency: ${input.urgency}\nReview: ${input.adminUrl}`,
  });
}

const submitIntake = buildIntakeSubmitHandler({
  saveIntake: async ({ wizardResult, decision, explanation, contactEmail, contactPhone }) =>
    prisma.intake.create({
      data: {
        wizardResult,
        decision,
        explanation,
        contactEmail,
        contactPhone,
      },
      select: { id: true },
    }),
  notify: defaultNotify,
  logger: console,
});

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await submitIntake(payload);

  return NextResponse.json({ message: result.message }, { status: result.status });
}
