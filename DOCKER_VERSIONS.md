# Docker Image Versions

## Production Images

### v3 (latest) - 2026-02-23

- **Build Date**: 2026-02-23 (post-i18n changes)
- **Size**: 1.47GB (optimized with cleanup)
- **Status**: ✅ Active
- **Node Version**: 20.20.0 (Alpine)
- **Changes**:
  - Includes new i18n layer (HtmlLangSync, LanguageSwitcher, wizard.ts)
  - 28 new tests added (658/658 passing)
  - E2E tests for language-switching and wizard-flow
  - Optimized Dockerfile with node_modules cleanup
  - All 658 tests passing (100%)
- **Build Time**: ~3 minutes (with cache)
- **Docker Tag**: `neiland/claritystructures:v3`, `neiland/claritystructures:latest`

### v2 (previous) - 2026-02-22

- **Build Date**: 2026-02-22 10:46:16 CET
- **Size**: 1.43GB
- **Status**: 🔄 Available (backup)
- **Base**: 630/630 tests (100%)
- **Docker Tag**: `neiland/claritystructures:v2`, `neiland/claritystructures:v2-backup`

### v1 (legacy) - 2026-02-11

- **Build Date**: 2026-02-11 05:06:43 CET
- **Size**: 1.63GB
- **Status**: 🔄 Available (legacy)
- **Docker Tag**: `neiland/claritystructures:v1`, `neiland/claritystructures:v1-backup`

---

## Image Comparison

| Version         | Size   | Tests      | Status | Created    |
| --------------- | ------ | ---------- | ------ | ---------- |
| **v3 (latest)** | 1.47GB | 658/658 ✅ | Active | 2026-02-23 |
| v2 (backup)     | 1.43GB | 630/630 ✅ | Stable | 2026-02-22 |
| v1 (legacy)     | 1.63GB | 629/630 ⚠️ | Backup | 2026-02-11 |

---

## Layer Analysis

### v3 Optimization

```
Stage 1 (deps):  Install dependencies with pnpm
                 - pnpm-lock.yaml (precise versions)
                 - All package.json files
                 - Cache mount for .pnpm-store

Stage 2 (builder): Build application
                   - Prisma generate
                   - Full pnpm build (all packages)
                   - Next.js 16 production build
                   - Output: .next/standalone + static

Stage 3 (runner):  Production runtime
                   - Non-root user (nextjs:1001)
                   - Only .next/standalone + node_modules
                   - Cleanup: Remove .map, .ts (non-.d.ts), tests
                   - Health checks enabled
                   - Size: 1.47GB (20MB overhead for i18n)
```

---

## Rollback Instructions

### Revert to v2

```bash
docker tag neiland/claritystructures:v2 neiland/claritystructures:latest
docker compose up -d --force-recreate
```

### Revert to v1 (if needed)

```bash
docker tag neiland/claritystructures:v1 neiland/claritystructures:latest
docker compose up -d --force-recreate
```

### Quick Health Check After Rollback

```bash
./scripts/health-check.sh
curl http://localhost:3000/api/health
```

---

## Build Commands

### Build v3 Production

```bash
docker build -t neiland/claritystructures:v3 -f Dockerfile .
docker tag neiland/claritystructures:v3 neiland/claritystructures:latest
```

### Build Development Image

```bash
docker build -t neiland/claritystructures:dev -f Dockerfile.dev .
```

### Push to Registry

```bash
docker push neiland/claritystructures:v3
docker push neiland/claritystructures:latest
```

---

## Deployment Safety Checklist

- [x] Image builds successfully
- [x] Image passes runtime check (node -v)
- [x] Previous versions backed up (v1, v2, v2-backup)
- [x] All versions available for quick rollback
- [x] Health checks configured (/api/health)
- [x] Non-root user enforced (nextjs:1001)
- [x] All 658 tests passing
- [x] ESLint & Prettier validated
- [x] Security audit passed
- [ ] Tested in staging environment
- [ ] Production deployment approved

---

## Performance Metrics

### Build Performance

- **Cold Build**: ~3 minutes
- **Cached Build**: ~2 minutes
- **Layer Cache Hit Rate**: ~85%

### Runtime Performance

- **Container Start**: ~5 seconds
- **Health Check Response**: <100ms
- **Memory Usage**: ~200-300MB (baseline)
- **CPU Usage**: <50% (baseline)

### Image Size Breakdown

- Alpine Base: ~50MB
- Node + Dependencies: ~650MB
- Next.js Build (.next/standalone): ~150MB
- node_modules Runtime: ~600MB
- **Total**: 1.47GB

---

## Version History

```
v1 (2026-02-11): Initial production build
   └─ 1.63GB, 629/630 tests (99.8%)
   └─ Issue: 1 test timeout

v2 (2026-02-22): Tests fixed + Docker optimized
   └─ 1.43GB, 630/630 tests (100%)
   └─ 200MB reduction
   └─ All health checks functional

v3 (2026-02-23): i18n + new features
   └─ 1.47GB, 658/658 tests (100%)
   └─ New: HtmlLangSync, LanguageSwitcher, i18n layer
   └─ New: E2E tests (language-switching, wizard-flow)
   └─ Optimized Dockerfile with cleanup
```

---

## Notes

- **Node Version**: 20.20.0 (LTS, Alpine Linux)
- **Next.js**: 16.1.6 with Turbopack
- **Prisma**: 7.4.0
- **pnpm**: 10.29.3
- **Multi-stage build** ensures production artifacts only
- **Layer caching** via pnpm-lock.yaml for reproducible builds
- **Non-root user** for security compliance
- **Health checks** for orchestration support (Docker Swarm, Kubernetes)
