import { PrismaClient, Prisma } from "../../generated/prisma/index";

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

function buildSuppressedEmail(id: string): string {
  return `suppressed+${id}@suppressed.local`;
}

export class PrismaIntakeRepository implements IntakeRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "contactIntake">) {}

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
        meta: input.meta
          ? (input.meta as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
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
      where: { suppressedAt: null },
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
      where: { email, suppressedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return records.map(toIntakeRecord);
  }

  async deleteByEmail(email: string): Promise<number> {
    const intakes = await this.prisma.contactIntake.findMany({
      where: { email, suppressedAt: null },
      select: { id: true },
    });

    for (const intake of intakes) {
      await this.deleteById(intake.id);
    }

    return intakes.length;
  }

  async findExpiredBefore(cutoff: Date): Promise<IntakeRecord[]> {
    const records = await this.prisma.contactIntake.findMany({
      where: {
        createdAt: { lt: cutoff },
        suppressedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    return records.map(toIntakeRecord);
  }

  async deleteById(id: string): Promise<void> {
    const now = new Date();

    await this.prisma.contactIntake.update({
      where: { id },
      data: {
        name: null,
        email: buildSuppressedEmail(id),
        phone: null,
        message: "[suppressed]",
        meta: {
          suppressed: true,
          suppressedAt: now.toISOString(),
        } as Prisma.InputJsonValue,
        suppressedAt: now,
        suppressionReason: "privacy_suppression",
        suppressionTrigger: "deleteById",
      },
    });
  }
}
