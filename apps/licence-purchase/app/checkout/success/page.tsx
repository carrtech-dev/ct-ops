import Link from 'next/link'
import { and, desc, eq, gte, isNull } from 'drizzle-orm'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/licence/copy-button'
import { CheckCircle2, Clock } from 'lucide-react'
import { getOptionalSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { licences } from '@/lib/db/schema'

export const metadata = { title: 'Purchase complete' }

// Customer lands here right after Stripe Checkout returns. For card payments,
// the webhook has usually fired by now; for BACS / invoice we ask the customer
// to wait. The page queries the most-recent licence issued in the last hour —
// if present we show it inline, otherwise we direct them to the dashboard.
async function recentLicenceForUser(organisationId: string | null) {
  if (!organisationId) return null
  const cutoff = new Date(Date.now() - 60 * 60 * 1000)
  return db.query.licences.findFirst({
    where: and(
      eq(licences.organisationId, organisationId),
      isNull(licences.revokedAt),
      gte(licences.issuedAt, cutoff),
    ),
    orderBy: [desc(licences.issuedAt)],
  })
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; tier?: string }>
}) {
  const { method, tier } = await searchParams
  const session = await getOptionalSession()
  const licence = await recentLicenceForUser(session?.user.organisationId ?? null)

  const isInvoiceFlow = method === 'invoice'

  return (
    <div className="flex min-h-screen flex-col">
      <Nav isAuthenticated={!!session} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
                {licence ? (
                  <CheckCircle2 className="size-5 text-primary" aria-hidden />
                ) : (
                  <Clock className="size-5 text-primary" aria-hidden />
                )}
              </div>
              <CardTitle>
                {licence
                  ? 'Purchase complete'
                  : isInvoiceFlow
                    ? 'Invoice issued'
                    : 'Payment received — issuing your licence'}
              </CardTitle>
              <CardDescription>
                {licence
                  ? 'Your licence is ready. Copy it now, or download it any time from your dashboard.'
                  : isInvoiceFlow
                    ? 'Check your email for the invoice. Your licence will be issued as soon as payment clears.'
                    : 'It can take a few seconds for Stripe to confirm payment. Refresh in a moment, or head to your dashboard.'}
                {tier ? <> Tier: <strong className="capitalize">{tier}</strong>.</> : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {licence ? (
                <>
                  <div className="rounded-lg border bg-muted p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Licence key
                      </span>
                      <CopyButton value={licence.signedJwt} />
                    </div>
                    <pre className="overflow-x-auto text-xs text-foreground whitespace-pre-wrap break-all">
                      {licence.signedJwt}
                    </pre>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Paste this key into <strong>Settings → Licence → Licence key</strong> on your Infrawatch server.
                    It is also safe to transfer over air-gap to a disconnected host.
                  </p>
                </>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/invoices">View invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
