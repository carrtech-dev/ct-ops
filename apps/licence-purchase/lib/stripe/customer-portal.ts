import { env } from '@/lib/env'
import { stripe } from './client'

export async function createCustomerPortalSession(stripeCustomerId: string): Promise<string> {
  const session = await stripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.appUrl}/account`,
  })
  return session.url
}
