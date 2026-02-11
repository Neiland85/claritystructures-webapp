import nodemailer from 'nodemailer';

import type { Notifier } from '@/application/intake/submit-intake.usecase';
import type { SubmitIntakePayload } from '@/application/intake/decide-intake';

const DEFAULT_FROM = 'Clarity Structures <no-reply@claritystructures.com>';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function resolveAdminReviewUrl(intakeId: string): string {
  const configuredUrl = process.env.ADMIN_REVIEW_URL;

  if (configuredUrl && configuredUrl.length > 0) {
    return configuredUrl;
  }

  const adminBaseUrl = requiredEnv('ADMIN_REVIEW_BASE_URL');
  const separator = adminBaseUrl.includes('?') ? '&' : '?';

  return `${adminBaseUrl}${separator}intakeId=${encodeURIComponent(intakeId)}`;
}

function formatSummaryEmail(input: {
  intakeId: string;
  payload: SubmitIntakePayload;
  adminReviewUrl: string;
}): { subject: string; text: string } {
  const { intakeId, payload, adminReviewUrl } = input;

  return {
    subject: `[${payload.urgency.toUpperCase()}] New intake submission (${intakeId})`,
    text: [
      'A new intake has been submitted.',
      '',
      `Intake ID: ${intakeId}`,
      `Urgency: ${payload.urgency}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone?.trim() || 'Not provided'}`,
      '',
      `Review in admin: ${adminReviewUrl}`,
    ].join('\n'),
  };
}

export function createIntakeSubmissionEmailNotifier(): Notifier<SubmitIntakePayload> {
  const host = requiredEnv('SMTP_HOST');
  const port = Number(requiredEnv('SMTP_PORT'));
  const user = requiredEnv('SMTP_USER');
  const pass = requiredEnv('SMTP_PASS');
  const opsEmail = requiredEnv('OPS_EMAIL');
  const from = process.env.SMTP_FROM || DEFAULT_FROM;

  if (!Number.isFinite(port)) {
    throw new Error('Invalid SMTP_PORT: value must be a valid number.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return {
    async intakeSubmitted(event) {
      const adminReviewUrl = resolveAdminReviewUrl(event.intakeId);
      const { subject, text } = formatSummaryEmail({
        intakeId: event.intakeId,
        payload: event.payload,
        adminReviewUrl,
      });

      try {
        const result = await transporter.sendMail({
          from,
          to: opsEmail,
          subject,
          text,
        });

        console.info('[INTAKE_NOTIFY_EMAIL_SENT]', {
          intakeId: event.intakeId,
          to: opsEmail,
          messageId: result.messageId,
        });
      } catch (error) {
        console.error('[INTAKE_NOTIFY_EMAIL_FAILED]', {
          intakeId: event.intakeId,
          to: opsEmail,
          error,
        });

        throw error;
      }
    },
  };
}

export { formatSummaryEmail };
