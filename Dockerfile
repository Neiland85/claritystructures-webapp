# Production Dockerfile
# Multi-stage build optimized for Next.js 16 with pnpm monorepo
# Size optimized with layer caching and cleanup

ARG NODE_VERSION=20-alpine

# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:${NODE_VERSION} AS deps

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
WORKDIR /app

# Copy lockfile, workspace config, .npmrc and ALL package.json files (layer cache)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/web/package.json ./apps/web/
COPY packages/config/package.json ./packages/config/
COPY packages/domain/package.json ./packages/domain/
COPY packages/infra-notifications/package.json ./packages/infra-notifications/
COPY packages/infra-persistence/package.json ./packages/infra-persistence/
COPY packages/types/package.json ./packages/types/

# Install all workspace dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build application
# ============================================
FROM node:${NODE_VERSION} AS builder

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
WORKDIR /app

# Copy source code first
COPY . .

# Overlay dependency tree from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Build environment
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production

# Generate Prisma client and build all packages
RUN pnpm db:generate && pnpm build

# ============================================
# Stage 3: Production runtime (optimized)
# ============================================
FROM node:${NODE_VERSION} AS runner

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built application (Next.js standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy runtime dependencies and cleanup unnecessary files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Cleanup: Remove unnecessary files from node_modules to reduce image size
# Keep only production-needed files (no .map, tests, or TypeScript sources)
RUN find ./node_modules -type f -name "*.map" -delete && \
    find ./node_modules -type f \( -name "*.md" -o -name "*.ts" \) ! -name "*.d.ts" ! -path "*/node_modules/prisma/prisma-client/*" -delete && \
    find ./node_modules -type d \( -name "test" -o -name "tests" -o -name "__tests__" -o -name "docs" \) -exec rm -rf {} + 2>/dev/null || true && \
    rm -rf ./node_modules/.bin/tsc* ./node_modules/.bin/prisma 2>/dev/null || true && \
    true

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "apps/web/server.js"]
