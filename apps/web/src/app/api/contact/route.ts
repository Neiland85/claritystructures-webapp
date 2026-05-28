import { NextRequest, NextResponse } from "next/server";
import { ContactIntakeSchema } from "@claritystructures/types/validations/contact-intake.schema";
import { createSubmitIntakeUseCase } from "@/application/di-container";
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
    const rateLimit = await checkRateLimit(getIdentifier(req), 10, 60_000);

    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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

    // Honeypot check (website field must be empty)
    if (parse.data.website) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const useCase = createSubmitIntakeUseCase();
    const ip = getClientIp(req);

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
    );

    return NextResponse.json(
      {
        success: true,
        intakeId: result.record.id,
        priority: result.decision.decision.priority,
        route: result.decision.decision.route,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Failed to submit contact intake", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
