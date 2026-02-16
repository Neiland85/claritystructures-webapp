# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
WORKDIR /app

# Copy lockfile and workspace manifests first (layer cache)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/domain/package.json ./packages/domain/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/infra-persistence/package.json ./packages/infra-persistence/
COPY packages/infra-notifications/package.json ./packages/infra-notifications/

RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/
COPY . .

# Generate Prisma client + build all packages + Next.js
ENV SKIP_ENV_VALIDATION=true
RUN pnpm db:generate && pnpm build

# ============================================
# Stage 3: Runner (minimal production image)
# ============================================
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only production artifacts
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
