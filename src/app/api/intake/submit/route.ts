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
  // Handle numeric strings from form fields
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
    return fallback;
  }

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

  const incident = sanitizeString(payload.incident, 5000);
  const objective = sanitizeString(payload.objective, 2000);
  const devices = sanitizeInteger(payload.devices);

  // Validate required fields: non-empty strings and at least one device.
  if (!incident || !incident.trim() || !objective || !objective.trim()) {
    return null;
  }

  if (!Number.isInteger(devices) || devices < 1) {
    return null;
  }

  const result: WizardResult = {
    clientProfile,
    urgency,
    hasEmotionalDistress: sanitizeBoolean(payload.hasEmotionalDistress),
    incident,
    devices,
    actionsTaken: sanitizeStringArray(payload.actionsTaken),
    evidenceSources: sanitizeStringArray(payload.evidenceSources),
    objective,
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
  }
}
