import { IntakeStatus, type Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/infra/prisma/client';

type IntakeWithMeta = {
  id: string;
  email: string;
  priority: string;
  createdAt: Date;
  status: IntakeStatus;
  meta: Prisma.JsonValue | null;
};

function extractReasons(meta: Prisma.JsonValue | null): string[] {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return [];
  }

  const record = meta as Record<string, unknown>;
  const candidates = [record.explanationReasons, record.reasons, record.explanation];

  for (const value of candidates) {
    if (Array.isArray(value)) {
      const reasons = value.filter((item): item is string => typeof item === 'string');
      if (reasons.length > 0) {
        return reasons;
      }
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return [value];
    }
  }

  return [];
}

async function markForReview(formData: FormData): Promise<void> {
  'use server';

  const intakeId = formData.get('intakeId');

  if (typeof intakeId !== 'string' || intakeId.length === 0) {
    return;
  }

  await prisma.contactIntake.update({
    where: { id: intakeId },
    data: { status: IntakeStatus.ALERT_QUEUED },
  });

  revalidatePath('/admin/intakes');
}

async function getIntakes(): Promise<IntakeWithMeta[]> {
  return prisma.contactIntake.findMany({
    select: {
      id: true,
      email: true,
      priority: true,
      createdAt: true,
      status: true,
      meta: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export const dynamic = 'force-dynamic';

export default async function AdminIntakesPage() {
  const intakes = await getIntakes();

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Admin Intake Dashboard</h1>
      <p>Private view for reviewing incoming submissions.</p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>
              Contact email
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>
              Priority
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>
              Explanation reasons
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>
              Created
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {intakes.map((intake) => {
            const reasons = extractReasons(intake.meta);
            const isMarked = intake.status === IntakeStatus.ALERT_QUEUED;

            return (
              <tr key={intake.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{intake.email}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>{intake.priority}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  {reasons.length > 0 ? reasons.join(', ') : '—'}
                </td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  {intake.createdAt.toISOString()}
                </td>
                <td style={{ borderBottom: '1px solid #eee', padding: '0.5rem' }}>
                  <form action={markForReview}>
                    <input type="hidden" name="intakeId" value={intake.id} />
                    <button type="submit" disabled={isMarked}>
                      {isMarked ? 'Marked' : 'Mark for review'}
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}

          {intakes.length === 0 ? (
            <tr>
              <td style={{ padding: '1rem' }} colSpan={5}>
                No submissions found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </main>
  );
}
