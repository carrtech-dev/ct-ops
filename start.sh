#!/usr/bin/env bash
set -euo pipefail

# Generate dev TLS certificates for the ingest service if they don't exist
CERT_DIR="./deploy/dev-tls"
if [ ! -f "$CERT_DIR/server.crt" ] || [ ! -f "$CERT_DIR/server.key" ]; then
  echo "Generating dev TLS certificates..."
  mkdir -p "$CERT_DIR"

  # Collect all non-loopback IPv4 addresses to include as SANs so remote agents can connect
  if command -v ip &>/dev/null; then
    LOCAL_IPS=$(ip -4 addr show scope global 2>/dev/null | awk '/inet / {split($2,a,"/"); print "IP:" a[1]}' | tr '\n' ',' | sed 's/,$//')
  else
    LOCAL_IPS=$(ifconfig 2>/dev/null | awk '/inet / && !/127\.0\.0\.1/ {print "IP:" $2}' | tr '\n' ',' | sed 's/,$//')
  fi
  SAN="DNS:ingest,DNS:localhost,IP:127.0.0.1"
  if [ -n "$LOCAL_IPS" ]; then
    SAN="${SAN},${LOCAL_IPS}"
  fi

  openssl req -x509 -newkey rsa:4096 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -sha256 -days 3650 -nodes \
    -subj "/CN=infrawatch-ingest" \
    -addext "subjectAltName=${SAN}" 2>/dev/null
  echo "TLS certificates generated (SANs: ${SAN})."
fi

docker compose -f docker-compose.single.yml build web ingest
docker compose -f docker-compose.single.yml pull
docker compose -f docker-compose.single.yml down
docker compose -f docker-compose.single.yml up -d

# Wait for the DB to be ready and apply any pending migrations from the host.
# This is a safety net: the web container also runs migrate.js on startup, but
# Docker layer caching can cause a rebuilt image to miss newly added migration
# files if the builder layer was cached before the file existed.
echo "Waiting for database to be ready..."
until docker compose -f docker-compose.single.yml exec db pg_isready -U infrawatch -d infrawatch &>/dev/null; do
  sleep 1
done
echo "Applying database migrations..."
pnpm --filter web run db:migrate
