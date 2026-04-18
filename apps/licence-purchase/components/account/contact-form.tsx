'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { upsertContact } from '@/lib/actions/contacts'
import type { ContactRole } from '@/lib/db/schema'

type Initial = { name: string; email: string; phone: string }

export function ContactForm({
  role,
  title,
  description,
  initial,
}: {
  role: ContactRole
  title: string
  description: string
  initial?: Partial<Initial>
}) {
  const [pending, start] = useTransition()

  function onSubmit(data: FormData) {
    start(async () => {
      await upsertContact({
        role,
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? '') || undefined,
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`${role}-name`}>Name</Label>
            <Input id={`${role}-name`} name="name" defaultValue={initial?.name} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${role}-email`}>Email</Label>
            <Input id={`${role}-email`} name="email" type="email" defaultValue={initial?.email} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${role}-phone`}>Phone (optional)</Label>
            <Input id={`${role}-phone`} name="phone" type="tel" defaultValue={initial?.phone} />
          </div>
          <Button type="submit" disabled={pending} size="sm">
            {pending ? 'Saving…' : 'Save contact'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
