'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { setGlobalAiEnabled } from '@/lib/actions/support'

export function AiToggle({
  initialEnabled,
  envLocked,
}: {
  initialEnabled: boolean
  envLocked: boolean
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function toggle() {
    setError(null)
    const next = !enabled
    start(async () => {
      try {
        await setGlobalAiEnabled({ enabled: next })
        setEnabled(next)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update')
      }
    })
  }

  const effective = envLocked ? false : enabled

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-4">
      <div>
        <div className="text-sm font-medium text-foreground">
          {effective ? 'AI triage enabled' : 'AI triage disabled'}
        </div>
        <div className="text-xs text-muted-foreground">
          {effective
            ? 'Claude will respond first on new customer messages.'
            : 'All new tickets go straight to the staff inbox.'}
        </div>
        {error ? <div className="mt-1 text-xs text-destructive">{error}</div> : null}
      </div>
      <Button type="button" onClick={toggle} disabled={pending || envLocked} variant={enabled ? 'destructive' : 'default'}>
        {pending ? 'Saving…' : enabled ? 'Disable globally' : 'Enable globally'}
      </Button>
    </div>
  )
}
