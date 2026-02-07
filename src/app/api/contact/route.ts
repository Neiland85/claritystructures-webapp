import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, context } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Clarity Structures Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'New contact request — Clarity Structures',
      text: `
Name: ${name || '-'}
Email: ${email}

Message:
${message}

Context:
${context || '-'}
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('CONTACT_API_ERROR', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
