import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  createGetUserDataUseCase,
  createDeleteUserDataUseCase,
} from "@/application/di-container";
import { apiGuard } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EmailSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
});

/**
 * POST /api/user/data
 * ARCO-POL: Acceso — retrieve all data associated with an email.
 * Requires bearer auth (admin-only).
 */
export async function POST(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const body = await req.json();
        const parsed = EmailSchema.safeParse(body);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
          return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const useCase = createGetUserDataUseCase();
        const intakes = await useCase.execute(parsed.data.email);

        return NextResponse.json({
          email: parsed.data.email,
          recordCount: intakes.length,
          intakes: intakes.map((intake) => ({
            id: intake.id,
            createdAt: intake.createdAt,
            tone: intake.tone,
            priority: intake.priority,
            status: intake.status,
            message: intake.message,
          })),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
          { error: "Failed to fetch user data" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true },
  );
}

/**
 * DELETE /api/user/data
 * ARCO-POL: Supresión — delete all data associated with an email.
 * Requires bearer auth + CSRF (admin-only, destructive).
 */
export async function DELETE(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const body = await req.json();
        const parsed = EmailSchema.safeParse(body);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
          return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const useCase = createDeleteUserDataUseCase();
        const result = await useCase.execute(parsed.data.email);

        return NextResponse.json({
          email: parsed.data.email,
          deleted: result.deleted,
          message:
            result.deleted > 0
              ? `Deleted ${result.deleted} record(s) for ${parsed.data.email}`
              : `No records found for ${parsed.data.email}`,
        });
      } catch (error) {
        console.error("Error deleting user data:", error);
        return NextResponse.json(
          { error: "Failed to delete user data" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true, requireCsrf: true },
  );
}
