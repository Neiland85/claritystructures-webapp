/**
 * Structured Logger — zero-dependency wrapper over console.*
 *
 * Production (NODE_ENV=production): single-line JSON to stdout (Vercel-compatible).
 * Development: human-readable console output with [module] prefix.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>,
  ): void;
}

function formatError(err: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack, name: err.name };
  }
  return { message: String(err) };
}

function consoleMethod(level: LogLevel): (...args: unknown[]) => void {
  switch (level) {
    case "error":
      return console.error;
    case "warn":
      return console.warn;
    case "debug":
      return console.debug;
    default:
      return console.info;
  }
}

function emit(
  level: LogLevel,
  module: string,
  message: string,
  error?: unknown,
  extra?: Record<string, unknown>,
): void {
  const method = consoleMethod(level);
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const entry: Record<string, unknown> = {
      level,
      module,
      message,
      timestamp: new Date().toISOString(),
    };
    const formatted = formatError(error);
    if (formatted) entry.error = formatted;
    if (extra) Object.assign(entry, extra);
    method(JSON.stringify(entry));
  } else {
    const prefix = `[${module}]`;
    if (error) {
      method(prefix, message, error, ...(extra ? [extra] : []));
    } else {
      method(prefix, message, ...(extra ? [extra] : []));
    }
  }
}

/**
 * Creates a scoped logger instance for a given module.
 *
 * @param module - Identifier for the source module (e.g. "api/contact", "SubmitIntakeUseCase")
 */
export function createLogger(module: string): Logger {
  return {
    debug: (msg, ctx) => emit("debug", module, msg, undefined, ctx),
    info: (msg, ctx) => emit("info", module, msg, undefined, ctx),
    warn: (msg, ctx) => emit("warn", module, msg, undefined, ctx),
    error: (msg, err, ctx) => emit("error", module, msg, err, ctx),
  };
}
