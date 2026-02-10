import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import type { WizardResult } from '@/types/wizard';
import type { IntakeTone } from '@/domain/intake-records';
import { assessIntake as assessPriorityIntake } from '@/domain/priority';

export const runtime = 'nodejs';

type ContactPayload = WizardResult & {
  email: string;
  message: string;
  tone: IntakeTone;
  consent: boolean;
  consentVersion: 'v1';
};

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse body ONCE
    const body = (await req.json()) as ContactPayload;

    // 2️⃣ Internal assessment (NOT exposed)
    const assessment = assessPriorityIntake(body);

    // 3️⃣ Prepare email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4️⃣ Build internal email
    const subject = `[${assessment.priority.toUpperCase()}] New intake received`;

    const text = `
--- Intake ---
Tone: ${body.tone}
Email: ${body.email}

--- Context ---
Client profile: ${body.clientProfile}
Urgency: ${body.urgency}
Emotional distress: ${body.hasEmotionalDistress ? 'YES' : 'NO'}

--- Assessment ---
Priority: ${assessment.priority}
Flags: ${assessment.flags.join(', ') || 'none'}
Recommended action: ${assessment.recommendedAction}

--- Message ---
${body.message}
    `.trim();

    await transporter.sendMail({
      from: 'Clarity Structures <no-reply@claritystructures.com>',
      to: process.env.CONTACT_EMAIL,
      subject,
      text,
    });

    // 5️⃣ Response to client (no internal data leaked)
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
