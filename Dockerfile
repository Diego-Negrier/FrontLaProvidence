# ═══════════════════════════════════════════════════════
# 🏗️ STAGE 1: Installation des dépendances
# ═══════════════════════════════════════════════════════
FROM node:20-alpine AS deps

WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY package.json package-lock.json* ./

RUN echo "📦 Installing dependencies..." && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-timeout 300000 && \
    npm ci \
    --prefer-offline \
    --no-audit \
    --legacy-peer-deps \
    --progress=false \
    --loglevel=warn && \
    echo "✅ Dependencies installed"

# ═══════════════════════════════════════════════════════
# 🔨 STAGE 2: Build
# ═══════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY next-env.d.ts* ./
COPY public ./public
COPY app ./app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_MEDIA_BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_MEDIA_BASE_URL=$NEXT_PUBLIC_MEDIA_BASE_URL

RUN echo "🔨 Starting Next.js build..." && \
    echo "📊 Build environment:" && \
    echo "  - API_URL: $NEXT_PUBLIC_API_URL" && \
    echo "  - APP_NAME: $NEXT_PUBLIC_APP_NAME" && \
    echo "  - APP_VERSION: $NEXT_PUBLIC_APP_VERSION" && \
    echo "  - MEDIA_BASE_URL: $NEXT_PUBLIC_MEDIA_BASE_URL" && \
    npm run build && \
    echo "✅ Build completed successfully"

# ═══════════════════════════════════════════════════════
# 🚀 STAGE 3: Production
# ═══════════════════════════════════════════════════════
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3007

ENV PORT=3007
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
