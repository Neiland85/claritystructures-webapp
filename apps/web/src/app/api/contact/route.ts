import { NextRequest, NextResponse } from "next/server";
import { ContactIntakeSchema } from "@claritystructures/types";

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
