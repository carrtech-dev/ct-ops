'use client'

import { Button } from '@/components/ui/button'
import { openBillingPortal } from '@/lib/actions/billing'

export function BillingPortalButton({ disabled }: { disabled?: boolean }) {
  return (
    <form action={openBillingPortal}>
      <Button type="submit" variant="outline" size="sm" disabled={disabled}>
        Manage billing in Stripe
      </Button>
    </form>
  )
}
