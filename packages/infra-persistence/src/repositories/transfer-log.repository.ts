import type { PrismaClient } from "../../generated/prisma/index";
import type {
  TransferLogRepository,
  TransferLogEntry,
  TransferLogSummary,
} from "@claritystructures/domain";

export class PrismaTransferLogRepository implements TransferLogRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "transferPacket">) {}

  async recordTransfer(entry: TransferLogEntry): Promise<string> {
    const row = await this.prisma.transferPacket.create({
      data: {
        intakeId: entry.intakeId,
        recipientEntity: entry.recipientEntity,
        manifestHash: entry.manifestHash,
        payloadSizeBytes: entry.payloadSizeBytes,
        legalBasis: entry.legalBasis,
      },
    });
    return row.id;
  }

  async recordAcknowledgment(transferId: string): Promise<void> {
    await this.prisma.transferPacket.update({
      where: { id: transferId },
      data: { acknowledgedAt: new Date() },
    });
  }

  async findByIntakeId(intakeId: string): Promise<TransferLogSummary[]> {
    const rows = await this.prisma.transferPacket.findMany({
      where: { intakeId },
      orderBy: { transferredAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      intakeId: row.intakeId,
      recipientEntity: row.recipientEntity,
      manifestHash: row.manifestHash,
      legalBasis: row.legalBasis,
      transferredAt: row.transferredAt,
      acknowledgedAt: row.acknowledgedAt,
    }));
  }
}
