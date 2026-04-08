# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS pruner
ARG TURBO_VERSION=2
RUN npm i -g turbo@^${TURBO_VERSION}
COPY . .
RUN turbo prune web --docker

FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ARG NEXT_DEPLOYMENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${NEXT_SERVER_ACTIONS_ENCRYPTION_KEY}
ENV NEXT_DEPLOYMENT_ID=${NEXT_DEPLOYMENT_ID}

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

RUN --mount=type=cache,target=/root/.npm npm ci

COPY --from=pruner /app/out/full/ .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ARG NEXT_DEPLOYMENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${NEXT_SERVER_ACTIONS_ENCRYPTION_KEY}
ENV NEXT_DEPLOYMENT_ID=${NEXT_DEPLOYMENT_ID}

RUN node -e "const v = process.env.NEXT_PUBLIC_API_BASE_URL || ''; console.log('NEXT_PUBLIC_API_BASE_URL length in Docker build=' + v.length); if (!v) process.exit(1)"
RUN npm --workspace apps/web run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public

USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]