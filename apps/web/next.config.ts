import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Strict mode for catching issues early
  reactStrictMode: true,
  // Enable instrumentation.ts (runs on server startup — used for agent cache prewarm)
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
