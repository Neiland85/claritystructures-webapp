import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { isReviewerAuthorized, unauthorizedHeaders } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { toAdminIntakeRows } from '@/application/intake/admin-intakes-view';

export const runtime = 'nodejs';

async function markForReview(formData: FormData) {
  'use server';

  const authHeader = (await headers()).get('authorization');

  if (!isReviewerAuthorized(authHeader)) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401, headers: unauthorizedHeaders() },
    );
  }

  const intakeId = String(formData.get('intakeId') ?? '');

  if (!intakeId) {
    return;
  }

  try {
    await prisma.intake.update({
      where: { id: intakeId },
      data: { needsReview: true },
    });
  } catch (error) {
    console.error('[MARK_FOR_REVIEW_ERROR]', { intakeId, error });
    throw new Error('Failed to mark intake for review');
  }
}

export default async function AdminIntakesPage() {
  const authHeader = (await headers()).get('authorization');

  if (!isReviewerAuthorized(authHeader)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: unauthorizedHeaders(),
    });
  }

  const intakes = await prisma.intake.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const rows = toAdminIntakeRows(intakes);

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="text-3xl font-bold">Intake Review Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Authenticated reviewers only.</p>

      <div className="mt-6 space-y-4">
        {rows.map((intake) => {
          return (
            <article key={intake.id} className="rounded border border-slate-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">{intake.contactEmail}</h2>
                <p className="text-sm text-slate-600">{intake.createdAtIso}</p>
              </div>

              <p className="mt-1 text-sm">Phone: {intake.contactPhone}</p>
              <p className="mt-1 text-sm">Priority: {intake.priority}</p>
              <p className="mt-1 text-sm">Reasons: {intake.reasons.length > 0 ? intake.reasons.join(', ') : 'none'}</p>
              <p className="mt-1 text-sm">Human review: {intake.needsReview ? 'flagged' : 'not flagged'}</p>

              <form action={markForReview} className="mt-3">
                <input type="hidden" name="intakeId" value={intake.id} />
                <button
                  className="rounded bg-slate-900 px-3 py-1 text-sm text-white disabled:opacity-50"
                  type="submit"
                  disabled={intake.needsReview}
                >
                  Mark for human review
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </main>
  );
}
