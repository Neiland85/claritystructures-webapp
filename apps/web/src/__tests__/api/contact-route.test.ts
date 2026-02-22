import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
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
  it("should return 200 for valid request", async () => {
    const res = await POST(createRequest(VALID_BODY));
    expect(res.status).toBe(200);
  });

  it("should return 400 if consent is missing", async () => {
    const { consent: _, ...body } = VALID_BODY;
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
  });

  it("should return 400 if consent is false", async () => {
    const body = { ...VALID_BODY, consent: false };
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    const body = { ...VALID_BODY, email: "not-an-email" };
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
  });

  it("should return 400 if message is too short", async () => {
    const body = { ...VALID_BODY, message: "short" };
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
  });

  it("should return 400 if honeypot field is filled", async () => {
    const body = { ...VALID_BODY, website: "spam-bot-value" };
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
  });

  it("should accept request without consentVersion (defaults to v1)", async () => {
    const { consentVersion: _, ...body } = VALID_BODY;
    const res = await POST(createRequest(body));
    expect(res.status).toBe(200);
  });
});
