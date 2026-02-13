import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/domain/src/**/*.ts", "packages/infra-*/src/**/*.ts"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@claritystructures/domain": resolve(
        __dirname,
        "packages/domain/src/index.ts",
      ),
      "@claritystructures/types": resolve(
        __dirname,
        "packages/types/src/index.ts",
      ),
      "@claritystructures/config": resolve(
        __dirname,
        "packages/config/index.ts",
      ),
    },
  },
});
