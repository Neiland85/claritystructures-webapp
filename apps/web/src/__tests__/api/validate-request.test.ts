import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  validateRequest,
  sanitizeHtml,
  isBot,
} from "../../lib/api/validate-request";

describe("API Validation", () => {
  describe("validateRequest", () => {
    const TestSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
    });

    it("should validate correct input", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        body: JSON.stringify({ name: "John Doe", email: "john@example.com" }),
      });

      const result = await validateRequest(request, TestSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
      }
    });

    it("should reject invalid input", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        body: JSON.stringify({ name: "J", email: "invalid" }),
      });

      const result = await validateRequest(request, TestSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
      }
    });

    it("should handle invalid JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        body: "invalid json",
      });

      const result = await validateRequest(request, TestSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
      }
    });
  });

  describe("sanitizeHtml", () => {
    it("should remove HTML tags", () => {
      const dirty = '<script>alert("xss")</script>Hello World';
      const clean = sanitizeHtml(dirty);

      expect(clean).toBe("Hello World");
      expect(clean).not.toContain("<script>");
    });

    it("should keep text content", () => {
      const dirty = "<p>Hello</p> <b>World</b>";
      const clean = sanitizeHtml(dirty);

      expect(clean).toContain("Hello");
      expect(clean).toContain("World");
    });

    it("should handle empty string", () => {
      expect(sanitizeHtml("")).toBe("");
    });
  });

  describe("isBot", () => {
    it("should detect bot via honeypot", () => {
      expect(isBot({ website: "http://spam.com" })).toBe(true);
    });

    it("should allow empty honeypot", () => {
      expect(isBot({ website: "" })).toBe(false);
    });

    it("should allow undefined honeypot", () => {
      expect(isBot({})).toBe(false);
    });
  });
});
