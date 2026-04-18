FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10 --activate

# --- Dependencies stage ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/licence-purchase/package.json ./apps/licence-purchase/
RUN pnpm install --frozen-lockfile
# Resolve pnpm virtual-store symlinks for drizzle-orm and postgres so migrate.js
# works inside the standalone Next.js runtime output.
RUN node -e "\
const {execFileSync}=require('child_process');\
const path=require('path');\
const opts={paths:['/app/apps/licence-purchase']};\
const dm=path.dirname(require.resolve('drizzle-orm',opts));\
const pg=path.dirname(require.resolve('postgres',opts));\
execFileSync('mkdir',['-p','/migrate-deps']);\
execFileSync('cp',['-rL',dm,'/migrate-deps/drizzle-orm']);\
execFileSync('cp',['-rL',pg,'/migrate-deps/postgres']);\
"

# --- Builder stage ---
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/licence-purchase/ ./apps/licence-purchase/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/licence-purchase/node_modules ./apps/licence-purchase/node_modules

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time placeholders — DATABASE_URL / STRIPE_* etc. are not required to build.
ARG DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder
ARG BETTER_AUTH_SECRET=build-time-placeholder
ARG BETTER_AUTH_URL=http://localhost:3001

WORKDIR /app/apps/licence-purchase
RUN pnpm run build

# --- Runner stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/licence-purchase/public ./apps/licence-purchase/public

RUN mkdir -p apps/licence-purchase/.next && chown nextjs:nodejs apps/licence-purchase/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/licence-purchase/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/licence-purchase/.next/static ./apps/licence-purchase/.next/static

COPY --from=builder --chown=nextjs:nodejs /app/apps/licence-purchase/migrate.js ./apps/licence-purchase/migrate.js
COPY --chown=nextjs:nodejs apps/licence-purchase/lib/db/migrations ./apps/licence-purchase/lib/db/migrations

COPY --from=deps --chown=nextjs:nodejs /migrate-deps/drizzle-orm ./node_modules/drizzle-orm
COPY --from=deps --chown=nextjs:nodejs /migrate-deps/postgres ./node_modules/postgres

USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/licence-purchase
CMD ["node", "server.js"]
