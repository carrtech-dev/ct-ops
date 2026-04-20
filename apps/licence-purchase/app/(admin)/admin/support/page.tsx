import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { listAllTicketsForAdmin, isSupportAiEnabled } from '@/lib/actions/support'

export const metadata = { title: 'Support · Admin' }

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  pending_staff: 'Needs response',
  pending_customer: 'Waiting on customer',
  resolved: 'Resolved',
  closed: 'Closed',
}

export default async function AdminSupportListPage() {
  const [tickets, aiEnabled] = await Promise.all([
    listAllTicketsForAdmin(),
    isSupportAiEnabled(),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Support tickets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI triage status:{' '}
            <span className={aiEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}>
              {aiEnabled ? 'enabled' : 'disabled'}
            </span>
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/support/settings">Settings</Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">AI</th>
              <th className="px-4 py-2">Last activity</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No tickets yet.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="text-foreground">
                  <td className="px-4 py-2">{t.subject}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                      {STATUS_LABEL[t.status] ?? t.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {t.aiPaused ? (
                      <span className="text-amber-700 dark:text-amber-400">paused</span>
                    ) : (
                      <span className="text-muted-foreground">active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {new Date(t.lastMessageAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/support/${t.id}`}
                      className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
