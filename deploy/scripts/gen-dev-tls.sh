#!/usr/bin/env bash
# Generates a self-signed TLS certificate for local development of the ingest
# service (gRPC on :9443). Output lands in deploy/dev-tls/server.{crt,key}.
#
# This is a thin wrapper around deploy/scripts/gen-server-cert.sh so dev and
# production cert generation share a single implementation.
#
# For production, replace with a proper certificate from your CA.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

OUT_DIR="${ROOT_DIR}/deploy/dev-tls" \
CN="localhost" \
  "${SCRIPT_DIR}/gen-server-cert.sh"

echo ""
echo "To trust this certificate in the agent config, set:"
echo "  ca_cert_file = \"${ROOT_DIR}/deploy/dev-tls/server.crt\""
