import {
  IntakePriority,
  IntakeStatus,
  IntakeTone,
  type Prisma,
} from '@prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { assessIntake, type IntakeAssessment } from '@/domain/priority';
import { prisma } from '@/infra/db';
import type {
  ClientProfile,
  UrgencyLevel,
  WizardResult,
} from '@/types/wizard';
import type { WizardResult } from '@/types/wizard';
import type { IntakeTone } from '@/domain/intake-records';
import { assessIntake as assessIntakeDomain } from '@/domain/priority';

export const runtime = 'nodejs';

type ContactPayload = Partial<WizardResult> & {
  email: string;
  message: string;
  tone: 'basic' | 'family' | 'legal' | 'critical';
  consent?: boolean;
  consentVersion?: string;
  tone: IntakeTone;
  consent: boolean;
  consentVersion: 'v1';
};

type ErrorCode =
  | 'INVALID_PAYLOAD'
  | 'INVALID_CONSENT_VERSION'
  | 'PERSISTENCE_ERROR'
  | 'EMAIL_ERROR';

const toneMap: Record<ContactPayload['tone'], IntakeTone> = {
  basic: IntakeTone.basic,
  family: IntakeTone.family,
  legal: IntakeTone.legal,
  critical: IntakeTone.critical,
};

const priorityMap: Record<IntakeAssessment['priority'], IntakePriority> = {
  low: IntakePriority.low,
  medium: IntakePriority.medium,
  high: IntakePriority.high,
  critical: IntakePriority.critical,
};

const statusMap = {
  received: IntakeStatus.RECEIVED,
} as const;

function errorResponse(status: number, code: ErrorCode, message: string) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function isClientProfile(value: unknown): value is ClientProfile {
  return (
    typeof value === 'string' &&
    [
      'private_individual',
      'family_inheritance_conflict',
      'legal_professional',
      'court_related',
      'other',
    ].includes(value)
  );
}

function isUrgencyLevel(value: unknown): value is UrgencyLevel {
  return (
    typeof value === 'string' &&
    ['informational', 'time_sensitive', 'legal_risk', 'critical'].includes(value)
  );
}

function normalizePayload(payload: ContactPayload) {
  const hasWizardContext =
    isClientProfile(payload.clientProfile) && isUrgencyLevel(payload.urgency);

  const assessment = hasWizardContext
    ? assessIntake(payload as WizardResult)
    : {
        priority: 'low' as const,
        flags: ['context_missing'],
        recommendedAction: 'Manual review requested',
      };

  const meta: Prisma.JsonObject = {
    wizard: {
      clientProfile: payload.clientProfile ?? null,
      urgency: payload.urgency ?? null,
      hasEmotionalDistress: payload.hasEmotionalDistress ?? null,
      incident: payload.incident ?? null,
      devices: payload.devices ?? null,
      actionsTaken: payload.actionsTaken ?? [],
      evidenceSources: payload.evidenceSources ?? [],
      objective: payload.objective ?? null,
    },
    assessment: {
      flags: assessment.flags,
      recommendedAction: assessment.recommendedAction,
    },
  };

  return {
    tone: toneMap[payload.tone],
    priority: priorityMap[assessment.priority],
    status: statusMap.received,
    assessment,
    meta,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

        codex/update-contact-api-for-submissions-and-consent
    if (!body?.email || !body?.message || !body?.tone) {
      return errorResponse(400, 'INVALID_PAYLOAD', 'Missing required contact fields.');
    }

    const normalized = normalizePayload(body);

    const consentVersion = body.consent
      ? await prisma.consentVersion.findUnique({
          where: { version: body.consentVersion },
        })
      : null;

    if (body.consent && !consentVersion) {
      return errorResponse(
        400,
        'INVALID_CONSENT_VERSION',
        'Provided consentVersion does not exist.',
      );
    }

    try {
      await prisma.$transaction(async tx => {
        const intake = await tx.contactIntake.create({
          data: {
            tone: normalized.tone,
            route: '/api/contact',
            priority: normalized.priority,
            email: body.email,
            message: body.message,
            status: normalized.status,
            meta: normalized.meta,
          },
        });

        if (body.consent && consentVersion) {
          await tx.consentAcceptance.create({
            data: {
              intakeId: intake.id,
              consentVersionId: consentVersion.id,
              userAgent: req.headers.get('user-agent') ?? undefined,
            },
          });
        }
      });
    } catch (dbError) {
      console.error('[CONTACT_API_PERSISTENCE_ERROR]', dbError);
      return errorResponse(
        500,
        'PERSISTENCE_ERROR',
        'Unable to persist contact intake.',
      );
    }
    // 2️⃣ Internal assessment (NOT exposed)
    const assessment = assessPriorityIntake(body);
       main
    const assessment = assessIntakeDomain(body);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = `[${normalized.assessment.priority.toUpperCase()}] New intake received`;

    const text = `
--- Intake ---
Tone: ${body.tone}
Email: ${body.email}

--- Context ---
Client profile: ${body.clientProfile ?? 'n/a'}
Urgency: ${body.urgency ?? 'n/a'}
Emotional distress: ${body.hasEmotionalDistress ? 'YES' : 'NO'}

--- Assessment ---
Priority: ${normalized.assessment.priority}
Flags: ${normalized.assessment.flags.join(', ') || 'none'}
Recommended action: ${normalized.assessment.recommendedAction}

--- Message ---
${body.message}
    `.trim();

    try {
      await transporter.sendMail({
        from: 'Clarity Structures <no-reply@claritystructures.com>',
        to: process.env.CONTACT_EMAIL,
        subject,
        text,
      });
    } catch (emailError) {
      console.error('[CONTACT_API_EMAIL_ERROR]', emailError);
      return errorResponse(
        500,
        'EMAIL_ERROR',
        'Intake was saved but notification email failed to send.',
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return errorResponse(500, 'PERSISTENCE_ERROR', 'Unexpected server error.');
  }
}
