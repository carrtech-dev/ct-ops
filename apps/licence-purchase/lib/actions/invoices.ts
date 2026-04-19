'use server'

import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { invoices, purchases } from '@/lib/db/schema'
import type { Invoice } from '@/lib/db/schema'
import { getRequiredSession } from '@/lib/auth/session'

export async function listInvoicesForOrganisation(): Promise<Invoice[]> {
  const { user } = await getRequiredSession()
  if (!user.organisationId) return []

  const rows = await db
    .select({ invoice: invoices })
    .from(invoices)
    .innerJoin(purchases, eq(purchases.id, invoices.purchaseId))
    .where(eq(purchases.organisationId, user.organisationId))
    .orderBy(desc(invoices.issuedAt))

  return rows.map((r) => r.invoice)
}
