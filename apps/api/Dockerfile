# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS pruner
ARG TURBO_VERSION=2
RUN npm i -g turbo@^${TURBO_VERSION}
COPY . .
RUN turbo prune api --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

RUN --mount=type=cache,target=/root/.npm npm ci

COPY --from=pruner /app/out/full/ .

RUN npm --workspace packages/db run prisma:generate \
 && npm --workspace packages/db run build \
 && npm --workspace packages/shared run build \
 && npm --workspace apps/api run build \
 && npm prune --omit=dev

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder --chown=node:node /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=node:node /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder --chown=node:node /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder --chown=node:node /app/packages/shared/dist ./packages/shared/dist

USER node
CMD ["node", "apps/api/dist/main.js"]