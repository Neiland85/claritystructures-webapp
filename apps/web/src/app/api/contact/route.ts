import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { createSubmitIntakeUseCase } from "@/application/di-container";
import type { WizardResult } from "@claritystructures/domain";
import { apiGuard } from "@/lib/api-guard";
import { sanitizeHtml, isBot } from "@/lib/api/validate-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Zod schema for contact form input validation */
const ContactBodySchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  phone: z.string().max(30).optional(),
  message: z.string().min(1, "Message is required").max(5000),
  tone: z.enum(["basic", "legal"]).optional().default("basic"),
  wizardResult: z.record(z.string(), z.unknown()).optional(),
  // Honeypot field — should always be empty for real users
  website: z.string().optional(),
  // Allow pass-through fields from wizard context spread
  consent: z.boolean().optional(),
  consentVersion: z.string().optional(),
});

// No requireCsrf/requireAuth — public form protected by CORS + honeypot.
// CSRF tokens are reserved for authenticated endpoints (triage).
export async function POST(req: NextRequest) {
  return apiGuard(req, async () => {
    try {
      const body = await req.json();

      // Honeypot: if the hidden "website" field is filled, it's a bot
      if (isBot(body)) {
        // Return 200 to avoid leaking detection to the bot
        return NextResponse.json({ success: true, decision: "accepted" });
      }

      // Validate input with Zod
      const parsed = ContactBodySchema.safeParse(body);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const field = issue?.path?.[0];
        const msg = issue?.message ?? "Invalid input";
        const error = field != null ? `Invalid ${String(field)}: ${msg}` : msg;
        return NextResponse.json({ error }, { status: 400 });
      }

      const {
        email: rawEmail,
        phone: rawPhone,
        message: rawMessage,
        tone,
        wizardResult,
      } = parsed.data;

      // Sanitization — strip HTML/XSS from user inputs
      const email = rawEmail.toLowerCase().trim();
      const phone = rawPhone ? sanitizeHtml(rawPhone.trim()) : undefined;
      const message = sanitizeHtml(rawMessage.trim());

      // If we have a full wizard result, use it.
      const result: WizardResult = (wizardResult as WizardResult) || {
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
      console.error("[POST /api/contact]", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
  });
}
