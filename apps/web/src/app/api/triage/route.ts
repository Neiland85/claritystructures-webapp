import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  createListIntakesUseCase,
  createUpdateIntakeStatusUseCase,
} from "@/application/di-container";
import { apiGuard } from "@/lib/api-guard";
import { INTAKE_STATUSES } from "@claritystructures/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/triage
 * List all intakes (requires bearer auth)
 */
export async function GET(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const useCase = createListIntakesUseCase();
        const intakes = await useCase.execute();

        return NextResponse.json({ intakes });
      } catch (error) {
        console.error("Error fetching intakes:", error);
        return NextResponse.json(
          { error: "Failed to fetch intakes" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true },
  );
}

/**
 * PATCH /api/triage
 * Update intake status (requires bearer auth + CSRF)
 */
const PatchBodySchema = z.object({
  id: z.string().min(1, "id is required"),
  status: z.enum(INTAKE_STATUSES, {
    message: `Invalid status. Must be one of: ${INTAKE_STATUSES.join(", ")}`,
  }),
});

export async function PATCH(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const body = await req.json();
        const parsed = PatchBodySchema.safeParse(body);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
          return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const { id, status } = parsed.data;

        const useCase = createUpdateIntakeStatusUseCase();
        const updated = await useCase.execute(id, status);

        if (!updated) {
          return NextResponse.json(
            { error: "Intake not found" },
            { status: 404 },
          );
        }

        return NextResponse.json({ intake: updated });
      } catch (error) {
        console.error("Error updating intake:", error);
        return NextResponse.json(
          { error: "Failed to update intake" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true, requireCsrf: true },
  );
}
