#!/bin/sh
set -e

# Ensure the agent-dist volume mount is writable by the nextjs user.
# Docker named volumes are created as root; this fixes ownership on each start.
if [ -d "/var/lib/infrawatch/agent-dist" ]; then
  chown -R nextjs:nodejs /var/lib/infrawatch/agent-dist
fi

exec su-exec nextjs sh -c "node migrate.js && node server.js"
