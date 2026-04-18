import type Stripe from 'stripe'

// ─────────────────────────────────────────────────────────────────────────────
// STUB — wired up in Phase 1 / Phase 2. See apps/licence-purchase/PROGRESS.md.
//
// Event types to handle:
//   checkout.session.completed           → link Stripe customer / subscription to organisation
//   invoice.paid                         → issue or renew licence (Phase 2)
//   invoice.payment_failed               → mark purchase past_due + notify billing contact
//   customer.subscription.updated        → reflect status/period changes
//   customer.subscription.deleted        → mark purchase canceled
//   customer.subscription.trial_will_end → future: trial support
// ─────────────────────────────────────────────────────────────────────────────
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  console.log(`[stripe webhook] received ${event.type} (${event.id})`)
  // No-op in scaffold. The raw event is already persisted to stripe_webhook_events
  // by the route handler, ready for replay once the real logic is implemented.
}
