import { pgTable, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core'

// Raw Stripe webhook events are persisted here for idempotency, replay and debug.
// Key is the Stripe event id (guaranteed unique by Stripe).
export const stripeWebhookEvents = pgTable('stripe_webhook_event', {
  id: text('id').primaryKey(), // Stripe event id, e.g. evt_1Q...
  type: text('type').notNull(),
  payload: jsonb('payload').notNull(),
  processed: boolean('processed').notNull().default(false),
  processingError: text('processing_error'),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
})

export type StripeWebhookEvent = typeof stripeWebhookEvents.$inferSelect
export type NewStripeWebhookEvent = typeof stripeWebhookEvents.$inferInsert
