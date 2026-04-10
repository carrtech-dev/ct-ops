#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Infrawatch — Local Development
#
# Starts the database container and runs the Next.js dev server with Turbopack.
# Changes to the web app are reflected instantly (hot reload).
#
# Usage:
#   ./dev.sh          Start database + Next.js dev server
#   ./dev.sh --db     Start database only (for running pnpm dev manually)
#   ./dev.sh --down   Stop the dev database container
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---- Handle --down flag ----
if [[ "${1:-}" == "--down" ]]; then
  docker compose -f docker-compose.dev.yml down
  echo "Dev database stopped."
  exit 0
fi

DB_ONLY=false
if [[ "${1:-}" == "--db" ]]; then
  DB_ONLY=true
fi

# ---- Bootstrap .env files if missing ----
# Root .env (used by docker-compose.dev.yml for DB credentials)
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    chmod 600 .env
  fi
fi

# Web app .env.local (used by Next.js)
if [ ! -f "apps/web/.env.local" ]; then
  if [ -f "apps/web/.env.example" ]; then
    cp apps/web/.env.example apps/web/.env.local
    chmod 600 apps/web/.env.local
    echo "Created apps/web/.env.local from .env.example."
  fi
fi

# The root .env doesn't have DB credentials by default (it's for start.sh).
# docker-compose.dev.yml reads POSTGRES_USER etc. from .env — ensure they exist.
source .env 2>/dev/null || true
export POSTGRES_USER="${POSTGRES_USER:-infrawatch}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-infrawatch}"
export POSTGRES_DB="${POSTGRES_DB:-infrawatch}"
export POSTGRES_PORT="${POSTGRES_PORT:-5432}"

# ---- Start database ----
echo "Starting dev database..."
docker compose -f docker-compose.dev.yml up -d

echo "Waiting for database to be healthy..."
until docker compose -f docker-compose.dev.yml exec -T db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done
echo "Database ready."

# ---- Run migrations ----
echo "Running database migrations..."
cd apps/web
pnpm run db:migrate
cd "$SCRIPT_DIR"

if $DB_ONLY; then
  echo ""
  echo "Database running on localhost:${POSTGRES_PORT}."
  echo "Run your dev server manually:  cd apps/web && pnpm dev"
  exit 0
fi

# ---- Start Next.js dev server ----
echo ""
echo "Starting Next.js dev server (Turbopack)..."
echo "  Web UI:  http://localhost:3000"
echo "  DB:      localhost:${POSTGRES_PORT}"
echo ""
cd apps/web
exec pnpm dev
