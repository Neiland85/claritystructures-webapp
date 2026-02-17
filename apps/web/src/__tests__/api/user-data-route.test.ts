import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock DI container ──────────────────────────────────────────

const mockGetExecute = vi.fn();
const mockDeleteExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createGetUserDataUseCase: () => ({ execute: mockGetExecute }),
  createDeleteUserDataUseCase: () => ({ execute: mockDeleteExecute }),
}));

vi.mock("@/lib/api-guard", () => ({
  apiGuard: (_req: NextRequest, handler: () => Promise<Response>) => handler(),
}));

const { POST, DELETE } = await import("@/app/api/user/data/route");

// ── Helpers ─────────────────────────────────────────────────────

function createRequest(method: string, body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/user/data", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── POST /api/user/data (Access) ────────────────────────────────

describe("POST /api/user/data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetExecute.mockResolvedValue([
      {
        id: "i-1",
        email: "alice@example.com",
        createdAt: new Date("2026-01-15T10:00:00Z"),
        tone: "basic",
        priority: "medium",
        status: "pending",
        message: "Need help",
        route: "/contact/basic",
      },
    ]);
  });

  it("should return user data for valid email", async () => {
    const res = await POST(
      createRequest("POST", { email: "alice@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.email).toBe("alice@example.com");
    expect(json.recordCount).toBe(1);
    expect(json.intakes).toHaveLength(1);
    expect(json.intakes[0].id).toBe("i-1");
  });

  it("should return 400 for invalid email", async () => {
    const res = await POST(createRequest("POST", { email: "not-an-email" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return 400 when email is missing", async () => {
    const res = await POST(createRequest("POST", {}));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should return empty intakes for unknown email", async () => {
    mockGetExecute.mockResolvedValue([]);

    const res = await POST(
      createRequest("POST", { email: "unknown@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.recordCount).toBe(0);
    expect(json.intakes).toEqual([]);
  });

  it("should return 500 on use case failure", async () => {
    mockGetExecute.mockRejectedValueOnce(new Error("DB down"));

    const res = await POST(
      createRequest("POST", { email: "alice@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch user data");
  });
});

// ── DELETE /api/user/data (Suppression) ─────────────────────────

describe("DELETE /api/user/data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteExecute.mockResolvedValue({ deleted: 2 });
  });

  it("should delete user data for valid email", async () => {
    const res = await DELETE(
      createRequest("DELETE", { email: "alice@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.email).toBe("alice@example.com");
    expect(json.deleted).toBe(2);
    expect(json.message).toMatch(/deleted 2 record/i);
  });

  it("should return 400 for invalid email", async () => {
    const res = await DELETE(createRequest("DELETE", { email: "bad" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it("should handle zero records gracefully", async () => {
    mockDeleteExecute.mockResolvedValue({ deleted: 0 });

    const res = await DELETE(
      createRequest("DELETE", { email: "nobody@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.deleted).toBe(0);
    expect(json.message).toMatch(/no records found/i);
  });

  it("should return 500 on use case failure", async () => {
    mockDeleteExecute.mockRejectedValueOnce(new Error("DB error"));

    const res = await DELETE(
      createRequest("DELETE", { email: "alice@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to delete user data");
  });
});
