import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendForensicIntakeEmail } from "@claritystructures/infra-alerts";
import { decideIntake } from "@claritystructures/domain";
import type { WizardResult } from "@claritystructures/domain";
import { apiGuard } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return apiGuard(req, async () => {
    try {
      const body = await req.json();
      const {
        email: rawEmail,
        phone: rawPhone,
        message: rawMessage,
        tone,
        wizardResult,
      } = body;

      // Sanitization
      const email = rawEmail?.toLowerCase().trim();
      const phone = rawPhone?.trim();
      const message = rawMessage?.trim();

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

      const decision = decideIntake(result);

      await sendForensicIntakeEmail({
        result,
        decision,
        userEmail: email,
        userPhone: phone,
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error in contact API:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
  });
}
