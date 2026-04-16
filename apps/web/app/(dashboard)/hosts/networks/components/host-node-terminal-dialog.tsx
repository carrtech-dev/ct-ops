'use client'

import { useState, useCallback } from 'react'
import { Terminal } from 'lucide-react'
import { useTerminalPanel } from '@/components/terminal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { HostNodeData } from './network-flow-nodes'

interface Props {
  data: HostNodeData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Inner form — keyed by hostId so it remounts (and re-initialises username) on each new host
function TerminalConnectForm({
  data,
  onOpenChange,
}: {
  data: HostNodeData
  onOpenChange: (open: boolean) => void
}) {
  const { openTerminal } = useTerminalPanel()
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem(`terminal-username:${data.hostId}`) ?? ''
    } catch {
      return ''
    }
  })

  const handleConnect = useCallback(() => {
    try {
      if (username.trim()) {
        localStorage.setItem(`terminal-username:${data.hostId}`, username.trim())
      }
    } catch {
      // localStorage may be unavailable
    }
    openTerminal({
      hostId: data.hostId,
      hostname: data.name,
      username: username.trim() || null,
      orgId: data.orgId,
      directAccess: false,
    })
    onOpenChange(false)
  }, [data, username, openTerminal, onOpenChange])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Connect to {data.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <Label htmlFor="host-graph-username">Username</Label>
        <Input
          id="host-graph-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. jsmith"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && username.trim()) handleConnect()
          }}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleConnect} disabled={!username.trim()}>
          <Terminal className="size-4 mr-1.5" />
          Connect
        </Button>
      </DialogFooter>
    </>
  )
}

export function HostNodeTerminalDialog({ data, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        {data && (
          <TerminalConnectForm key={data.hostId} data={data} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  )
}
