import Link from 'next/link'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listInvoicesForOrganisation } from '@/lib/actions/invoices'

export const metadata = { title: 'Invoices' }

function formatAmount(amountInSmallestUnit: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInSmallestUnit / 100)
  } catch {
    return `${(amountInSmallestUnit / 100).toFixed(2)} ${currency.toUpperCase()}`
  }
}

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' {
  if (status === 'paid') return 'default'
  if (status === 'uncollectible' || status === 'void') return 'destructive'
  return 'secondary'
}

export default async function InvoicesPage() {
  const rows = await listInvoicesForOrganisation()

  return (
    <>
      <PageHeader
        title="Invoices"
        description="All invoices for your organisation. Click through to view or download PDFs on Stripe."
      />

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No invoices yet</CardTitle>
            <CardDescription>
              Invoices appear here once a purchase has been completed.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {rows.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{invoice.number ?? invoice.stripeInvoiceId}</span>
                      <Badge variant={statusVariant(invoice.status)} className="capitalize">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">
                      {formatAmount(invoice.amountDue, invoice.currency)}
                    </div>
                    {invoice.hostedInvoiceUrl ? (
                      <Link
                        href={invoice.hostedInvoiceUrl}
                        className="text-xs text-foreground underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    ) : null}
                    {invoice.pdfUrl ? (
                      <Link
                        href={invoice.pdfUrl}
                        className="text-xs text-foreground underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
