import { defineConfig } from "prisma/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

export default defineConfig({
  schema: path.join(root, "packages/infra-persistence/prisma/schema.prisma"),
  migrations: {
    path: path.join(root, "packages/infra-persistence/prisma/migrations"),
  },
  datasource: {
    url: "postgresql://postgres:SCd7dHXw3VRacbmX@db.ityzrmacuxbxhpzopxea.supabase.co:5432/postgres",
  },
});
