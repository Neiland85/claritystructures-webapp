# Docker Image Versions

## Production Images

### v2 (latest) - 2026-02-22

- **Build Date**: 2026-02-22 10:46:16 CET
- **Size**: 1.43GB
- **Status**: ✅ Active
- **Changes**:
  - Updated Dockerfile with optimized multi-stage build
  - Added `serverExternalPackages` config for Prisma/pg modules
  - Improved layer caching strategy
  - Added health checks
- **Docker Tag**: `neiland/claritystructures:v2`, `neiland/claritystructures:latest`

### v1 (previous) - 2026-02-11

- **Build Date**: 2026-02-11 05:06:43 CET
- **Size**: 1.63GB
- **Status**: 🔄 Available (backup)
- **Docker Tag**: `neiland/claritystructures:v1`, `neiland/claritystructures:v1-backup`

## Rollback Instructions

If v2 has issues in production:

```bash
# Revert to v1
docker pull neiland/claritystructures:v1
docker tag neiland/claritystructures:v1 neiland/claritystructures:latest
docker compose up --force-recreate

# Or use v1-backup
docker pull neiland/claritystructures:v1-backup
docker tag neiland/claritystructures:v1-backup neiland/claritystructures:latest
docker compose up --force-recreate
```

## Build Commands

```bash
# Build production image
docker build -t neiland/claritystructures:v2 -f Dockerfile .

# Build development image
docker build -t neiland/claritystructures:dev -f Dockerfile.dev .

# Push to registry
docker push neiland/claritystructures:v2
docker push neiland/claritystructures:latest
```

## Deployment Safety Checklist

- [x] Image builds successfully
- [x] Image passes runtime check
- [x] Previous version backed up (v1-backup)
- [x] Both versions available for quick rollback
- [x] Health checks configured
- [x] Non-root user enforced
- [ ] Tested in staging environment
- [ ] Production deployment approved

## Notes

- v2 is 200MB smaller than v1 (optimized layer caching)
- Turbopack Prisma/pg module handling improved
- Build time: ~2 minutes with caché, ~5 minutes cold build
