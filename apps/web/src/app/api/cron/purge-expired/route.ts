import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createPurgeExpiredIntakesUseCase } from "@/application/di-container";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cron/purge-expired
 *
 * Scheduled endpoint for retention policy enforcement.
 * Protected by CRON_SECRET — only Vercel Cron or authorized callers.
 *
 * Purges intakes older than the configured retention period,
 * respecting active legal holds.
 */
export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const useCase = createPurgeExpiredIntakesUseCase();

    // Run purge for each retention category
    const results = await Promise.all([
      useCase.execute("intake_data"),
      useCase.execute("unqualified_leads"),
    ]);

    const summary = {
      intake_data: results[0],
      unqualified_leads: results[1],
      totalPurged: results.reduce((sum, r) => sum + r.purged, 0),
      totalSkipped: results.reduce((sum, r) => sum + r.skippedLegalHold, 0),
    };

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("[CRON purge-expired]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
