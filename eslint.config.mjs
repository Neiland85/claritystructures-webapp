import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  {
    // Enable TypeScript parsing for all TS/TSX files
    files: ["**/*.ts", "**/*.tsx"],
    extends: [tseslint.configs.base],
  },
  {
    // Domain boundary isolation: packages/domain must not import framework code
    files: ["packages/domain/src/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "next/*",
            "react",
            "react-dom",
            "nodemailer",
            "@prisma/client",
            "@claritystructures/infra-*",
            "@claritystructures/web",
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "generated/**",
    "packages/infra-persistence/generated/**",
    "next-env.d.ts",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
  ]),
]);

export default eslintConfig;
