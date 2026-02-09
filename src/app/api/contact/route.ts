import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { resolveIntakeRoute } from '@/domain/flow';
import type { IntakeTone } from '@/domain/intake-records';
import { assessIntake } from '@/domain/priority';
import { intakeRepository } from '@/infra/db/intake-repository';
import { hashSha256 } from '@/infra/db/hash';
import type { WizardResult } from '@/types/wizard';

export const runtime = 'nodejs';

type ContactPayload = Partial<WizardResult> & {
  email?: string;
  message?: string;
  tone?: IntakeTone;
  consent?: boolean;
  consentVersion?: string;
  name?: string;
  phone?: string;
  context?: string;
  role?: string;
};

const TONES: IntakeTone[] = [
  'basic',
  'family',
  'legal',
  'critical',
];

function isTone(value: unknown): value is IntakeTone {
  return TONES.includes(value as IntakeTone);
}

function isWizardResult(payload: Partial<WizardResult>): payload is WizardResult {
  return Boolean(
    payload.clientProfile &&
      payload.urgency &&
      payload.incident &&
      typeof payload.devices === 'number' &&
      Array.isArray(payload.actionsTaken) &&
      Array.isArray(payload.evidenceSources) &&
      payload.objective
  );
}

function deriveToneFromRoute(route: string): IntakeTone {
  const lastSegment = route.split('/').pop();
  if (isTone(lastSegment)) {
    return lastSegment;
  }
  return 'basic';
}

function buildFallbackWizardResult(): WizardResult {
  return {
    clientProfile: 'other',
    urgency: 'informational',
    hasEmotionalDistress: false,
    incident: 'unspecified',
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: 'unspecified',
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    if (!body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const hasConsentPayload = Boolean(body.consent);
    const hasConsentVersion = Boolean(body.consentVersion);

    if (hasConsentPayload !== hasConsentVersion) {
      return NextResponse.json(
        { ok: false, error: 'Consent version mismatch.' },
        { status: 400 }
      );
    }

    const hasWizardContext = isWizardResult(body);
    const wizardContext = hasWizardContext
      ? body
      : buildFallbackWizardResult();
    const assessment = assessIntake(wizardContext);

    const tone = isTone(body.tone)
      ? body.tone
      : deriveToneFromRoute(resolveIntakeRoute(wizardContext));

    const route = hasWizardContext
      ? resolveIntakeRoute(wizardContext)
      : `/contact/${tone}`;
    const now = new Date();

    const intake = await intakeRepository.createIntake({
      tone,
      route,
      priority: assessment.priority,
      name: body.name ?? null,
      email: body.email,
      message: body.message,
      phone: body.phone ?? null,
      status: 'RECEIVED',
      spamScore: null,
      meta: {
        context: body.context ?? null,
        role: body.role ?? null,
        hasWizardContext,
        wizardSummary: {
          clientProfile: wizardContext.clientProfile,
          urgency: wizardContext.urgency,
          hasEmotionalDistress: wizardContext.hasEmotionalDistress ?? false,
        },
      },
    });

    await intakeRepository.createAuditEvent({
      entityType: 'intake',
      entityId: intake.id,
      eventType: 'INTAKE_CREATED',
      createdAt: now,
      payload: {
        tone,
        route,
        priority: assessment.priority,
        hasConsent: hasConsentPayload && hasConsentVersion,
        consentVersion: body.consentVersion ?? null,
        email: body.email,
      },
    });

    if (hasConsentPayload && body.consentVersion) {
      const ipAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip')?.trim();
      const ipHash = ipAddress ? hashSha256(ipAddress) : null;
      const userAgent = req.headers.get('user-agent');
      const locale = req.headers.get('accept-language')?.split(',')[0]?.trim();

      const consentAcceptance = await intakeRepository.createConsentAcceptance({
        consentVersion: body.consentVersion,
        intakeId: intake.id,
        acceptedAt: now,
        ipHash,
        userAgent,
        locale: locale ?? null,
      });

      await intakeRepository.createAuditEvent({
        entityType: 'consent',
        entityId: consentAcceptance.id,
        eventType: 'CONSENT_ACCEPTED',
        createdAt: now,
        payload: {
          intakeId: intake.id,
          consentVersion: body.consentVersion,
          ipHash,
        },
      });
    }

    if (tone === 'critical') {
      const alert = await intakeRepository.createInternalAlert({
        intakeId: intake.id,
        type: 'CRITICAL_EMAIL',
        status: 'PENDING',
        createdAt: now,
        sentAt: null,
        error: null,
      });

      await intakeRepository.updateIntakeStatus(intake.id, 'ALERT_QUEUED');

      await intakeRepository.createAuditEvent({
        entityType: 'alert',
        entityId: alert.id,
        eventType: 'ALERT_QUEUED',
        createdAt: now,
        payload: {
          intakeId: intake.id,
          type: 'CRITICAL_EMAIL',
          status: 'PENDING',
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = `[${assessment.priority.toUpperCase()}] New intake received`;

    const text = `
--- Intake ---
Tone: ${tone}
Email: ${body.email}

--- Context ---
Client profile: ${wizardContext.clientProfile}
Urgency: ${wizardContext.urgency}
Emotional distress: ${wizardContext.hasEmotionalDistress ? 'YES' : 'NO'}

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
