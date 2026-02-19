import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockBreachExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createCheckSlaBreachesUseCase: () => ({ execute: mockBreachExecute }),
}));

const { POST } = await import("@/app/api/cron/sla-breach-check/route");

function createCronRequest(secret?: string): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) headers["authorization"] = `Bearer ${secret}`;

  return new NextRequest("http://localhost:3000/api/cron/sla-breach-check", {
    method: "POST",
    headers,
  });
}

describe("POST /api/cron/sla-breach-check", () => {
  const CRON_SECRET = "test-cron-secret-123";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CRON_SECRET", CRON_SECRET);
  });

  it("should return 401 without authorization header", async () => {
    const res = await POST(createCronRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return 401 with wrong secret", async () => {
    const res = await POST(createCronRequest("wrong-secret"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("should return breached timers with valid secret", async () => {
    mockBreachExecute.mockResolvedValue({
      breached: 2,
      timers: [
        {
          intakeId: "intake-001",
          milestone: "acknowledgment",
          deadlineAt: new Date("2026-02-18T10:15:00Z"),
          status: "breached",
        },
        {
          intakeId: "intake-001",
          milestone: "first_contact",
          deadlineAt: new Date("2026-02-18T11:00:00Z"),
          status: "breached",
        },
      ],
    });

    const res = await POST(createCronRequest(CRON_SECRET));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.breached).toBe(2);
    expect(json.timers).toHaveLength(2);
    expect(json.timers[0].milestone).toBe("acknowledgment");
  });

  it("should handle no breaches gracefully", async () => {
    mockBreachExecute.mockResolvedValue({ breached: 0, timers: [] });

    const res = await POST(createCronRequest(CRON_SECRET));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.breached).toBe(0);
    expect(json.timers).toHaveLength(0);
  });

  it("should return 500 on use case failure", async () => {
    mockBreachExecute.mockRejectedValueOnce(new Error("Query timeout"));

    const res = await POST(createCronRequest(CRON_SECRET));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Query timeout");
  });
});
