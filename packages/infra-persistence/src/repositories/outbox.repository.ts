import { Prisma, PrismaClient } from "../../generated/prisma/index";
import type {
  OutboxEventRecord,
  OutboxEventSummary,
  OutboxRepository,
} from "@claritystructures/domain";

type OutboxRow = Awaited<ReturnType<PrismaClient["outboxEvent"]["create"]>>;

function toSummary(row: OutboxRow): OutboxEventSummary {
  return {
    id: row.id,
    eventName: row.eventName,
    aggregateId: row.aggregateId,
    causationKey: row.causationKey,
    payload: row.payload as Record<string, unknown>,
    status: row.status as OutboxEventSummary["status"],
    attempts: row.attempts,
    createdAt: row.createdAt,
    processedAt: row.processedAt,
  };
}

export class PrismaOutboxRepository implements OutboxRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "outboxEvent">) {}

  async enqueue(event: OutboxEventRecord): Promise<string> {
    try {
      const row = await this.prisma.outboxEvent.create({
        data: {
          eventName: event.eventName,
          aggregateId: event.aggregateId,
          causationKey: event.causationKey,
          payload: event.payload as Prisma.InputJsonValue,
        },
      });

      return row.id;
    } catch (error) {
      const existing = await this.prisma.outboxEvent.findUnique({
        where: { causationKey: event.causationKey },
        select: { id: true },
      });

      if (!existing) throw error;
      return existing.id;
    }
  }

  async findPending(limit = 50): Promise<OutboxEventSummary[]> {
    const rows = await this.prisma.outboxEvent.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    return rows.map(toSummary);
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: "processed",
        processedAt: new Date(),
      },
    });
  }

  async markFailed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: "failed",
        attempts: { increment: 1 },
      },
    });
  }
}
