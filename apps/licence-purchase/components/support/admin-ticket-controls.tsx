'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { setAiPaused, setTicketStatus } from '@/lib/actions/support'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'pending_staff', label: 'Pending staff' },
  { value: 'pending_customer', label: 'Pending customer' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
] as const

export function AdminTicketControls({
  ticketId,
  status,
  aiPaused,
}: {
  ticketId: string
  status: string
  aiPaused: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function togglePaused() {
    setError(null)
    start(async () => {
      try {
        await setAiPaused({ ticketId, paused: !aiPaused })
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update')
      }
    })
  }

  function changeStatus(next: string) {
    setError(null)
    start(async () => {
      try {
        await setTicketStatus({ ticketId, status: next })
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update')
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={togglePaused} disabled={pending}>
          {aiPaused ? 'Resume AI' : 'Pause AI'}
        </Button>
        <select
          aria-label="Set status"
          value={status}
          disabled={pending}
          onChange={(e) => changeStatus(e.currentTarget.value)}
          className="rounded-md border bg-background px-2 py-1 text-xs text-foreground"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
