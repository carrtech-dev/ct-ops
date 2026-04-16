'use client'

import { useState, useEffect, useCallback } from 'react'
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

export function HostNodeTerminalDialog({ data, open, onOpenChange }: Props) {
  const { openTerminal } = useTerminalPanel()
  const [username, setUsername] = useState('')

  // Load saved username whenever the target host changes
  useEffect(() => {
    if (!data) return
    try {
      setUsername(localStorage.getItem(`terminal-username:${data.hostId}`) ?? '')
    } catch {
      setUsername('')
    }
  }, [data])

  const handleConnect = useCallback(() => {
    if (!data) return
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

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
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
      </DialogContent>
    </Dialog>
  )
}
