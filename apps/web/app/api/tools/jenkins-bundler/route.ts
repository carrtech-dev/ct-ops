import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  type UpdateCenterPlugin,
  getLatestLtsVersion,
  getUpdateCenterForCore,
  isAllowedDownloadUrl,
  minimumJavaForCore,
  resolveWarUrl,
} from '@/lib/jenkins/update-center'
import { compareVersions } from '@/lib/version-compare'

export const runtime = 'nodejs'

export type ResolvedPlugin = {
  name: string
  requested: string
  status: 'compatible' | 'java-incompatible' | 'not-found' | 'core-incompatible'
  version?: string
  url?: string
  requiredCore?: string
  minimumJavaVersion?: string
  size?: number
  sha256?: string
  reason?: string
}

export type ResolveResponse = {
  ok: true
  coreVersion: string
  coreMinimumJava: number
  javaCompatible: boolean | null
  warUrl: string | null
  plugins: ResolvedPlugin[]
}

export type JenkinsBundlerResponse =
  | ResolveResponse
  | { ok: true; version: string }
  | { ok: false; error: string }

const LatestLtsSchema = z.object({ action: z.literal('latest-lts') })

const ResolveSchema = z.object({
  action: z.literal('resolve'),
  coreVersion: z.string().regex(/^\d+\.\d+(\.\d+)?$/, 'Expected version like 2.462.3'),
  plugins: z.array(z.string().min(1).max(200)).min(1).max(500),
  javaVersion: z.number().int().min(1).max(99).optional(),
})

const BodySchema = z.discriminatedUnion('action', [LatestLtsSchema, ResolveSchema])

function extractJavaMajor(s: string | undefined): number | null {
  if (!s) return null
  // Normalise "1.8" → 8, "11" → 11, "17.0.2" → 17.
  const m = s.match(/^\s*1\.(\d+)/) ?? s.match(/^\s*(\d+)/)
  if (!m) return null
  const n = parseInt(m[1]!, 10)
  return Number.isFinite(n) ? n : null
}

function resolvePlugins(
  names: string[],
  coreVersion: string,
  catalogue: Record<string, UpdateCenterPlugin>,
  userJava: number | null,
): ResolvedPlugin[] {
  const seen = new Set<string>()
  const out: ResolvedPlugin[] = []
  for (const raw of names) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    // Accept "name" or "name:version" or "name@version" — we always pick the
    // latest compatible version, so the user's version pin is informational.
    const name = trimmed.split(/[:@\s]/)[0]!.toLowerCase()
    if (seen.has(name)) continue
    seen.add(name)

    const p = catalogue[name]
    if (!p) {
      out.push({
        name,
        requested: trimmed,
        status: 'not-found',
        reason: 'Plugin not found in the Jenkins update catalogue',
      })
      continue
    }

    if (compareVersions(p.requiredCore, coreVersion) > 0) {
      out.push({
        name,
        requested: trimmed,
        status: 'core-incompatible',
        version: p.version,
        url: p.url,
        requiredCore: p.requiredCore,
        minimumJavaVersion: p.minimumJavaVersion,
        size: p.size,
        sha256: p.sha256,
        reason: `Requires Jenkins core ${p.requiredCore} (you have ${coreVersion})`,
      })
      continue
    }

    const pluginJava = extractJavaMajor(p.minimumJavaVersion)
    if (userJava != null && pluginJava != null && pluginJava > userJava) {
      out.push({
        name,
        requested: trimmed,
        status: 'java-incompatible',
        version: p.version,
        url: p.url,
        requiredCore: p.requiredCore,
        minimumJavaVersion: p.minimumJavaVersion,
        size: p.size,
        sha256: p.sha256,
        reason: `Requires Java ${pluginJava} (you have Java ${userJava})`,
      })
      continue
    }

    out.push({
      name,
      requested: trimmed,
      status: 'compatible',
      version: p.version,
      url: p.url,
      requiredCore: p.requiredCore,
      minimumJavaVersion: p.minimumJavaVersion,
      size: p.size,
      sha256: p.sha256,
    })
  }
  return out
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  try {
    if (parsed.data.action === 'latest-lts') {
      const version = await getLatestLtsVersion()
      return NextResponse.json({ ok: true, version } satisfies JenkinsBundlerResponse)
    }

    const { coreVersion, plugins: requested, javaVersion } = parsed.data
    const [uc, warUrl] = await Promise.all([
      getUpdateCenterForCore(coreVersion),
      resolveWarUrl(coreVersion),
    ])
    const coreMinimumJava = minimumJavaForCore(coreVersion)
    const javaCompatible = javaVersion == null ? null : javaVersion >= coreMinimumJava

    const resolved = resolvePlugins(requested, coreVersion, uc.plugins, javaVersion ?? null)

    return NextResponse.json({
      ok: true,
      coreVersion,
      coreMinimumJava,
      javaCompatible,
      warUrl,
      plugins: resolved,
    } satisfies JenkinsBundlerResponse)
  } catch (err) {
    console.error('[jenkins-bundler] error:', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    const isSafe =
      message.startsWith('Upstream returned') ||
      message.startsWith('Unable to fetch') ||
      message.startsWith('Unexpected latestCore')
    return NextResponse.json(
      { ok: false, error: isSafe ? message : 'An unexpected error occurred while contacting updates.jenkins.io' },
      { status: 502 },
    )
  }
}

/**
 * Streaming download proxy. The browser cannot fetch plugin .hpi files
 * directly due to CORS, so we pipe them through the server. URLs must be on
 * the Jenkins allow-list; otherwise the proxy refuses.
 */
export async function GET(req: NextRequest): Promise<NextResponse | Response> {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ ok: false, error: 'Missing url parameter' }, { status: 400 })
  }
  if (!isAllowedDownloadUrl(url)) {
    return NextResponse.json(
      { ok: false, error: 'URL host is not on the Jenkins download allow-list' },
      { status: 400 },
    )
  }

  const upstream = await fetch(url, { cache: 'no-store', redirect: 'follow' })
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { ok: false, error: `Upstream returned ${upstream.status}` },
      { status: 502 },
    )
  }

  const headers = new Headers()
  const ct = upstream.headers.get('content-type')
  if (ct) headers.set('content-type', ct)
  const cl = upstream.headers.get('content-length')
  if (cl) headers.set('content-length', cl)
  headers.set('cache-control', 'no-store')

  return new Response(upstream.body, { status: 200, headers })
}
