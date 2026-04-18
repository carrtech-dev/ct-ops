import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = { title: 'Invoices' }

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Invoices are fetched live from Stripe. See PROGRESS.md Phase 3 for implementation."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
          <CardDescription>
            Once Stripe is wired up, this page will list all invoices for your organisation with PDF downloads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For early support or manual invoice requests, email{' '}
            <a href="mailto:support@infrawatch.io" className="text-foreground underline">
              support@infrawatch.io
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </>
  )
}
