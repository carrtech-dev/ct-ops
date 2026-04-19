import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { organisations } from '@/lib/db/schema'
import { stripe } from './client'

// Returns the Stripe customer id for an organisation, creating the Stripe
// customer + persisting the id on first call. Subsequent calls are a single DB
// read. Called from the checkout flow so both Checkout (card/BACS) and direct
// send_invoice subscriptions share one customer per organisation.
export async function ensureStripeCustomer(params: {
  organisationId: string
  email: string
  name: string | null
}): Promise<string> {
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, params.organisationId),
  })
  if (!org) throw new Error(`Organisation ${params.organisationId} not found`)
  if (org.stripeCustomerId) return org.stripeCustomerId

  const customer = await stripe().customers.create({
    email: params.email,
    name: params.name ?? org.name,
    metadata: { organisationId: params.organisationId },
  })

  await db
    .update(organisations)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(organisations.id, params.organisationId))

  return customer.id
}
