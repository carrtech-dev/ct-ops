'use client'

import { useState } from 'react'
import { BillingToggle } from '@/components/pricing/billing-toggle'
import { TierCard } from '@/components/pricing/tier-card'
import type { BillingInterval, TierDefinition } from '@/lib/tiers'

export function PricingClient({ tiers }: { tiers: TierDefinition[] }) {
  const [interval, setInterval] = useState<BillingInterval>('month')

  return (
    <>
      <div className="mt-8 flex justify-center">
        <BillingToggle onChange={setInterval} initialInterval={interval} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} interval={interval} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prices shown in GBP and exclude VAT. Annual plans are billed in one upfront payment.
      </p>
    </>
  )
}
