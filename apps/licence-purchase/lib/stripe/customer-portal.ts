// ─────────────────────────────────────────────────────────────────────────────
// STUB — wired up in Phase 1. See apps/licence-purchase/PROGRESS.md.
//
// Real implementation:
//   const session = await stripe().billingPortal.sessions.create({
//     customer: stripeCustomerId,
//     return_url: `${env.appUrl}/account`,
//   })
//   return session.url
// ─────────────────────────────────────────────────────────────────────────────
export async function createCustomerPortalSession(stripeCustomerId: string): Promise<string> {
  console.warn('[stripe] customer portal is a stub', { stripeCustomerId })
  return '/account?portal=stub'
}
