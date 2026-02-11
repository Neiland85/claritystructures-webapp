import { POST } from '../route';

export { POST };

export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

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
