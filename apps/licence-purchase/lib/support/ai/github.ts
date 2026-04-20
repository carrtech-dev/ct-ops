import { env } from '@/lib/env'

// Minimal read-only GitHub client for the support AI worker.
// Uses the REST API with a fine-grained PAT. All requests use the single
// repo configured via SUPPORT_GITHUB_REPO.

export type CodeSearchHit = { path: string; url: string; snippet?: string }

function apiHeaders(): Record<string, string> {
  const token = env.supportGithubReadonlyToken
  const h: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'infrawatch-support-ai/1.0',
  }
  if (token) h.authorization = `Bearer ${token}`
  return h
}

function matchesBlocklist(path: string): boolean {
  const patterns = env.supportGithubRepoBlocklist
  for (const pattern of patterns) {
    if (globMatch(pattern, path)) return true
  }
  return false
}

// Very small glob → RegExp conversion for '*' and '**'. No character classes.
function globMatch(pattern: string, path: string): boolean {
  const re = new RegExp(
    '^' +
      pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '::DOUBLE::')
        .replace(/\*/g, '[^/]*')
        .replace(/::DOUBLE::/g, '.*') +
      '$',
  )
  return re.test(path)
}

export async function searchCode(query: string): Promise<CodeSearchHit[]> {
  const repo = env.supportGithubRepo
  const q = encodeURIComponent(`${query} repo:${repo}`)
  const url = `https://api.github.com/search/code?q=${q}&per_page=10`
  const res = await fetch(url, { headers: apiHeaders() })
  if (!res.ok) {
    throw new Error(`GitHub search failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { items?: Array<{ path: string; html_url: string }> }
  const items = data.items ?? []
  return items
    .filter((i) => !matchesBlocklist(i.path))
    .map((i) => ({ path: i.path, url: i.html_url }))
}

export async function readFile(path: string): Promise<{ path: string; content: string }> {
  if (matchesBlocklist(path)) {
    throw new Error(`Path is blocked by SUPPORT_GITHUB_REPO_BLOCKLIST: ${path}`)
  }
  const repo = env.supportGithubRepo
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURI(path)}`
  const res = await fetch(url, { headers: apiHeaders() })
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { content?: string; encoding?: string }
  if (!data.content) throw new Error(`No content returned for ${path}`)
  const raw = data.encoding === 'base64' ? Buffer.from(data.content, 'base64').toString('utf-8') : data.content
  // Hard cap what we feed the model — 40 KB is enough for most source files
  // and prevents a runaway tool call from exhausting the context window.
  const capped = raw.length > 40_000 ? raw.slice(0, 40_000) + '\n… [truncated]' : raw
  return { path, content: capped }
}
