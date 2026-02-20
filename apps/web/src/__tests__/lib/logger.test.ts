import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLogger } from "@/lib/logger";

describe("createLogger", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should return a logger with debug, info, warn, error methods", () => {
    const logger = createLogger("test");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("should call console.debug for debug level", () => {
    vi.stubEnv("NODE_ENV", "development");
    const logger = createLogger("test-mod");
    logger.debug("debug msg");
    expect(console.debug).toHaveBeenCalledWith("[test-mod]", "debug msg");
  });

  it("should call console.warn for warn level", () => {
    vi.stubEnv("NODE_ENV", "development");
    const logger = createLogger("rate-limit");
    logger.warn("limit reached", { ip: "1.2.3.4" });
    expect(console.warn).toHaveBeenCalledWith("[rate-limit]", "limit reached", {
      ip: "1.2.3.4",
    });
  });

  it("should call console.info for info level", () => {
    vi.stubEnv("NODE_ENV", "development");
    const logger = createLogger("api");
    logger.info("request received");
    expect(console.info).toHaveBeenCalledWith("[api]", "request received");
  });

  it("should call console.error with error object in dev mode", () => {
    vi.stubEnv("NODE_ENV", "development");
    const logger = createLogger("api/contact");
    const err = new Error("DB failed");
    logger.error("Failed to process", err);
    expect(console.error).toHaveBeenCalledWith(
      "[api/contact]",
      "Failed to process",
      err,
    );
  });

  it("should emit JSON in production mode", () => {
    vi.stubEnv("NODE_ENV", "production");
    const logger = createLogger("api/triage");
    logger.error("Fetch failed", new Error("timeout"));

    expect(console.error).toHaveBeenCalledTimes(1);
    const jsonStr = (console.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const parsed = JSON.parse(jsonStr);

    expect(parsed.level).toBe("error");
    expect(parsed.module).toBe("api/triage");
    expect(parsed.message).toBe("Fetch failed");
    expect(parsed.timestamp).toBeDefined();
    expect(parsed.error.message).toBe("timeout");
    expect(parsed.error.name).toBe("Error");
  });

  it("should serialize non-Error objects in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const logger = createLogger("test");
    logger.error("Unknown err", "string-error");

    const jsonStr = (console.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const parsed = JSON.parse(jsonStr);
    expect(parsed.error.message).toBe("string-error");
  });

  it("should include extra context in production JSON", () => {
    vi.stubEnv("NODE_ENV", "production");
    const logger = createLogger("cron/purge");
    logger.info("Purge complete", { deleted: 5 });

    const jsonStr = (console.info as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const parsed = JSON.parse(jsonStr);
    expect(parsed.module).toBe("cron/purge");
    expect(parsed.message).toBe("Purge complete");
    expect(parsed.deleted).toBe(5);
  });
});
