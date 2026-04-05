import { NextRequest, NextResponse } from 'next/server'

/**
 * Returns a shell install script that detects the host platform and downloads
 * the correct agent binary from this server.
 *
 * Usage — fully automated (recommended):
 *   curl -fsSL "https://infrawatch.example.com/api/agent/install?token=<TOKEN>" | sudo bash
 *
 * Query parameters:
 *   token  - Enrolment token from the Infrawatch UI (required for automated install)
 *   ingest - gRPC ingest address host:port (default: <server-hostname>:9443)
 *
 * Without a token, returns instructional output for manual setup.
 */
export async function GET(request: NextRequest) {
  const host = request.headers.get('host') ?? 'localhost'
  const proto = request.headers.get('x-forwarded-proto') ?? 'https'
  const serverURL = `${proto}://${host}`

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  // Default ingest address: same hostname as web server, port 9443
  const bareHost = host.split(':')[0]
  const ingestAddress = searchParams.get('ingest') ?? `${bareHost}:9443`

  const script = token
    ? buildAutomatedScript(serverURL, token, ingestAddress)
    : buildInstructionalScript(serverURL, ingestAddress)

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function buildAutomatedScript(serverURL: string, token: string, ingestAddress: string): string {
  return `#!/bin/sh
set -euo pipefail

# ── Prerequisites ──────────────────────────────────────────────────────────────
if [ "\$(id -u)" -ne 0 ]; then
  echo "Error: this script must be run as root (use: sudo bash)" >&2
  exit 1
fi

# ── Platform detection ─────────────────────────────────────────────────────────
OS=\$(uname -s | tr '[:upper:]' '[:lower:]')
case "\$OS" in
  linux) ;;
  darwin)
    echo "Error: automated service install is only supported on Linux (systemd)." >&2
    echo "To install manually on macOS, run without the token parameter." >&2
    exit 1
    ;;
  *)
    echo "Unsupported OS: \$OS" >&2
    exit 1
    ;;
esac

ARCH=\$(uname -m)
case "\$ARCH" in
  x86_64)        ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: \$ARCH" >&2
    exit 1
    ;;
esac

# ── Download binary ────────────────────────────────────────────────────────────
DEST="/usr/local/bin/infrawatch-agent"
echo "Downloading infrawatch-agent for \${OS}/\${ARCH}..."
curl -fsSL "${serverURL}/api/agent/download?os=\${OS}&arch=\${ARCH}" -o "\${DEST}"
chmod +x "\${DEST}"
echo "infrawatch-agent installed to \${DEST}"

# ── Create directories ─────────────────────────────────────────────────────────
mkdir -p /etc/infrawatch /var/lib/infrawatch/agent

# ── Write config ───────────────────────────────────────────────────────────────
cat > /etc/infrawatch/agent.toml << 'TOML_EOF'
[ingest]
address = "${ingestAddress}"

[agent]
org_token = "${token}"
data_dir   = "/var/lib/infrawatch/agent"
TOML_EOF
chmod 600 /etc/infrawatch/agent.toml
echo "Config written to /etc/infrawatch/agent.toml"

# ── Write systemd unit ─────────────────────────────────────────────────────────
cat > /etc/systemd/system/infrawatch-agent.service << 'UNIT_EOF'
[Unit]
Description=Infrawatch Agent
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/infrawatch-agent -config /etc/infrawatch/agent.toml
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT_EOF

# ── Enable and start ───────────────────────────────────────────────────────────
systemctl daemon-reload
systemctl enable --now infrawatch-agent

echo ""
echo "Infrawatch agent installed and started."
echo "Check status:  systemctl status infrawatch-agent"
echo "View logs:     journalctl -u infrawatch-agent -f"
`
}

function buildInstructionalScript(serverURL: string, ingestAddress: string): string {
  return `#!/bin/sh
set -e

INFRAWATCH_SERVER="${serverURL}"

# Detect OS
OS=\$(uname -s | tr '[:upper:]' '[:lower:]')
case "\$OS" in
  linux|darwin) ;;
  *)
    echo "Unsupported OS: \$OS" >&2
    exit 1
    ;;
esac

# Detect architecture
ARCH=\$(uname -m)
case "\$ARCH" in
  x86_64)        ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: \$ARCH" >&2
    exit 1
    ;;
esac

DEST="/usr/local/bin/infrawatch-agent"

echo "Downloading infrawatch-agent for \${OS}/\${ARCH}..."
curl -fsSL "\${INFRAWATCH_SERVER}/api/agent/download?os=\${OS}&arch=\${ARCH}" -o "\${DEST}"
chmod +x "\${DEST}"

echo ""
echo "infrawatch-agent installed to \${DEST}"
echo ""
echo "For a fully automated setup, use the one-command installer from the Infrawatch UI:"
echo "  Settings → Agent Enrolment → New Token → copy the install command"
echo ""
echo "Or set up manually:"
echo ""
echo "  1. Create config directory and file:"
echo "       sudo mkdir -p /etc/infrawatch /var/lib/infrawatch/agent"
echo "       sudo tee /etc/infrawatch/agent.toml > /dev/null <<'EOF'"
echo "       [ingest]"
echo "       address = \"${ingestAddress}\""
echo ""
echo "       [agent]"
echo "       org_token = \"<enrolment-token-from-ui>\""
echo "       data_dir  = \"/var/lib/infrawatch/agent\""
echo "       EOF"
echo "       sudo chmod 600 /etc/infrawatch/agent.toml"
echo ""
echo "  2. Create the systemd service:"
echo "       sudo tee /etc/systemd/system/infrawatch-agent.service > /dev/null <<'EOF'"
echo "       [Unit]"
echo "       Description=Infrawatch Agent"
echo "       After=network-online.target"
echo "       Wants=network-online.target"
echo ""
echo "       [Service]"
echo "       ExecStart=/usr/local/bin/infrawatch-agent -config /etc/infrawatch/agent.toml"
echo "       Restart=on-failure"
echo "       RestartSec=10"
echo "       StandardOutput=journal"
echo "       StandardError=journal"
echo ""
echo "       [Install]"
echo "       WantedBy=multi-user.target"
echo "       EOF"
echo ""
echo "  3. Enable and start:"
echo "       sudo systemctl daemon-reload"
echo "       sudo systemctl enable --now infrawatch-agent"
`
}
