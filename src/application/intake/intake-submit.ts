import { decideIntakeWithExplanation, type WizardResult } from '@/domain';

export type IntakePayload = {
  conflictDescription: string;
  urgency: WizardResult['urgency'];
  isIncidentOngoing: 'yes' | 'no';
  hasAccessToDevices: 'yes' | 'no';
  estimatedIncidentStart: 'unknown' | 'recent' | 'weeks' | 'months';
  contactEmail: string;
  contactPhone: string;
};

export type IntakeSubmitDeps = {
  saveIntake: (input: {
    wizardResult: WizardResult;
    decision: ReturnType<typeof decideIntakeWithExplanation>['decision'];
    explanation: ReturnType<typeof decideIntakeWithExplanation>['explanation'];
    contactEmail: string;
    contactPhone: string;
  }) => Promise<{ id: string }>;
  notify: (input: {
    intakeId: string;
    contactEmail: string;
    urgency: string;
    adminUrl: string;
  }) => Promise<void>;
  logger: Pick<Console, 'info' | 'error'>;
};

const URGENCY_VALUES: ReadonlySet<string> = new Set([
  'informational',
  'time_sensitive',
  'legal_risk',
  'critical',
]);

const START_VALUES: ReadonlySet<string> = new Set(['unknown', 'recent', 'weeks', 'months']);

// RFC 5322 simplified email regex - requires at least one char before @,
// at least one char for domain name, and at least 2 chars for TLD
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  return EMAIL_REGEX.test(value.trim());
}

export function isIntakePayload(value: unknown): value is IntakePayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    nonEmptyString(candidate.conflictDescription) &&
    typeof candidate.urgency === 'string' &&
    URGENCY_VALUES.has(candidate.urgency) &&
    (candidate.isIncidentOngoing === 'yes' || candidate.isIncidentOngoing === 'no') &&
    (candidate.hasAccessToDevices === 'yes' || candidate.hasAccessToDevices === 'no') &&
    typeof candidate.estimatedIncidentStart === 'string' &&
    START_VALUES.has(candidate.estimatedIncidentStart) &&
    isValidEmail(candidate.contactEmail) &&
    nonEmptyString(candidate.contactPhone)
  );
}

export function toWizardResult(payload: IntakePayload): WizardResult {
  return {
    clientProfile: 'other',
    urgency: payload.urgency,
    incident: payload.conflictDescription,
    devices: payload.hasAccessToDevices === 'yes' ? 1 : 0,
    actionsTaken: [],
    evidenceSources: [],
    objective: 'Initial technical intake assessment',
    isOngoing: payload.isIncidentOngoing === 'yes',
    hasAccessToDevices: payload.hasAccessToDevices === 'yes',
    estimatedIncidentStart: payload.estimatedIncidentStart,
  };
}

export function buildIntakeSubmitHandler(deps: IntakeSubmitDeps) {
  return async function submit(body: unknown): Promise<{ status: number; message: string }> {
    try {
      if (!isIntakePayload(body)) {
        return { status: 400, message: 'Invalid intake payload' };
      }

      const wizardResult = toWizardResult(body);
      const { decision, explanation } = decideIntakeWithExplanation(wizardResult, true);

      const saved = await deps.saveIntake({
        wizardResult,
        decision,
        explanation,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
      });

      // Best-effort notification - log errors instead of failing the submission
      try {
        await deps.notify({
          intakeId: saved.id,
          contactEmail: body.contactEmail,
          urgency: body.urgency,
          adminUrl: `${process.env.APP_BASE_URL ?? 'http://localhost:3000'}/admin/intakes`,
        });
      } catch (notifyError) {
        deps.logger.error('[INTAKE_NOTIFY_ERROR]', notifyError);
      }

      deps.logger.info('[INTAKE_SUBMITTED]', {
        intakeId: saved.id,
        priority: decision.priority,
        urgency: body.urgency,
      });

      return {
        status: 201,
        message: 'Thanks. Your intake was received and is pending internal review.',
      };
    } catch (error) {
      deps.logger.error('[INTAKE_SUBMIT_ERROR]', error);
      return { status: 500, message: 'Unable to submit intake' };
    }
  };
}
