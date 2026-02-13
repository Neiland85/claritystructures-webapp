import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Prisma Client singleton for Prisma 7
 *
 * In Prisma 7, connection URLs are moved to prisma.config.ts for the CLI,
 * and should be passed to the constructor for the Client.
 */

const prismaClientSingleton = () => {
  const datasourceUrl =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";

  return new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as any);
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
const prismaProxy = new Proxy({} as any, {
  get(target, prop, receiver) {
    const p = getPrisma() as any;
    const value = p[prop];
    if (typeof value === "function") {
      return value.bind(p);
    }
    return value;
  },
});

export default prismaProxy as ReturnType<typeof prismaClientSingleton>;
