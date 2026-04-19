import type { NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stripeWebhookEvents } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe/client'
import { handleStripeEvent } from '@/lib/stripe/handle-webhook'
import { env } from '@/lib/env'

// Stripe webhook endpoint.
// Security model:
// 1. Verify signature with STRIPE_WEBHOOK_SECRET (constructs the Stripe.Event).
// 2. Persist the raw event for idempotency / replay.
// 3. Hand off to handleStripeEvent (a stub today — wired in Phase 1 / Phase 2).
// 4. Always ack 200 unless signature verification fails.
//
// Webhook secrets and route path must be registered with Stripe
// (e.g. https://licensing.infrawatch.io/api/webhooks/stripe).
export async function POST(req: NextRequest): Promise<Response> {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const payload = await req.text()
  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(payload, signature, env.stripeWebhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 })
  }

  // Persist raw event for replay / audit.
  try {
    await db
      .insert(stripeWebhookEvents)
      .values({
        id: event.id,
        type: event.type,
        payload: event as unknown as object,
      })
      .onConflictDoNothing()
  } catch (err) {
    console.error('[stripe webhook] failed to persist event', err)
  }

  // Idempotency: if this event has already been processed (Stripe retries on
  // transient network errors), skip the handler. Event row always exists here
  // because the insert above either created it or the onConflictDoNothing kept
  // the existing row in place.
  const existingEvent = await db.query.stripeWebhookEvents.findFirst({
    where: eq(stripeWebhookEvents.id, event.id),
  })
  if (existingEvent?.processed) {
    return new Response('ok', { status: 200 })
  }

  try {
    await handleStripeEvent(event)
    await db
      .update(stripeWebhookEvents)
      .set({ processed: true, processedAt: new Date() })
      .where(eq(stripeWebhookEvents.id, event.id))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Handler failed'
    console.error(`[stripe webhook] ${event.type} handler failed`, err)
    // Persist the error for visibility. We still ack 200 — Stripe retries
    // only on non-2xx, and we'd rather reprocess from our own replay tooling.
    try {
      await db
        .update(stripeWebhookEvents)
        .set({ processingError: message })
        .where(eq(stripeWebhookEvents.id, event.id))
    } catch {
      // swallow — logging is best-effort
    }
  }

  return new Response('ok', { status: 200 })
}
