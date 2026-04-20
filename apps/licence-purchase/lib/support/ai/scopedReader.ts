import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { licences } from '@/lib/db/schema'

// The AI worker must never touch payment data, signing keys, or any other
// organisation's rows. This module exposes the only DB shape the model's tool
// handlers are allowed to see: the customer context returned by
// `get_customer_context`.

export type CustomerContext = {
  orgId: string
  tier: 'community' | 'pro' | 'enterprise' | 'expired' | 'revoked' | 'none'
  expiresAt: string | null
  features: string[]
  revoked: boolean
}

export async function getCustomerContext(orgId: string): Promise<CustomerContext> {
  const latest = await db.query.licences.findFirst({
    where: and(eq(licences.organisationId, orgId), isNull(licences.revokedAt)),
    orderBy: [desc(licences.issuedAt)],
  })
  if (!latest) {
    return { orgId, tier: 'none', expiresAt: null, features: [], revoked: false }
  }
  const expired = latest.expiresAt.getTime() < Date.now()
  return {
    orgId,
    tier: expired ? 'expired' : normaliseTier(latest.tier),
    expiresAt: latest.expiresAt.toISOString(),
    features: latest.features ?? [],
    revoked: false,
  }
}

function normaliseTier(raw: string): CustomerContext['tier'] {
  if (raw === 'pro' || raw === 'enterprise' || raw === 'community') return raw
  return 'none'
}
