import type { PrismaClient } from "../../generated/prisma/index";
import type {
  DeletionLogRepository,
  DeletionLogEntry,
  DeletionLogSummary,
} from "@claritystructures/domain";

export class PrismaDeletionLogRepository implements DeletionLogRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "deletionLog">) {}

  async record(entry: DeletionLogEntry): Promise<void> {
    await this.prisma.deletionLog.create({
      data: {
        intakeId: entry.intakeId,
        reason: entry.reason,
        trigger: entry.trigger,
      },
    });
  }

  async findByIntakeId(intakeId: string): Promise<DeletionLogSummary[]> {
    const rows = await this.prisma.deletionLog.findMany({
      where: { intakeId },
      orderBy: { deletedAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      intakeId: row.intakeId,
      reason: row.reason,
      trigger: row.trigger,
      deletedAt: row.deletedAt,
    }));
  }
}
