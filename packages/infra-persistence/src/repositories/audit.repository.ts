import { Prisma, PrismaClient } from "../../generated/prisma/index";
import type { AuditEvent, AuditTrail } from "@claritystructures/domain";

/**
 * PrismaAuditTrail — persistent audit trail backed by PostgreSQL.
 *
 * Stores every AuditEvent as an immutable AuditLog row.
 * Falls back to console logging if the write fails (fail-open for audit;
 * the primary operation must never be blocked by audit persistence).
 */
export class PrismaAuditTrail implements AuditTrail {
  constructor(private readonly prisma: Pick<PrismaClient, "auditLog">) {}

  async record(event: AuditEvent): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: event.action,
          intakeId: event.intakeId ?? null,
          metadata: event.metadata
            ? (event.metadata as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          occurredAt: event.occurredAt ?? new Date(),
        },
      });
    } catch (error) {
      // Fail-open: log but never throw — audit must not break the primary flow
      console.error("[PrismaAuditTrail] Failed to persist audit event:", error);
    }
  }
}
