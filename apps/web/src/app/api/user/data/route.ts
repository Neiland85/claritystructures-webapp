import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  createGetUserDataUseCase,
  createDeleteUserDataUseCase,
} from "@/application/di-container";
import { apiGuard } from "@/lib/api-guard";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api/user-data");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EmailSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase(),
});

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
            route: intake.route,
            priority: intake.priority,
            status: intake.status,
            name: intake.name,
            email: intake.email,
            phone: intake.phone,
            message: intake.message,
            spamScore: intake.spamScore,
            meta: intake.meta,
          })),
        });
      } catch (error) {
        logger.error("Failed to fetch user data", error);
        return NextResponse.json(
          { error: "Failed to fetch user data" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true },
  );
}

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
          suppressed: result.suppressed,
          skippedLegalHold: result.skippedLegalHold,
          message:
            result.suppressed > 0
              ? `Suppressed ${result.suppressed} record(s) for ${parsed.data.email}`
              : `No suppressible records found for ${parsed.data.email}`,
        });
      } catch (error) {
        logger.error("Failed to suppress user data", error);
        return NextResponse.json(
          { error: "Failed to suppress user data" },
          { status: 500 },
        );
      }
    },
    { requireAuth: true, requireCsrf: true },
  );
}
