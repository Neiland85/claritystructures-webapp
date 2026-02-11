import { NextResponse } from 'next/server';

import { decideIntakeWithExplanation } from '@/domain/decision-engine';
import type { WizardResult } from '@/domain/wizard-result';
import { db } from '@/infra/db';

export const runtime = 'nodejs';

type RawIntakePayload = Partial<Record<keyof WizardResult, unknown>>;

const VALID_CLIENT_PROFILES: ReadonlySet<WizardResult['clientProfile']> = new Set([
  'private_individual',
  'family_inheritance_conflict',
  'legal_professional',
  'court_related',
  'other',
]);

const VALID_URGENCY_LEVELS: ReadonlySet<WizardResult['urgency']> = new Set([
  'informational',
  'time_sensitive',
  'legal_risk',
  'critical',
]);

const VALID_DATA_SENSITIVITY_LEVELS: ReadonlySet<NonNullable<WizardResult['dataSensitivityLevel']>> =
  new Set(['low', 'medium', 'high']);

const VALID_ESTIMATED_INCIDENT_STARTS: ReadonlySet<
  NonNullable<WizardResult['estimatedIncidentStart']>
> = new Set(['unknown', 'recent', 'weeks', 'months']);

function sanitizeString(value: unknown, maxLength: number = 1000): string {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized: string = value
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '');

  return normalized.slice(0, maxLength);
}

function sanitizeStringArray(value: unknown, maxItems: number = 20): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizeString(item, 200))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

function sanitizeBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function sanitizeInteger(value: unknown, fallback: number = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function toWizardResult(payload: RawIntakePayload): WizardResult | null {
  const clientProfile = sanitizeString(payload.clientProfile, 50) as WizardResult['clientProfile'];
  const urgency = sanitizeString(payload.urgency, 50) as WizardResult['urgency'];

  if (!VALID_CLIENT_PROFILES.has(clientProfile) || !VALID_URGENCY_LEVELS.has(urgency)) {
    return null;
  }

  const result: WizardResult = {
    clientProfile,
    urgency,
    hasEmotionalDistress: sanitizeBoolean(payload.hasEmotionalDistress),
    incident: sanitizeString(payload.incident, 5000),
    devices: sanitizeInteger(payload.devices),
    actionsTaken: sanitizeStringArray(payload.actionsTaken),
    evidenceSources: sanitizeStringArray(payload.evidenceSources),
    objective: sanitizeString(payload.objective, 2000),
  };

  const isOngoing = sanitizeBoolean(payload.isOngoing);
  if (isOngoing !== undefined) {
    result.isOngoing = isOngoing;
  }

  const hasAccessToDevices = sanitizeBoolean(payload.hasAccessToDevices);
  if (hasAccessToDevices !== undefined) {
    result.hasAccessToDevices = hasAccessToDevices;
  }

  const dataSensitivityLevel = sanitizeString(payload.dataSensitivityLevel, 20) as NonNullable<
    WizardResult['dataSensitivityLevel']
  >;
  if (VALID_DATA_SENSITIVITY_LEVELS.has(dataSensitivityLevel)) {
    result.dataSensitivityLevel = dataSensitivityLevel;
  }

  const estimatedIncidentStart = sanitizeString(payload.estimatedIncidentStart, 20) as NonNullable<
    WizardResult['estimatedIncidentStart']
  >;
  if (VALID_ESTIMATED_INCIDENT_STARTS.has(estimatedIncidentStart)) {
    result.estimatedIncidentStart = estimatedIncidentStart;
  }

  const thirdPartiesInvolved = sanitizeBoolean(payload.thirdPartiesInvolved);
  if (thirdPartiesInvolved !== undefined) {
    result.thirdPartiesInvolved = thirdPartiesInvolved;
  }

  return result;
export const runtime = 'nodejs';

type IntakeSubmitPayload = {
  description: string;
  urgency: string;
  incidentOngoing: 'yes' | 'no';
  hasDeviceAccess: 'yes' | 'no';
  incidentStart: string;
  email: string;
  phone: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBooleanRadioValue(value: unknown): value is 'yes' | 'no' {
  return value === 'yes' || value === 'no';
}

function isValidPayload(value: unknown): value is IntakeSubmitPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isNonEmptyString(candidate.description) &&
    isNonEmptyString(candidate.urgency) &&
    isBooleanRadioValue(candidate.incidentOngoing) &&
    isBooleanRadioValue(candidate.hasDeviceAccess) &&
    isNonEmptyString(candidate.incidentStart) &&
    isNonEmptyString(candidate.email) &&
    isNonEmptyString(candidate.phone)
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RawIntakePayload;
    const wizardResult = toWizardResult(payload);

    if (!wizardResult) {
      return NextResponse.json({ message: 'Invalid intake payload.' }, { status: 400 });
    }

    const { decision, explanation } = decideIntakeWithExplanation(wizardResult, true);

    await db.saveIntake({
      wizardResult,
      decision,
      explanation,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Your intake has been received and is being processed.' },
      { status: 202 }
    );
  } catch (error) {
    console.error('[INTAKE_SUBMIT_ERROR]', error);
    return NextResponse.json(
      { message: 'Unable to submit intake at this time.' },
      { status: 500 }
    );
    const payload = await request.json();

    if (!isValidPayload(payload)) {
      return NextResponse.json({ message: 'Invalid intake submission' }, { status: 400 });
    }

    console.info('[INTAKE_SUBMIT]', payload);

    return NextResponse.json(
      {
        message: 'Intake submitted successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[INTAKE_SUBMIT_ERROR]', error);

    return NextResponse.json({ message: 'Unable to submit intake' }, { status: 500 });
  }
}
