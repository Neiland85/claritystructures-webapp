import { NextResponse } from 'next/server'
import { decideIntake } from '@claritystructures/domain'
import type { WizardResult } from '@claritystructures/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = (await req.json()) as WizardResult
  const decision = decideIntake(body)
  return NextResponse.json(decision)
}
