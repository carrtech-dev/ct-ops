'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { postStaffMessage } from '@/lib/actions/support'

export function AdminReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(data: FormData) {
    setError(null)
    const body = String(data.get('body') ?? '').trim()
    if (!body) return
    start(async () => {
      try {
        await postStaffMessage({ ticketId, body })
        const form = document.getElementById(`admin-reply-${ticketId}`) as HTMLFormElement | null
        form?.reset()
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to send message')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Staff reply</CardTitle>
        <CardDescription>
          Posting a staff reply pauses the AI on this ticket. You can un-pause with the control above.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={`admin-reply-${ticketId}`} action={onSubmit} className="grid gap-3">
          <textarea
            name="body"
            required
            minLength={1}
            maxLength={20000}
            rows={6}
            placeholder="Write your reply to the customer…"
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div>
            <Button type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send reply'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
