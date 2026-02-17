import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createListIntakesUseCase,
  createUpdateIntakeStatusUseCase,
} from "@/application/di-container";
import { apiGuard } from "@/lib/api-guard";
import { IntakeStatus } from "@claritystructures/domain";

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
export async function PATCH(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const { id, status } = await req.json();

        if (!id || !status) {
          return NextResponse.json(
            { error: "Missing id or status" },
            { status: 400 },
          );
        }

        const useCase = createUpdateIntakeStatusUseCase();
        const updated = await useCase.execute(id, status as IntakeStatus);

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
