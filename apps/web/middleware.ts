import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Honour an upstream-supplied request ID (load balancer, proxy) or generate one.
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()

  // Forward the ID as a request header so server components, actions, and API
  // route handlers can read it via `headers().get('x-request-id')` for logging.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Echo the ID back to the client so it appears in browser DevTools / client logs.
  response.headers.set('X-Request-Id', requestId)
  return response
}

export const config = {
  // Apply to all routes except Next.js internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
