import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  createRequestLegalDerivationUseCase,
  createGenerateTransferPacketUseCase,
} from "@/application/di-container";
import { apiGuard } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/derivation
 *
 * Two actions:
 *   - action: "consent"  → Record derivation consent
 *   - action: "transfer" → Generate transfer packet
 *
 * Both require bearer auth + CSRF.
 */

const ConsentBodySchema = z.object({
  action: z.literal("consent"),
  intakeId: z.string().min(1, "intakeId is required"),
  recipientEntity: z.string().min(1, "recipientEntity is required"),
});

const TransferBodySchema = z.object({
  action: z.literal("transfer"),
  intakeId: z.string().min(1, "intakeId is required"),
  decision: z.object({
    modelVersion: z.string(),
    rulesTriggered: z.array(z.string()),
    outcome: z.string(),
    explanation: z.string(),
    decidedAt: z.string().min(1, "decidedAt is required"),
  }),
  chronology: z.array(
    z.object({
      action: z.string(),
      occurredAt: z.string().min(1, "occurredAt is required"),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

const RequestBodySchema = z.discriminatedUnion("action", [
  ConsentBodySchema,
  TransferBodySchema,
]);

export async function POST(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const body = await req.json();
        const parsed = RequestBodySchema.safeParse(body);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
          return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const data = parsed.data;

        if (data.action === "consent") {
          const useCase = createRequestLegalDerivationUseCase();
          const result = await useCase.execute({
            intakeId: data.intakeId,
            recipientEntity: data.recipientEntity,
            ipHash: req.headers.get("x-forwarded-for") ?? undefined,
            userAgent: req.headers.get("user-agent") ?? undefined,
          });
          return NextResponse.json({ consentId: result.consentId });
        }

        // action === "transfer"
        const useCase = createGenerateTransferPacketUseCase();
        const result = await useCase.execute({
          intakeId: data.intakeId,
          decision: {
            ...data.decision,
            decidedAt: new Date(data.decision.decidedAt),
          },
          chronology: data.chronology,
        });

        return NextResponse.json({
          transferId: result.transferId,
          manifestHash: result.manifestHash,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Internal server error";
        const status = message.includes("not found")
          ? 404
          : message.includes("No active derivation consent")
            ? 409
            : 500;
        console.error("[POST /api/derivation]", error);
        return NextResponse.json({ error: message }, { status });
      }
    },
    { requireAuth: true, requireCsrf: true },
  );
}
