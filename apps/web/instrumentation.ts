/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * Pre-warms the agent binary cache so every platform binary is available
 * immediately, even on a fresh server or after a new release ships.
 */
export async function register() {
  // Only run in the Node.js runtime (not Edge), and only on the server.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { prewarmAgentCache } = await import('./lib/agent/cache-prewarm')
  await prewarmAgentCache()
}
