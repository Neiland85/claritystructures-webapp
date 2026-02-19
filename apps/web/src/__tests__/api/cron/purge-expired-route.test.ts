import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPurgeExecute = vi.fn();

vi.mock("@/application/di-container", () => ({
  createPurgeExpiredIntakesUseCase: () => ({ execute: mockPurgeExecute }),
}));

const { POST } = await import("@/app/api/cron/purge-expired/route");

function createCronRequest(secret?: string): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) headers["authorization"] = `Bearer ${secret}`;

  return new NextRequest("http://localhost:3000/api/cron/purge-expired", {
    method: "POST",
    headers,
  });
}

describe("POST /api/cron/purge-expired", () => {
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

  it("should execute purge with valid secret", async () => {
    mockPurgeExecute
      .mockResolvedValueOnce({
        purged: 3,
        skippedLegalHold: 1,
        category: "intake_data",
      })
      .mockResolvedValueOnce({
        purged: 2,
        skippedLegalHold: 0,
        category: "unqualified_leads",
      });

    const res = await POST(createCronRequest(CRON_SECRET));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.summary.totalPurged).toBe(5);
    expect(json.summary.totalSkipped).toBe(1);
    expect(mockPurgeExecute).toHaveBeenCalledTimes(2);
  });

  it("should return 500 on use case failure", async () => {
    mockPurgeExecute.mockRejectedValueOnce(new Error("DB down"));

    const res = await POST(createCronRequest(CRON_SECRET));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("DB down");
  });
});
