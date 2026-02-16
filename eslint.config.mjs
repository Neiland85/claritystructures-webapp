import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
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
