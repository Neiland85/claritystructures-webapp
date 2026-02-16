import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock DI container before importing route ───────────────────

const mockExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createSubmitIntakeUseCase: () => ({
    execute: mockExecute,
  }),
}));

// Mock api-guard to pass through (we test it separately)
vi.mock("@/lib/api-guard", () => ({
  apiGuard: (
    _req: NextRequest,
    handler: () => Promise<Response>,
    _opts?: unknown,
  ) => handler(),
}));

// Mock validate-request (DOMPurify needs JSDOM but we test sanitization logic)
vi.mock("@/lib/api/validate-request", () => ({
  sanitizeHtml: (dirty: string) => dirty.replace(/<[^>]*>/g, ""),
  isBot: (data: { website?: string }) =>
    !!data.website && data.website.length > 0,
}));

// Import route AFTER mocks are set up
const { POST } = await import("@/app/api/contact/route");

// ── Fixtures ───────────────────────────────────────────────────

const VALID_BODY = {
  email: "test@example.com",
  message: "I need help with a digital forensics case",
  tone: "basic",
  wizardResult: {
    objective: "contact",
    incident: "I need help with a digital forensics case",
    clientProfile: "private_individual",
    urgency: "informational",
    devices: 0,
    actionsTaken: [],
    evidenceSources: [],
  },
};

const MOCK_DECISION = {
  decision: {
    priority: "medium",
    route: "/contact/basic",
    flags: [],
    actionCode: "STANDARD_REVIEW",
    decisionModelVersion: "decision-model/v1",
  },
  explanation: {
    reasons: [],
    baselinePriority: "medium",
    finalPriority: "medium",
    modelVersion: "decision-model/v1",
  },
};

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── Tests ──────────────────────────────────────────────────────

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({
      record: { id: "intake-001", ...VALID_BODY },
      decision: MOCK_DECISION,
    });
  });

  it("should return 200 with decision on valid input", async () => {
    const res = await POST(createRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.decision).toEqual(MOCK_DECISION.decision);
  });

  it("should call use case with sanitized email (lowercased, trimmed)", async () => {
    const body = { ...VALID_BODY, email: "  TEST@EXAMPLE.COM  " };
    await POST(createRequest(body));

    expect(mockExecute).toHaveBeenCalledOnce();
    const arg = mockExecute.mock.calls[0][0];
    expect(arg.email).toBe("test@example.com");
  });

  it("should return 400 when email is missing", async () => {
    const body = { ...VALID_BODY, email: undefined };
    const res = await POST(createRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/email/i);
  });

  it("should return 400 when message is missing", async () => {
    const body = { ...VALID_BODY, message: undefined };
    const res = await POST(createRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/message/i);
  });

  it("should return 400 for invalid email format", async () => {
    const body = { ...VALID_BODY, email: "not-an-email" };
    const res = await POST(createRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/email/i);
  });

  it("should default tone to 'basic' when not provided", async () => {
    const body = { ...VALID_BODY, tone: undefined };
    await POST(createRequest(body));

    const arg = mockExecute.mock.calls[0][0];
    expect(arg.tone).toBe("basic");
  });

  it("should return 500 when use case throws", async () => {
    mockExecute.mockRejectedValueOnce(new Error("DB exploded"));

    const res = await POST(createRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to send");
  });

  it("should pass wizardResult as meta to use case", async () => {
    await POST(createRequest(VALID_BODY));

    const arg = mockExecute.mock.calls[0][0];
    expect(arg.meta).toEqual(VALID_BODY.wizardResult);
  });

  it("should create fallback wizardResult when not provided", async () => {
    const body = {
      email: "test@example.com",
      message: "Just a simple message",
    };
    await POST(createRequest(body));

    const arg = mockExecute.mock.calls[0][0];
    expect(arg.meta).toBeDefined();
    expect(arg.meta.objective).toBe("contact");
  });

  // ── Honeypot (bot detection) ─────────────────────────────────
  it("should return fake 200 when honeypot 'website' field is filled (bot)", async () => {
    const body = { ...VALID_BODY, website: "http://spam.bot" };
    const res = await POST(createRequest(body));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // Use case should NOT be called for bots
    expect(mockExecute).not.toHaveBeenCalled();
  });

  // ── XSS sanitization ────────────────────────────────────────
  it("should strip HTML tags from message via sanitizeHtml", async () => {
    const body = {
      ...VALID_BODY,
      message: '<script>alert("xss")</script>Hello world',
    };
    await POST(createRequest(body));

    const arg = mockExecute.mock.calls[0][0];
    expect(arg.message).toBe('alert("xss")Hello world');
    expect(arg.message).not.toContain("<script>");
  });

  it("should strip HTML tags from phone via sanitizeHtml", async () => {
    const body = {
      ...VALID_BODY,
      phone: '<img onerror="hack()">123456',
    };
    await POST(createRequest(body));

    const arg = mockExecute.mock.calls[0][0];
    expect(arg.phone).not.toContain("<img");
  });
});
