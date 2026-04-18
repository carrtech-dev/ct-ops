import Stripe from 'stripe'
import { env } from '@/lib/env'

// Lazily-initialised Stripe client. Access via `stripe()` so importing this
// file doesn't require STRIPE_SECRET_KEY to be set (e.g. during build).
let _stripe: Stripe | null = null

export function stripe(): Stripe {
  if (!_stripe) {
    // Pin the apiVersion once the Stripe SDK is fully wired (Phase 1) —
    // letting Stripe default is fine during scaffolding.
    _stripe = new Stripe(env.stripeSecretKey, {
      typescript: true,
      appInfo: {
        name: 'Infrawatch Licensing',
        url: env.appUrl,
      },
    })
  }
  return _stripe
}
