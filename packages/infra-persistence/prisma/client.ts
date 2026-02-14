import { PrismaClient } from "../generated/prisma/index";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Prisma Client singleton for Prisma 7
 *
 * Uses @prisma/adapter-pg for direct PostgreSQL connection.
 * CLI commands (migrate, generate) use prisma.config.ts for the URL.
 */

const prismaClientSingleton = () => {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

let _prisma: ReturnType<typeof prismaClientSingleton> | undefined;

const getPrisma = () => {
  if (globalThis.prisma) return globalThis.prisma;
  if (!_prisma) {
    _prisma = prismaClientSingleton();
    if (process.env.NODE_ENV !== "production") globalThis.prisma = _prisma;
  }
  return _prisma;
};

/**
 * Lazy-loaded Prisma Client.
 * Only instantiates the real PrismaClient on first property access.
 */
const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const p = getPrisma();
    const value = (p as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (value as Function).bind(p);
    }
    return value;
  },
});

export default prismaProxy as PrismaClient;
