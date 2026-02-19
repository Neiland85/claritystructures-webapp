import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createCheckSlaBreachesUseCase } from "@/application/di-container";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cron/sla-breach-check
 *
 * Scheduled endpoint for SLA breach detection.
 * Protected by CRON_SECRET — only Vercel Cron or authorized callers.
 *
 * Queries breached SLA timers and logs them in the audit trail.
 */
export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const useCase = createCheckSlaBreachesUseCase();
    const result = await useCase.execute();

    return NextResponse.json({
      success: true,
      breached: result.breached,
      timers: result.timers.map((t) => ({
        intakeId: t.intakeId,
        milestone: t.milestone,
        deadlineAt: t.deadlineAt.toISOString(),
        status: t.status,
      })),
    });
  } catch (error) {
    console.error("[CRON sla-breach-check]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
