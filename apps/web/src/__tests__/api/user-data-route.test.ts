import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, DELETE } from "@/app/api/user/data/route";
import {
  createGetUserDataUseCase,
  createDeleteUserDataUseCase,
} from "@/application/di-container";

vi.mock("@/application/di-container", () => ({
  createGetUserDataUseCase: vi.fn(),
  createDeleteUserDataUseCase: vi.fn(),
}));

vi.mock("@/lib/api-guard", () => ({
  apiGuard: vi.fn(async (_req, handler) => handler()),
}));

function request(body: unknown): Request {
  return new Request("http://localhost/api/user/data", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("/api/user/data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST", () => {
    it("should return active user intake data", async () => {
      vi.mocked(createGetUserDataUseCase).mockReturnValue({
        execute: vi.fn(async () => [
          {
            id: "intake-001",
            createdAt: new Date("2026-01-01T00:00:00Z"),
            tone: "basic",
            route: "/contact/basic",
            priority: "medium",
            name: "Alice",
            email: "user@test.com",
            phone: "+34600000000",
            message: "Need help",
            status: "pending",
            spamScore: 0,
            meta: undefined,
          },
        ]),
      } as never);

      const res = await POST(request({ email: "USER@test.com" }) as never);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.email).toBe("user@test.com");
      expect(json.recordCount).toBe(1);
      expect(json.intakes[0]).toMatchObject({
        id: "intake-001",
        email: "user@test.com",
        phone: "+34600000000",
        message: "Need help",
      });
    });

    it("should return 400 for invalid email", async () => {
      const res = await POST(request({ email: "bad" }) as never);

      expect(res.status).toBe(400);
    });

    it("should return 500 on use case failure", async () => {
      vi.mocked(createGetUserDataUseCase).mockReturnValue({
        execute: vi.fn(async () => {
          throw new Error("DB down");
        }),
      } as never);

      const res = await POST(request({ email: "user@test.com" }) as never);

      expect(res.status).toBe(500);
    });
  });

  describe("DELETE", () => {
    it("should suppress user data", async () => {
      vi.mocked(createDeleteUserDataUseCase).mockReturnValue({
        execute: vi.fn(async () => ({
          suppressed: 2,
          skippedLegalHold: 1,
        })),
      } as never);

      const res = await DELETE(request({ email: "user@test.com" }) as never);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toMatchObject({
        email: "user@test.com",
        suppressed: 2,
        skippedLegalHold: 1,
      });
      expect(json.message).toContain("Suppressed 2 record");
    });

    it("should return 400 for invalid email", async () => {
      const res = await DELETE(request({ email: "bad" }) as never);

      expect(res.status).toBe(400);
    });

    it("should return 500 on use case failure", async () => {
      vi.mocked(createDeleteUserDataUseCase).mockReturnValue({
        execute: vi.fn(async () => {
          throw new Error("DB error");
        }),
      } as never);

      const res = await DELETE(request({ email: "user@test.com" }) as never);

      expect(res.status).toBe(500);
    });
  });
});
