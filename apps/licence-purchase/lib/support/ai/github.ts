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

// Cache the file list per worker process. The tree for a mid-sized repo is
// a few hundred KB; refreshing it once an hour is plenty for support queries.
let treeCache: { repo: string; branch: string; paths: string[]; fetchedAt: number } | null = null
const TREE_TTL_MS = 60 * 60 * 1000

async function getDefaultBranch(repo: string): Promise<string> {
  const url = `https://api.github.com/repos/${repo}`
  const res = await fetch(url, { headers: apiHeaders() })
  if (!res.ok) throw new Error(`GitHub repo lookup failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { default_branch?: string }
  return data.default_branch ?? 'main'
}

async function getRepoTree(repo: string): Promise<string[]> {
  const now = Date.now()
  if (treeCache && treeCache.repo === repo && now - treeCache.fetchedAt < TREE_TTL_MS) {
    return treeCache.paths
  }
  const branch = await getDefaultBranch(repo)
  const url = `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  const res = await fetch(url, { headers: apiHeaders() })
  if (!res.ok) throw new Error(`GitHub tree failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as {
    tree?: Array<{ path: string; type: string }>
    truncated?: boolean
  }
  const paths = (data.tree ?? []).filter((n) => n.type === 'blob').map((n) => n.path)
  treeCache = { repo, branch, paths, fetchedAt: now }
  return paths
}

// Substring / token search over the repo's file paths. No GitHub code-index
// dependency — works on day-one repos and mirrors. Claude follows up with
// read_file on whichever paths look promising.
export async function searchCode(query: string): Promise<CodeSearchHit[]> {
  const repo = env.supportGithubRepo
  const allPaths = await getRepoTree(repo)
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2)
  if (terms.length === 0) return []
  const scored: Array<{ path: string; score: number }> = []
  for (const path of allPaths) {
    if (matchesBlocklist(path)) continue
    const lower = path.toLowerCase()
    let score = 0
    for (const term of terms) {
      if (lower.includes(term)) score += 1
    }
    if (score > 0) scored.push({ path, score })
  }
  scored.sort((a, b) => b.score - a.score || a.path.length - b.path.length)
  return scored.slice(0, 20).map(({ path }) => ({
    path,
    url: `https://github.com/${repo}/blob/HEAD/${path}`,
  }))
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
