import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewTicketForm } from '@/components/support/new-ticket-form'

export const metadata = { title: 'New ticket' }

export default function NewTicketPage() {
  return (
    <>
      <PageHeader
        title="New support ticket"
        description="Describe your question. Our AI assistant will answer first and a member of the team will follow up if needed."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open a ticket</CardTitle>
          <CardDescription>
            Do not paste any secrets, API tokens or licence keys — we strip them before sending
            to the AI, but the principle of least exposure applies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewTicketForm />
        </CardContent>
      </Card>
    </>
  )
}
