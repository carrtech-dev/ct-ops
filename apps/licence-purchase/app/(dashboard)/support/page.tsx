import Link from 'next/link'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { listMyTickets } from '@/lib/actions/support'

export const metadata = { title: 'Support' }

function formatWhen(d: Date): string {
  return new Date(d).toLocaleString()
}

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  pending_staff: 'Waiting on us',
  pending_customer: 'Waiting on you',
  resolved: 'Resolved',
  closed: 'Closed',
}

export default async function SupportListPage() {
  const tickets = await listMyTickets()

  return (
    <>
      <PageHeader
        title="Support"
        description="Open a new ticket or follow up on an existing conversation. Our AI assistant answers first; a human takes over when needed."
      />

      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/support/new">New ticket</Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No tickets yet</CardTitle>
            <CardDescription>Questions about your licence, the agent, or deployment? Open a ticket and we will reply shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/support/new">Open first ticket</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Last activity</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((t) => (
                <tr key={t.id} className="text-foreground">
                  <td className="px-4 py-2">{t.subject}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                      {STATUS_LABEL[t.status] ?? t.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{formatWhen(t.lastMessageAt)}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/support/${t.id}`}
                      className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
