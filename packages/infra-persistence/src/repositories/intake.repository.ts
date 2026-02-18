import { PrismaClient } from "../../generated/prisma/index";

import type {
  IntakeRecord,
  IntakeRepository,
  ContactIntakeInput,
  IntakeStatus,
} from "@claritystructures/domain";

type ContactIntakeModel = Awaited<
  ReturnType<PrismaClient["contactIntake"]["create"]>
>;

function toIntakeRecord(row: ContactIntakeModel): IntakeRecord {
  return {
    id: row.id,
    createdAt: row.createdAt,
    tone: row.tone,
    route: row.route,
    priority: row.priority,
    name: row.name ?? undefined,
    email: row.email,
    message: row.message,
    phone: row.phone ?? undefined,
    status: row.status,
    spamScore: row.spamScore ?? undefined,
    meta: row.meta as ContactIntakeInput["meta"],
  };
}

export class PrismaIntakeRepository implements IntakeRepository {
  constructor(
    private readonly prisma: Pick<
      PrismaClient,
      "contactIntake" | "consentAcceptance"
    >,
  ) {}

  async create(input: ContactIntakeInput): Promise<IntakeRecord> {
    const created = await this.prisma.contactIntake.create({
      data: {
        tone: input.tone,
        route: input.route,
        priority: input.priority,
        name: input.name ?? null,
        email: input.email,
        message: input.message,
        phone: input.phone ?? null,
        status: input.status,
        spamScore: input.spamScore ?? null,
        meta: (input.meta as any) ?? null,
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

  async findAll(): Promise<IntakeRecord[]> {
    const records = await this.prisma.contactIntake.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map(toIntakeRecord);
  }

  async updateStatus(
    id: string,
    status: IntakeStatus,
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

  async findByEmail(email: string): Promise<IntakeRecord[]> {
    const records = await this.prisma.contactIntake.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    return records.map(toIntakeRecord);
  }

  async deleteByEmail(email: string): Promise<number> {
    // Cascade: delete consent acceptances first, then intakes
    const intakes = await this.prisma.contactIntake.findMany({
      where: { email },
      select: { id: true },
    });

    if (intakes.length === 0) return 0;

    const intakeIds = intakes.map((i) => i.id);

    await this.prisma.consentAcceptance.deleteMany({
      where: { intakeId: { in: intakeIds } },
    });

    const deleted = await this.prisma.contactIntake.deleteMany({
      where: { email },
    });

    return deleted.count;
  }

  async findExpiredBefore(cutoff: Date): Promise<IntakeRecord[]> {
    const records = await this.prisma.contactIntake.findMany({
      where: { createdAt: { lt: cutoff } },
      orderBy: { createdAt: "asc" },
    });
    return records.map(toIntakeRecord);
  }

  async deleteById(id: string): Promise<void> {
    // Cascade: delete all related records before the intake itself
    await this.prisma.consentAcceptance.deleteMany({ where: { intakeId: id } });
    await this.prisma.contactIntake.delete({ where: { id } });
  }
}
