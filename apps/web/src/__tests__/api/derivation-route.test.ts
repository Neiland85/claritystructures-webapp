import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock DI container ──────────────────────────────────────────

const mockConsentExecute = vi.fn();
const mockTransferExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createRequestLegalDerivationUseCase: () => ({
    execute: mockConsentExecute,
  }),
  createGenerateTransferPacketUseCase: () => ({
    execute: mockTransferExecute,
  }),
}));

vi.mock("@/lib/api-guard", () => ({
  apiGuard: (_req: NextRequest, handler: () => Promise<Response>) => handler(),
}));

const { POST } = await import("@/app/api/derivation/route");

// ── Helpers ─────────────────────────────────────────────────────

function createPostRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/derivation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── POST /api/derivation — consent action ──────────────────────

describe("POST /api/derivation (consent)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsentExecute.mockResolvedValue({ consentId: "consent-001" });
  });

  it("should record consent and return consentId", async () => {
    const res = await POST(
      createPostRequest({
        action: "consent",
        intakeId: "intake-001",
        recipientEntity: "Legal Corp SLU",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.consentId).toBe("consent-001");
    expect(mockConsentExecute).toHaveBeenCalledOnce();
  });

  it("should return 400 when intakeId is missing", async () => {
    const res = await POST(
      createPostRequest({
        action: "consent",
        recipientEntity: "Legal Corp SLU",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when recipientEntity is missing", async () => {
    const res = await POST(
      createPostRequest({
        action: "consent",
        intakeId: "intake-001",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 404 when intake not found", async () => {
    mockConsentExecute.mockRejectedValueOnce(
      new Error("Intake not found: intake-999"),
    );

    const res = await POST(
      createPostRequest({
        action: "consent",
        intakeId: "intake-999",
        recipientEntity: "Legal Corp SLU",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toMatch(/not found/i);
  });

  it("should return 500 on unexpected error", async () => {
    mockConsentExecute.mockRejectedValueOnce(new Error("DB connection lost"));

    const res = await POST(
      createPostRequest({
        action: "consent",
        intakeId: "intake-001",
        recipientEntity: "Legal Corp SLU",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("DB connection lost");
  });
});

// ── POST /api/derivation — transfer action ─────────────────────

describe("POST /api/derivation (transfer)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransferExecute.mockResolvedValue({
      transferId: "transfer-001",
      manifestHash: "abc123def456",
      packet: {},
    });
  });

  it("should generate transfer packet and return transferId + hash", async () => {
    const res = await POST(
      createPostRequest({
        action: "transfer",
        intakeId: "intake-001",
        decision: {
          modelVersion: "v2",
          rulesTriggered: ["high_urgency"],
          outcome: "critical",
          explanation: "High urgency case",
          decidedAt: "2026-02-18T10:00:00Z",
        },
        chronology: [
          { action: "intake_received", occurredAt: "2026-02-18T10:00:00Z" },
        ],
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.transferId).toBe("transfer-001");
    expect(json.manifestHash).toBe("abc123def456");
    expect(mockTransferExecute).toHaveBeenCalledOnce();
  });

  it("should return 400 when decision is missing", async () => {
    const res = await POST(
      createPostRequest({
        action: "transfer",
        intakeId: "intake-001",
        chronology: [],
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 409 when no active derivation consent", async () => {
    mockTransferExecute.mockRejectedValueOnce(
      new Error("No active derivation consent for intake: intake-001"),
    );

    const res = await POST(
      createPostRequest({
        action: "transfer",
        intakeId: "intake-001",
        decision: {
          modelVersion: "v2",
          rulesTriggered: [],
          outcome: "medium",
          explanation: "Test",
          decidedAt: "2026-02-18T10:00:00Z",
        },
        chronology: [],
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toMatch(/No active derivation consent/);
  });
});

// ── POST /api/derivation — invalid action ──────────────────────

describe("POST /api/derivation (invalid)", () => {
  it("should return 400 for invalid action", async () => {
    const res = await POST(
      createPostRequest({
        action: "invalid_action",
        intakeId: "intake-001",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 for missing action", async () => {
    const res = await POST(
      createPostRequest({
        intakeId: "intake-001",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });
});
