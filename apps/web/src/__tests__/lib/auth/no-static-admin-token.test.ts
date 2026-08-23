import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_ROOTS = ["apps", "packages"];
const SKIP_DIR = new Set([
  "node_modules",
  "dist",
  ".next",
  "coverage",
  "generated",
  "__tests__",
]);

const staticToken = ["admin", "-", "token"].join("");
const defaultStub = ["change", "me"].join("");

const FORBIDDEN = [
  new RegExp(defaultStub, "i"),
  new RegExp(staticToken, "i"),
  new RegExp(`Bearer\\s+(admin|secret|token|${defaultStub})\\b`, "i"),
  /(?:ADMIN_API_TOKEN|JWT_SECRET)\s*\|\|\s*["'][^"']+["']/,
  /(?:ADMIN_API_TOKEN|JWT_SECRET)\s*=\s*["'][^"']+["']/,
];

function shouldScan(filePath: string): boolean {
  if (!/\.(ts|tsx|js|mjs|cjs)$/.test(filePath)) return false;
  if (/\.(test|spec)\.(ts|tsx|js)$/.test(filePath)) return false;
  return true;
}

function walk(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (shouldScan(full)) {
      acc.push(full);
    }
  }
  return acc;
}

describe("no static admin/API bearer token", () => {
  it("fails if a default hardcoded token reappears in source", () => {
    const files = SCAN_ROOTS.flatMap((rel) => walk(path.join(ROOT, rel)));
    const hits: string[] = [];

    for (const file of files) {
      const lines = fs.readFileSync(file, "utf8").split("\n");
      lines.forEach((line, index) => {
        const trimmed = line.trimStart();
        if (
          trimmed.startsWith("//") ||
          trimmed.startsWith("*") ||
          trimmed.startsWith("/*")
        ) {
          return;
        }
        for (const pattern of FORBIDDEN) {
          if (pattern.test(line)) {
            hits.push(
              `${path.relative(ROOT, file)}:${index + 1}: ${line.trim()}`,
            );
          }
        }
      });
    }

    expect(hits).toEqual([]);
  });
});
