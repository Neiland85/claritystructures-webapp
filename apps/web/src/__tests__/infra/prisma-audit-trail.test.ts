import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaAuditTrail } from "@claritystructures/infra-persistence";
import type { AuditEvent } from "@claritystructures/domain";

function createMockPrisma() {
  return {
    auditLog: {
      create: vi.fn(async () => ({
        id: "audit-001",
        action: "test_action",
        intakeId: null,
        metadata: null,
        occurredAt: new Date(),
        createdAt: new Date(),
      })),
    },
  };
}

describe("PrismaAuditTrail", () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let trail: PrismaAuditTrail;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    trail = new PrismaAuditTrail(mockPrisma as any);
  });

  it("should persist a full audit event to the database", async () => {
    const event: AuditEvent = {
      action: "intake_submitted",
      intakeId: "intake-001",
      metadata: { priority: "critical", route: "/contact/critical" },
      occurredAt: new Date("2026-02-17T12:00:00Z"),
    };

    await trail.record(event);

    expect(mockPrisma.auditLog.create).toHaveBeenCalledOnce();
    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        action: "intake_submitted",
        intakeId: "intake-001",
        metadata: { priority: "critical", route: "/contact/critical" },
        occurredAt: new Date("2026-02-17T12:00:00Z"),
      },
    });
  });

  it("should handle event with missing optional fields", async () => {
    const event: AuditEvent = {
      action: "arcopol_access_requested",
    };

    await trail.record(event);

    const call = mockPrisma.auditLog.create.mock.calls[0][0] as {
      data: {
        action: string;
        intakeId: string | null;
        metadata: unknown;
        occurredAt: Date;
      };
    };
    expect(call.data.action).toBe("arcopol_access_requested");
    expect(call.data.intakeId).toBeNull();
    // Prisma.JsonNull is a special sentinel object, not plain null
    expect(call.data.metadata).toBeDefined();
    expect(call.data.occurredAt).toBeInstanceOf(Date);
  });

  it("should fail-open when database write throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.auditLog.create.mockRejectedValueOnce(
      new Error("DB connection lost"),
    );

    // Should NOT throw — audit must never break the primary flow
    await expect(
      trail.record({ action: "some_action" }),
    ).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalledWith(
      "[PrismaAuditTrail] Failed to persist audit event:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
