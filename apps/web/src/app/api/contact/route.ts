import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import type { WizardResult } from '@claritystructures/types'
import type { IntakeTone } from '@claritystructures/domain'
import { decideIntake } from '@claritystructures/domain'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = (await req.json()) as WizardResult

  const decision = decideIntake(body)

  return NextResponse.json(decision)
}
