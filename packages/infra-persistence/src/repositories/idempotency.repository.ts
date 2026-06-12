import { Prisma, PrismaClient } from "../../generated/prisma/index";
import type {
  BeginIdempotencyInput,
  BeginIdempotencyResult,
  IdempotencyRecordView,
  IdempotencyRepository,
} from "@claritystructures/domain";
import { requestHashesMatch } from "@claritystructures/domain";

type IdempotencyRow = Awaited<
  ReturnType<PrismaClient["idempotencyRecord"]["create"]>
>;

function toView(row: IdempotencyRow): IdempotencyRecordView {
  return {
    id: row.id,
    scope: row.scope,
    key: row.key,
    requestHash: row.requestHash,
    responseHash: row.responseHash,
    status: row.status as IdempotencyRecordView["status"],
    responseBody: row.responseBody ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    expiresAt: row.expiresAt,
  };
}

export class PrismaIdempotencyRepository implements IdempotencyRepository {
  constructor(
    private readonly prisma: Pick<PrismaClient, "idempotencyRecord">,
  ) {}

  async begin(input: BeginIdempotencyInput): Promise<BeginIdempotencyResult> {
    try {
      const row = await this.prisma.idempotencyRecord.create({
        data: {
          scope: input.scope,
          key: input.key,
          requestHash: input.requestHash,
          status: "in_progress",
          expiresAt: input.expiresAt ?? null,
        },
      });

      return { state: "started", record: toView(row) };
    } catch (error) {
      const existing = await this.prisma.idempotencyRecord.findUnique({
        where: {
          scope_key: {
            scope: input.scope,
            key: input.key,
          },
        },
      });

      if (!existing) throw error;

      if (!requestHashesMatch(existing.requestHash, input.requestHash)) {
        return { state: "conflict", record: toView(existing) };
      }

      if (existing.status === "completed") {
        return { state: "replayed", record: toView(existing) };
      }

      if (existing.status === "failed") {
        const reset = await this.prisma.idempotencyRecord.update({
          where: { id: existing.id },
          data: {
            status: "in_progress",
            responseHash: null,
            responseBody: Prisma.JsonNull,
            expiresAt: input.expiresAt ?? existing.expiresAt,
          },
        });

        return { state: "started", record: toView(reset) };
      }

      return { state: "in_progress", record: toView(existing) };
    }
  }

  async complete(
    id: string,
    responseBody: unknown,
    responseHash: string,
  ): Promise<void> {
    await this.prisma.idempotencyRecord.update({
      where: { id },
      data: {
        status: "completed",
        responseHash,
        responseBody:
          responseBody === undefined
            ? Prisma.JsonNull
            : (responseBody as Prisma.InputJsonValue),
      },
    });
  }

  async fail(id: string, reason?: string): Promise<void> {
    await this.prisma.idempotencyRecord.update({
      where: { id },
      data: {
        status: "failed",
        responseBody: {
          error: reason ?? "idempotent_operation_failed",
        },
      },
    });
  }
}
