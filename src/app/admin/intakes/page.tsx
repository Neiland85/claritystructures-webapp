import { headers } from 'next/headers';

import { isReviewerAuthorized } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { toAdminIntakeRows } from '@/application/intake/admin-intakes-view';

export const runtime = 'nodejs';

async function markForReview(formData: FormData) {
  'use server';

  const authHeader = (await headers()).get('authorization');

  if (!isReviewerAuthorized(authHeader)) {
    throw new Error('Unauthorized: Invalid credentials');
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
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-lg border border-red-300 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-900">Unauthorized</h1>
          <p className="mt-2 text-sm text-red-700">
            You must be authenticated to access this page.
          </p>
        </div>
      </div>
    );
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
