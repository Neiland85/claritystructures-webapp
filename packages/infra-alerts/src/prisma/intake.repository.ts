import { PrismaClient } from '@prisma/client';

import type {
  IntakeRecord,
  IntakeRepository,
} from '@claritystructures/application/intake/ports';
import type { ContactIntakeInput, IntakeStatus } from '@claritystructures/domain/intake-records';

type ContactIntakeModel = Awaited<
  ReturnType<PrismaClient['contactIntake']['create']>
>;

function toIntakeRecord(row: ContactIntakeModel): IntakeRecord {
  return {
    id: row.id,
    createdAt: row.createdAt,
    tone: row.tone,
    route: row.route,
    priority: row.priority,
    name: row.name,
    email: row.email,
    message: row.message,
    phone: row.phone,
    status: row.status,
    spamScore: row.spamScore,
    meta: row.meta as ContactIntakeInput['meta'],
  };
}

export class PrismaIntakeRepository implements IntakeRepository {
  constructor(
    private readonly prisma: Pick<PrismaClient, 'contactIntake'>
  ) { }

  async create(input: ContactIntakeInput): Promise<IntakeRecord> {
    const created = await this.prisma.contactIntake.create({
      data: {
        tone: input.tone,
        route: input.route,
        priority: input.priority,
        name: input.name,
        email: input.email,
        message: input.message,
        phone: input.phone,
        status: input.status,
        spamScore: input.spamScore,
        meta: input.meta ?? undefined,
      },
    });

    return toIntakeRecord(created);
  }

  async findById(id: string): Promise<IntakeRecord | null> {
    const record = await this.prisma.contactIntake.findUnique({
      where: { id },
    });

    return record ? toIntakeRecord(record) : null;
  }

  async updateStatus(
    id: string,
    status: IntakeStatus
  ): Promise<IntakeRecord | null> {
    const existing = await this.prisma.contactIntake.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return null;
    }

    const updated = await this.prisma.contactIntake.update({
      where: { id },
      data: { status },
    });

    return toIntakeRecord(updated);
  }
}
