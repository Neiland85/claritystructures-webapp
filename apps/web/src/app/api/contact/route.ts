import { NextRequest, NextResponse } from "next/server";
import { ContactIntakeSchema } from "@claritystructures/types/validations/contact-intake.schema";
import { buildIdempotencyFingerprint } from "@claritystructures/domain";
import { createSubmitIntakeUseCase } from "@/application/di-container";
import {
  IdempotencyConflictError,
  IdempotencyInProgressError,
} from "@/application/use-cases/submit-intake.usecase";
import { createLogger } from "@/lib/logger";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit/upstash";

const logger = createLogger("api/contact");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string | undefined {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return req.headers.get("x-real-ip") ?? undefined;
}

async function sha256Hex(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const identifier = getIdentifier(req);

    const rateLimit = await checkRateLimit(`contact:${identifier}`, 10, 60_000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        },
      );
    }

    const body = await req.json();
    const parse = ContactIntakeSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parse.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (parse.data.website) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const useCase = createSubmitIntakeUseCase();
    const ip = getClientIp(req);

    const idempotencyHeader =
      req.headers.get("idempotency-key") ?? req.headers.get("x-request-id");

    const idempotencyFingerprint = buildIdempotencyFingerprint({
      scope: "intake.submit",
      version: "contact-intake/v1",
      explicitKey: idempotencyHeader,
      payload: {
        emailHash: await sha256Hex(parse.data.email),
        phoneHash: parse.data.phone ? await sha256Hex(parse.data.phone) : null,
        messageHash: await sha256Hex(parse.data.message),
        tone: parse.data.tone,
        consentVersion: parse.data.consentVersion,
        wizardResult: parse.data.wizardResult ?? null,
      },
    });

    const result = await useCase.execute(
      {
        name: parse.data.name,
        email: parse.data.email,
        phone: parse.data.phone,
        message: parse.data.message,
        tone: parse.data.tone,
        status: "pending",
        meta: parse.data.wizardResult,
      },
      {
        consentVersion: parse.data.consentVersion,
        ipHash: ip ? await sha256Hex(ip) : undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
      idempotencyFingerprint,
    );

    return NextResponse.json(
      {
        success: true,
        intakeId: result.record.id,
        priority: result.decision.decision.priority,
        route: result.decision.decision.route,
        idempotencyStatus: result.idempotencyStatus ?? "not_applied",
      },
      {
        status: 200,
        headers: {
          "Idempotency-Key": idempotencyFingerprint.key,
          "X-Request-Hash": idempotencyFingerprint.requestHash,
        },
      },
    );
  } catch (error) {
    if (error instanceof IdempotencyConflictError) {
      return NextResponse.json(
        { error: "Idempotency conflict", key: error.key },
        { status: error.statusCode },
      );
    }

    if (error instanceof IdempotencyInProgressError) {
      return NextResponse.json(
        { error: "Operation already in progress", key: error.key },
        {
          status: error.statusCode,
          headers: { "Retry-After": "5" },
        },
      );
    }

    logger.error("Failed to submit contact intake", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
