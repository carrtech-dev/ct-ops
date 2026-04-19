import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getTier } from '@/lib/tiers'
import { getRequiredSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { CheckoutForm } from './checkout-form'
import type { BillingInterval, PaidTierId } from '@/lib/tiers'

export const metadata = { title: 'Checkout' }

function isPaidTier(v: string): v is PaidTierId {
  return v === 'pro' || v === 'enterprise'
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ tier: string }>
  searchParams: Promise<{ interval?: string }>
}) {
  const { tier } = await params
  if (!isPaidTier(tier)) notFound()

  const { user } = await getRequiredSession()
  const { interval } = await searchParams
  const initialInterval: BillingInterval = interval === 'year' ? 'year' : 'month'
  const tierDef = getTier(tier)

  const technical = user.organisationId
    ? await db.query.contacts.findFirst({
        where: and(
          eq(contacts.organisationId, user.organisationId),
          eq(contacts.role, 'technical'),
        ),
      })
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <Nav isAuthenticated />
      <main className="flex-1">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 py-12 md:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">Buy {tierDef.name}</CardTitle>
              <CardDescription>
                You&apos;re buying as <strong>{user.email}</strong>.{' '}
                {!user.organisationId ? 'You\u2019ll be asked for company details next.' : null}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!technical ? (
                <div className="space-y-3">
                  <p className="text-sm text-foreground">
                    Please add a <strong>technical contact</strong> before checkout. This is the
                    email that will receive the signed licence key.
                  </p>
                  <Button asChild>
                    <Link href="/account">Add technical contact</Link>
                  </Button>
                </div>
              ) : (
                <CheckoutForm tier={tier} initialInterval={initialInterval} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tier</span>
                <span className="font-medium capitalize">{tierDef.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly price (from)</span>
                <span className="font-medium">£{tierDef.displayPrice.month} / host</span>
              </div>
              <div className="flex justify-between">
                <span>Annual price (from)</span>
                <span className="font-medium">£{tierDef.displayPrice.year} / host / month</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Final pricing and VAT will be confirmed on the Stripe checkout page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
