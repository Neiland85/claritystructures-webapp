import type { PrismaClient } from "../../generated/prisma/index";
import type {
  LegalHoldRepository,
  LegalHoldRecord,
  LegalHoldSummary,
} from "@claritystructures/domain";

export class PrismaLegalHoldRepository implements LegalHoldRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "legalHold">) {}

  async place(record: LegalHoldRecord): Promise<string> {
    const row = await this.prisma.legalHold.create({
      data: {
        intakeId: record.intakeId,
        reason: record.reason,
        placedBy: record.placedBy,
      },
    });
    return row.id;
  }

  async lift(holdId: string): Promise<void> {
    await this.prisma.legalHold.update({
      where: { id: holdId },
      data: { liftedAt: new Date() },
    });
  }

  async findActiveByIntakeId(
    intakeId: string,
  ): Promise<LegalHoldSummary | null> {
    const row = await this.prisma.legalHold.findFirst({
      where: { intakeId, liftedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!row) return null;
    return {
      id: row.id,
      intakeId: row.intakeId,
      reason: row.reason,
      placedBy: row.placedBy,
      createdAt: row.createdAt,
      liftedAt: row.liftedAt,
    };
  }

  async findAllActive(): Promise<LegalHoldSummary[]> {
    const rows = await this.prisma.legalHold.findMany({
      where: { liftedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      intakeId: row.intakeId,
      reason: row.reason,
      placedBy: row.placedBy,
      createdAt: row.createdAt,
      liftedAt: row.liftedAt,
    }));
  }
}
