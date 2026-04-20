import { and, eq, gte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { supportAiRate } from '@/lib/db/schema'
import { env } from '@/lib/env'

// Rolling hourly cap per ticket. A row per (ticketId, windowStart) holds the
// count for that hour bucket. We sum rows from the last 60 minutes.
export async function isUnderAiRateLimit(ticketId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000)
  const rows = await db
    .select()
    .from(supportAiRate)
    .where(and(eq(supportAiRate.ticketId, ticketId), gte(supportAiRate.windowStart, cutoff)))
  const total = rows.reduce((acc, r) => acc + r.count, 0)
  return total < env.supportAiMaxResponsesPerHour
}

export async function recordAiResponse(ticketId: string): Promise<void> {
  const windowStart = hourBucket(new Date())
  const existing = await db.query.supportAiRate.findFirst({
    where: and(eq(supportAiRate.ticketId, ticketId), eq(supportAiRate.windowStart, windowStart)),
  })
  if (existing) {
    await db
      .update(supportAiRate)
      .set({ count: existing.count + 1 })
      .where(eq(supportAiRate.id, existing.id))
    return
  }
  await db.insert(supportAiRate).values({ ticketId, windowStart, count: 1 })
}

function hourBucket(d: Date): Date {
  const b = new Date(d)
  b.setUTCMinutes(0, 0, 0)
  return b
}
