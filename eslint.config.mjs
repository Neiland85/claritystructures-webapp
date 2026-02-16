import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
