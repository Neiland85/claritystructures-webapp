import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const executeMock = vi.fn();

vi.mock("@/application/di-container", () => ({
  createSubmitIntakeUseCase: vi.fn(() => ({
    execute: executeMock,
  })),
}));

vi.mock("@/lib/logger", () => ({
  createLogger: vi.fn(() => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  })),
}));

const { POST } = await import("@/app/api/contact/route");

function createRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "vitest-agent",
      "x-forwarded-for": "127.0.0.1",
      ...headers,
    },
  });
}

const VALID_BODY = {
  name: "Test User",
  email: "test@example.com",
  message: "I need help with a digital forensics case involving data breach",
  tone: "basic",
  consent: true,
  consentVersion: "v1",
  wizardResult: {
    clientProfile: "private_individual",
    urgency: "time_sensitive",
    incident: "Data breach suspected",
    devices: 1,
    actionsTaken: [],
    evidenceSources: [],
    objective: "contact",
  },
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    executeMock.mockReset();
    executeMock.mockResolvedValue({
      record: {
        id: "intake-001",
        email: "test@example.com",
        message: VALID_BODY.message,
        tone: "basic",
        priority: "medium",
        route: "/contact/basic",
        status: "pending",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        meta: VALID_BODY.wizardResult,
      },
      decision: {
        decision: {
          priority: "medium",
          route: "/contact/basic",
          decisionModelVersion: "test-model",
        },
        explanation: {
          reasons: [],
        },
      },
    });
  });

  it("should return 200 for valid request", async () => {
    const res = await POST(createRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      success: true,
      intakeId: "intake-001",
      priority: "medium",
      route: "/contact/basic",
    });
  });

  it("should call SubmitIntakeUseCase with canonical payload and consent metadata", async () => {
    const res = await POST(createRequest(VALID_BODY));

    expect(res.status).toBe(200);
    expect(executeMock).toHaveBeenCalledOnce();

    const [input, consentMeta] = executeMock.mock.calls[0];

    expect(input).toMatchObject({
      name: "Test User",
      email: "test@example.com",
      message: VALID_BODY.message,
      tone: "basic",
      status: "pending",
      meta: VALID_BODY.wizardResult,
    });

    expect(consentMeta).toMatchObject({
      consentVersion: "v1",
      userAgent: "vitest-agent",
    });

    expect(consentMeta.ipHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should return 400 if consent is missing", async () => {
    const { consent: _, ...body } = VALID_BODY;
    const res = await POST(createRequest(body));

    expect(res.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it("should return 400 if consent is false", async () => {
    const body = { ...VALID_BODY, consent: false };
    const res = await POST(createRequest(body));

    expect(res.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it("should return 400 if email is invalid", async () => {
    const body = { ...VALID_BODY, email: "not-an-email" };
    const res = await POST(createRequest(body));

    expect(res.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it("should return 400 if message is too short", async () => {
    const body = { ...VALID_BODY, message: "short" };
    const res = await POST(createRequest(body));

    expect(res.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it("should return 400 if honeypot field is filled", async () => {
    const body = { ...VALID_BODY, website: "spam-bot-value" };
    const res = await POST(createRequest(body));

    expect(res.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it("should accept request without consentVersion (defaults to v1)", async () => {
    const { consentVersion: _, ...body } = VALID_BODY;
    const res = await POST(createRequest(body));

    expect(res.status).toBe(200);

    const [, consentMeta] = executeMock.mock.calls[0];
    expect(consentMeta.consentVersion).toBe("v1");
  });

  it("should return 500 when submit use case fails", async () => {
    executeMock.mockRejectedValueOnce(new Error("DB down"));

    const res = await POST(createRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Server error" });
  });
});
