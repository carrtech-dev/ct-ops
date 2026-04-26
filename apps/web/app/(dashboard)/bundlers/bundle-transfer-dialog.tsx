'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Search,
  Send,
  Server,
  WifiOff,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listHosts, type HostWithAgent } from '@/lib/actions/agents'

export type BuiltBundle = {
  blob: Blob
  fileName: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orgId: string
  buildBundle: () => Promise<BuiltBundle>
}

type Step = 'details' | 'password'

export function BundleTransferDialog({ open, onOpenChange, orgId, buildBundle }: Props) {
  const [hosts, setHosts] = useState<HostWithAgent[]>([])
  const [loadingHosts, setLoadingHosts] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [directory, setDirectory] = useState('/tmp')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<Step>('details')
  const [transferring, setTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ path: string; host: string } | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoadingHosts(true)
    setError(null)
    listHosts(orgId)
      .then((rows) => {
        if (!cancelled) setHosts(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load hosts')
      })
      .finally(() => {
        if (!cancelled) setLoadingHosts(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, orgId])

  const filteredHosts = useMemo(() => {
    const q = search.toLowerCase().trim()
    const rows = [...hosts].sort((a, b) => {
      if (a.status === b.status) {
        return (a.displayName ?? a.hostname).localeCompare(b.displayName ?? b.hostname, undefined, { sensitivity: 'base' })
      }
      return a.status === 'online' ? -1 : 1
    })
    if (!q) return rows
    return rows.filter((host) => {
      const label = host.displayName ?? host.hostname
      return (
        label.toLowerCase().includes(q) ||
        host.hostname.toLowerCase().includes(q) ||
        (host.ipAddresses ?? []).some((ip) => ip.includes(q))
      )
    })
  }, [hosts, search])

  const selectedHost = hosts.find((host) => host.id === selectedHostId) ?? null
  const canContinue = !!selectedHostId && username.trim().length > 0 && directory.trim().startsWith('/')

  function reset() {
    setSearch('')
    setSelectedHostId(null)
    setUsername('')
    setDirectory('/tmp')
    setPassword('')
    setStep('details')
    setTransferring(false)
    setError(null)
    setSuccess(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (transferring) return
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function continueToPassword() {
    setError(null)
    if (!selectedHostId) {
      setError('Select a host')
      return
    }
    if (!username.trim()) {
      setError('Enter a username')
      return
    }
    if (!directory.trim().startsWith('/')) {
      setError('Enter an absolute directory path')
      return
    }
    setStep('password')
  }

  async function transfer() {
    if (!selectedHost || !password) return
    setTransferring(true)
    setError(null)
    setSuccess(null)
    try {
      const bundle = await buildBundle()
      const form = new FormData()
      form.set('hostId', selectedHost.id)
      form.set('username', username.trim())
      form.set('password', password)
      form.set('directory', directory.trim())
      form.set('fileName', bundle.fileName)
      form.set('bundle', bundle.blob, bundle.fileName)

      const res = await fetch('/api/tools/bundle-transfer', {
        method: 'POST',
        body: form,
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; path?: string; host?: string } | null
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? `Transfer failed (${res.status})`)
      }
      setPassword('')
      setSuccess({ path: data.path ?? `${directory.trim()}/${bundle.fileName}`, host: data.host ?? selectedHost.hostname })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed')
    } finally {
      setTransferring(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="size-4" />
            Transfer bundle
          </DialogTitle>
          <DialogDescription>
            {step === 'details'
              ? 'Select the destination host, username, and directory.'
              : `Enter the SSH password for ${username.trim()}${selectedHost ? ` on ${selectedHost.displayName ?? selectedHost.hostname}` : ''}.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'details' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Host</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search hosts by name or IP"
                  className="pl-9"
                  autoFocus
                />
              </div>
              <div className="max-h-56 overflow-y-auto rounded-md border">
                {loadingHosts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredHosts.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {search ? 'No hosts match your search' : 'No hosts available'}
                  </div>
                ) : (
                  filteredHosts.map((host) => {
                    const active = host.id === selectedHostId
                    return (
                      <button
                        key={host.id}
                        type="button"
                        onClick={() => {
                          setSelectedHostId(host.id)
                          setError(null)
                        }}
                        className={`flex w-full items-center gap-3 border-b px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${
                          active ? 'bg-muted' : ''
                        }`}
                      >
                        {host.status === 'online' ? (
                          <Server className="size-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <WifiOff className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{host.displayName ?? host.hostname}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {host.displayName && host.displayName !== host.hostname ? host.hostname : host.ipAddresses?.[0] ?? 'No IP recorded'}
                          </span>
                        </span>
                        <Badge variant={host.status === 'online' ? 'default' : 'secondary'}>{host.status}</Badge>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bundle-transfer-username">Username</Label>
                <Input
                  id="bundle-transfer-username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setError(null)
                  }}
                  placeholder="e.g. deploy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundle-transfer-path">Directory</Label>
                <Input
                  id="bundle-transfer-path"
                  value={directory}
                  onChange={(event) => {
                    setDirectory(event.target.value)
                    setError(null)
                  }}
                  placeholder="/tmp"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <div className="font-medium">{selectedHost?.displayName ?? selectedHost?.hostname}</div>
              <div className="break-all text-muted-foreground">
                {username.trim()}:{directory.trim()}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bundle-transfer-password" className="flex items-center gap-1.5">
                <KeyRound className="size-3.5" />
                Password
              </Label>
              <Input
                id="bundle-transfer-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError(null)
                }}
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && password && !transferring) void transfer()
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>
              Transferred to <span className="font-medium">{success.host}</span>
              <span className="block break-all font-mono text-xs">{success.path}</span>
            </span>
          </div>
        )}

        <DialogFooter>
          {step === 'password' && (
            <Button type="button" variant="outline" onClick={() => setStep('details')} disabled={transferring} className="mr-auto">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          )}
          {step === 'details' ? (
            <Button type="button" onClick={continueToPassword} disabled={!canContinue}>
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={transfer} disabled={!password || transferring}>
              {transferring ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Transfer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
