'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { organisations } from '@/lib/db/schema'
import { getRequiredSession } from '@/lib/auth/session'
import { createCustomerPortalSession } from '@/lib/stripe/customer-portal'

export async function openBillingPortal(): Promise<void> {
  const { user } = await getRequiredSession()
  if (!user.organisationId) {
    redirect('/account?reason=missing-organisation')
  }
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, user.organisationId),
  })
  if (!org?.stripeCustomerId) {
    redirect('/account?reason=no-customer')
  }
  const url = await createCustomerPortalSession(org.stripeCustomerId)
  redirect(url)
}
