# Dependency Health Matrix

## Purpose

This matrix documents the critical dependency surface of ClarityStructures WebApp and the controls used to reduce dependency, supply-chain and runtime risks.

## Matrix

| Area                    | Dependency                                        | Risk                                         | Control                                 | Current status |
| ----------------------- | ------------------------------------------------- | -------------------------------------------- | --------------------------------------- | -------------- |
| Web runtime             | next                                              | Breaking changes, SSR/runtime regressions    | CI build, Vercel preview, lockfile      | Controlled     |
| UI runtime              | react / react-dom                                 | Rendering regressions                        | Component tests, Wizard tests           | Controlled     |
| Validation              | zod                                               | Schema/runtime validation regressions        | Unit tests, API route tests             | Controlled     |
| Persistence             | prisma / @prisma/client                           | Native generation/runtime mismatch           | Prisma generate in build, lockfile      | Controlled     |
| Rate limiting           | @upstash/redis / @upstash/ratelimit               | External service failure, client API changes | Unit tests, fail-open/fail-closed tests | Controlled     |
| Security sanitization   | dompurify / isomorphic-dompurify                  | XSS/sanitization regression                  | Overrides, dependency audit             | Controlled     |
| Observability           | @sentry/nextjs                                    | Runtime integration drift                    | Build validation, preview deployment    | Controlled     |
| Testing                 | vitest / @vitest/coverage-v8 / @vitest/ui         | Version mismatch, coverage failure           | Exact stack alignment at 4.1.7          | Controlled     |
| Build tooling           | vite / rollup / esbuild                           | Bundling/runtime breakage                    | Lockfile, overrides, CI build           | Controlled     |
| Transitive dependencies | lodash, undici, yaml, protobufjs, brace-expansion | Known advisories / supply-chain drift        | pnpm overrides, audit                   | Controlled     |

## Current dependency controls

- `pnpm-lock.yaml` is committed and required.
- CI uses frozen lockfile installation.
- Critical transitive packages are pinned via `pnpm.overrides`.
- Dependency updates must go through isolated PRs.
- CI validates typecheck, lint, tests, coverage and build.
- Security audit and secret scanning are active.

## Gate semantics in CI

| Control                                    | CI behavior                                   |
| ------------------------------------------ | --------------------------------------------- |
| `pnpm install --frozen-lockfile`           | **Blocking** (job fails on error)             |
| `pnpm typecheck`                           | **Blocking**                                  |
| `pnpm lint` + `pnpm format:check`          | **Blocking**                                  |
| `pnpm test:run` + domain/integration tests | **Blocking**                                  |
| `pnpm test:coverage`                       | **Blocking**                                  |
| `pnpm build`                               | **Blocking**                                  |
| `./scripts/check-secrets.sh`               | **Blocking**                                  |
| `pnpm audit --audit-level=high`            | **Informational** (`continue-on-error: true`) |

## Review cadence

This matrix should be reviewed after:

- Any dependency PR.
- Any critical GitHub advisory.
- Any runtime version change.
- Any production/preproduction deployment change.
