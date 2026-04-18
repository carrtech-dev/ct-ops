'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { startCheckout } from '@/lib/actions/checkout'
import type { BillingInterval, PaidTierId } from '@/lib/tiers'

type PaymentMethod = 'card' | 'bacs_debit' | 'invoice'

const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'card', label: 'Credit / debit card', hint: 'Instant activation. Visa, Mastercard, Amex.' },
  {
    id: 'bacs_debit',
    label: 'BACS Direct Debit',
    hint: 'UK bank accounts, GBP only. 3-business-day settlement.',
  },
  {
    id: 'invoice',
    label: 'Pay by invoice (bank transfer)',
    hint: 'We email a hosted invoice; you pay by bank transfer within the invoice terms.',
  },
]

export function CheckoutForm({
  tier,
  initialInterval,
}: {
  tier: PaidTierId
  initialInterval: BillingInterval
}) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [interval, setInterval] = useState<BillingInterval>(initialInterval)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  function onSubmit(data: FormData) {
    setError(null)
    const seatCount = Number(data.get('seatCount') ?? '') || undefined
    start(async () => {
      try {
        await startCheckout({ tier, interval, paymentMethod, seatCount })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to start checkout')
      }
    })
  }

  return (
    <form action={onSubmit} className="grid gap-5">
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium text-foreground">Billing interval</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['month', 'year'] as BillingInterval[]).map((i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                interval === i ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <input
                type="radio"
                name="interval"
                value={i}
                checked={interval === i}
                onChange={() => setInterval(i)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium capitalize text-foreground">{i === 'year' ? 'Annual (save 20%)' : 'Monthly'}</div>
                <div className="text-xs text-muted-foreground">
                  {i === 'year' ? 'Billed once per year.' : 'Billed monthly.'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium text-foreground">Payment method</legend>
        <div className="grid gap-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                paymentMethod === m.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={paymentMethod === m.id}
                onChange={() => setPaymentMethod(m.id)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-foreground">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.hint}</div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="seatCount">Hosts (seats)</Label>
        <Input id="seatCount" name="seatCount" type="number" min={1} defaultValue={10} />
        <p className="text-xs text-muted-foreground">
          You can change your seat count later. Billed per host per month.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? 'Redirecting to checkout…' : 'Continue to secure checkout'}
      </Button>
      <p className="text-xs text-muted-foreground">
        You&apos;ll be redirected to Stripe to enter payment details. We never see your card number.
      </p>
    </form>
  )
}
