import "dotenv/config";

const url = process.env.DATABASE_URL ?? "";
const allowRemote = process.env.ALLOW_REMOTE_PRISMA_MIGRATE === "yes";

const remoteMarkers = [
  "supabase.com",
  "pooler.supabase.com",
  "neon.tech",
  "rds.amazonaws.com",
  "render.com",
  "railway.app",
];

if (!url) {
  console.error("[db-guard] DATABASE_URL is missing");
  process.exit(1);
}

const isRemote = remoteMarkers.some((marker) => url.includes(marker));

if (isRemote && !allowRemote) {
  console.error("");
  console.error("[db-guard] BLOCKED prisma migrate dev against remote DB");
  console.error("[db-guard] This DATABASE_URL looks remote.");
  console.error("[db-guard] Use local/dev DB or explicitly set:");
  console.error("[db-guard] ALLOW_REMOTE_PRISMA_MIGRATE=yes");
  console.error("");
  process.exit(1);
}

console.log("[db-guard] datasource accepted for local migration workflow");
