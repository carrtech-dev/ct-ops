#!/usr/bin/env bash
set -euo pipefail

# Generate dev TLS certificates for the ingest service if they don't exist
CERT_DIR="./deploy/dev-tls"
if [ ! -f "$CERT_DIR/server.crt" ] || [ ! -f "$CERT_DIR/server.key" ]; then
  echo "Generating dev TLS certificates..."
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -sha256 -days 3650 -nodes \
    -subj "/CN=infrawatch-ingest" \
    -addext "subjectAltName=DNS:ingest,DNS:localhost,IP:127.0.0.1" 2>/dev/null
  echo "TLS certificates generated."
fi

docker compose -f docker-compose.single.yml build web
docker compose -f docker-compose.single.yml down
docker compose -f docker-compose.single.yml up -d
