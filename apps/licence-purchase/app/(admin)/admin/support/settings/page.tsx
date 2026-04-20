import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { supportSettings } from '@/lib/db/schema'
import { env } from '@/lib/env'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AiToggle } from '@/components/support/ai-toggle'

export const metadata = { title: 'Support settings · Admin' }

export default async function SupportSettingsPage() {
  const settings = await db.query.supportSettings.findFirst({
    where: eq(supportSettings.id, 'singleton'),
  })
  const aiEnabled = settings?.aiEnabled ?? true
  const killSwitchEnv = env.supportAiKillSwitch

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Support settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Controls for the AI triage assistant on customer support tickets.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">AI triage</CardTitle>
          <CardDescription>
            When enabled, Claude drafts an initial reply on every new customer message. When disabled,
            new tickets are routed straight to the staff inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {killSwitchEnv ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              The <code className="font-mono">SUPPORT_AI_KILL_SWITCH</code> environment variable is
              set — AI is force-disabled regardless of the toggle below.
            </div>
          ) : null}
          <AiToggle initialEnabled={aiEnabled} envLocked={killSwitchEnv} />
        </CardContent>
      </Card>
    </div>
  )
}
