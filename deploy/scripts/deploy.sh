#!/usr/bin/env bash
set -euo pipefail

: "${REGISTRY:?REGISTRY is required}"
: "${REGISTRY_USER:?REGISTRY_USER is required}"
: "${REGISTRY_PASSWORD:?REGISTRY_PASSWORD is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"

cd /opt/fintech

echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USER" --password-stdin

# Check env interpolation in compose
docker compose -f docker-compose.prod.yml --env-file .env.prod config >/dev/null

# Start infra first; --wait is best when postgres/redis have healthchecks
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --wait postgres redis

# Pull app images that were built and pushed by CI
docker compose -f docker-compose.prod.yml --env-file .env.prod pull api worker web nginx

# Run migration as one-off container
docker compose -f docker-compose.prod.yml --env-file .env.prod run --rm --no-deps \
  api npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

# Recreate app containers with new images
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --force-recreate --remove-orphans \
  api worker web nginx

docker compose -f docker-compose.prod.yml --env-file .env.prod ps