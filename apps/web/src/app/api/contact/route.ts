import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSubmitIntakeUseCase } from "@/application/di-container";
import type { WizardResult } from "@claritystructures/domain";
import { apiGuard } from "@/lib/api-guard";
import { sanitizeHtml, isBot } from "@/lib/api/validate-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return apiGuard(
    req,
    async () => {
      try {
        const body = await req.json();

        // Honeypot: if the hidden "website" field is filled, it's a bot
        if (isBot(body)) {
          // Return 200 to avoid leaking detection to the bot
          return NextResponse.json({ success: true, decision: "accepted" });
        }

        const {
          email: rawEmail,
          phone: rawPhone,
          message: rawMessage,
          tone: rawTone,
          wizardResult,
        } = body;

        // Sanitization — strip HTML/XSS from user inputs
        const email = rawEmail?.toLowerCase().trim();
        const phone = rawPhone ? sanitizeHtml(rawPhone.trim()) : undefined;
        const message = rawMessage
          ? sanitizeHtml(rawMessage.trim())
          : undefined;
        const tone = rawTone || "basic";

        // Validation
        if (!email || !message) {
          return NextResponse.json(
            { error: "Email and message are required" },
            { status: 400 },
          );
        }

        // Basic email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 },
          );
        }

        // If we have a full wizard result, use it.
        const result: WizardResult = wizardResult || {
          clientProfile: "other",
          urgency: "informational",
          incident: message,
          devices: 0,
          actionsTaken: [],
          evidenceSources: [],
          objective: "contact",
        };

        const useCase = createSubmitIntakeUseCase();

        // Execute use case
        // Note: priority and route are computed by the use case based on the decision engine
        const { decision } = await useCase.execute({
          tone,
          priority: "medium", // Default hint, will be overridden by use case decision
          email,
          message,
          phone,
          status: "pending",
          meta: result,
        });

        return NextResponse.json({
          success: true,
          decision: decision.decision,
        });
      } catch (error) {
        console.error("Error in contact API:", error);
        return NextResponse.json({ error: "Failed to send" }, { status: 500 });
      }
    },
    { requireCsrf: true },
  );
}
