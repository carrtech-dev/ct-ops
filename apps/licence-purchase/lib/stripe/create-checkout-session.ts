import type { BillingInterval, PaidTierId } from '@/lib/tiers'

export type PaymentMethodChoice = 'card' | 'bacs_debit' | 'invoice'

export type CreateCheckoutSessionInput = {
  tier: PaidTierId
  interval: BillingInterval
  paymentMethod: PaymentMethodChoice
  organisationId: string
  customerEmail: string
  seatCount?: number
  successUrl: string
  cancelUrl: string
}

export type CreateCheckoutSessionResult = {
  url: string
  sessionId: string
}

// ─────────────────────────────────────────────────────────────────────────────
// STUB — wired up in Phase 1. See apps/licence-purchase/PROGRESS.md.
//
// Implementation plan:
// - For paymentMethod='card' | 'bacs_debit':
//     stripe.checkout.sessions.create({
//       mode: 'subscription',
//       payment_method_types: [paymentMethod],
//       line_items: [{ price: env.stripePrices[tier][interval], quantity: seatCount ?? 1 }],
//       customer_email, success_url, cancel_url,
//       automatic_tax: { enabled: env.stripeTaxEnabled },
//       subscription_data: { metadata: { organisationId, tier, interval } },
//     })
// - For paymentMethod='invoice':
//     Create a Stripe subscription directly with collection_method='send_invoice',
//     days_until_due: env.stripeInvoiceCollectionDays.
//     Return the hosted invoice URL so the customer can pay via bank transfer.
// ─────────────────────────────────────────────────────────────────────────────
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
  console.warn(
    '[stripe] createCheckoutSession is a scaffolding stub; returning a placeholder redirect.',
    { tier: input.tier, interval: input.interval, paymentMethod: input.paymentMethod },
  )
  return {
    url: `${input.successUrl}?stub=true&tier=${input.tier}&interval=${input.interval}`,
    sessionId: 'cs_stub',
  }
}
