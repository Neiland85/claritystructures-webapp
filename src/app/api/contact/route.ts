import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, message, context, acceptedLegal } = body;

  if (!acceptedLegal) {
    return NextResponse.json(
      { error: 'Legal acceptance required' },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL,
    to: process.env.CONTACT_EMAIL,
    subject: 'Nuevo contacto — Evidence Pack',
    text: `
Email: ${email}

Mensaje:
${message}

Contexto:
${context}
    `,
  });

  return NextResponse.json({ ok: true });
}

// Consent fields are expected:
// - consent: boolean
// - consentVersion: 'v1'
// - tone: 'basic' | 'family' | 'legal' | 'critical'

import { assessIntake } from '@/domain/priority';

// After parsing request body as WizardResult-compatible payload:
const assessment = assessIntake(body);

// assessment.priority
// assessment.flags
// assessment.recommendedAction
