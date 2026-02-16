import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Mock DI container ──────────────────────────────────────────

const mockListExecute = vi.fn();
const mockUpdateExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createListIntakesUseCase: () => ({ execute: mockListExecute }),
  createUpdateIntakeStatusUseCase: () => ({ execute: mockUpdateExecute }),
}));

vi.mock("@/lib/api-guard", () => ({
  apiGuard: (_req: NextRequest, handler: () => Promise<Response>) => handler(),
}));

const { GET, PATCH } = await import("@/app/api/triage/route");

// ── Fixtures ───────────────────────────────────────────────────

const SAMPLE_INTAKES = [
  {
    id: "intake-001",
    tone: "basic",
    route: "/contact/basic",
    priority: "medium",
    email: "alice@example.com",
    message: "Need help",
    status: "pending",
    createdAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    id: "intake-002",
    tone: "critical",
    route: "/contact/critical",
    priority: "critical",
    email: "bob@example.com",
    message: "Court proceeding",
    status: "pending",
    createdAt: new Date("2026-01-16T08:30:00Z"),
  },
];

function createGetRequest(): NextRequest {
  return new NextRequest("http://localhost:3000/api/triage", {
    method: "GET",
  });
}

function createPatchRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/triage", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── GET /api/triage ────────────────────────────────────────────

describe("GET /api/triage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListExecute.mockResolvedValue(SAMPLE_INTAKES);
  });

  it("should return all intakes", async () => {
    const res = await GET(createGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.intakes).toHaveLength(2);
    expect(json.intakes[0].id).toBe("intake-001");
  });

  it("should return empty array when no intakes", async () => {
    mockListExecute.mockResolvedValue([]);

    const res = await GET(createGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.intakes).toEqual([]);
  });

  it("should return 500 on use case failure", async () => {
    mockListExecute.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET(createGetRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch intakes");
  });
});

// ── PATCH /api/triage ──────────────────────────────────────────

describe("PATCH /api/triage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateExecute.mockResolvedValue({
      ...SAMPLE_INTAKES[0],
      status: "accepted",
    });
  });

  it("should update intake status", async () => {
    const res = await PATCH(
      createPatchRequest({ id: "intake-001", status: "accepted" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.intake.status).toBe("accepted");
  });

  it("should return 400 when id is missing", async () => {
    const res = await PATCH(createPatchRequest({ status: "accepted" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/missing/i);
  });

  it("should return 400 when status is missing", async () => {
    const res = await PATCH(createPatchRequest({ id: "intake-001" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/missing/i);
  });

  it("should return 404 when intake not found", async () => {
    mockUpdateExecute.mockResolvedValue(null);

    const res = await PATCH(
      createPatchRequest({ id: "nonexistent", status: "accepted" }),
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toMatch(/not found/i);
  });

  it("should return 500 on use case failure", async () => {
    mockUpdateExecute.mockRejectedValueOnce(new Error("Write failed"));

    const res = await PATCH(
      createPatchRequest({ id: "intake-001", status: "accepted" }),
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to update intake");
  });
});
