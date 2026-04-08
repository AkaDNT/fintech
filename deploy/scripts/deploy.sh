#!/usr/bin/env bash
set -euo pipefail

: "${REGISTRY:?REGISTRY is required}"
: "${REGISTRY_USER:?REGISTRY_USER is required}"
: "${REGISTRY_PASSWORD:?REGISTRY_PASSWORD is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"

cd /opt/fintech

echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USER" --password-stdin

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d postgres redis
docker compose -f docker-compose.prod.yml --env-file .env.prod pull api worker web
docker compose -f docker-compose.prod.yml --env-file .env.prod run --rm api npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate api worker web nginx
docker compose -f docker-compose.prod.yml --env-file .env.prod ps