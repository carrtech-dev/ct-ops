'use server'

import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { getRequiredSession } from '@/lib/auth/session'

const schema = z.object({
  role: z.enum(['technical', 'billing', 'procurement']),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
})

export async function upsertContact(input: unknown): Promise<void> {
  const data = schema.parse(input)
  const { user } = await getRequiredSession()
  if (!user.organisationId) throw new Error('Organisation not set up yet')

  const existing = await db.query.contacts.findFirst({
    where: and(eq(contacts.organisationId, user.organisationId), eq(contacts.role, data.role)),
  })

  if (existing) {
    await db
      .update(contacts)
      .set({ name: data.name, email: data.email, phone: data.phone ?? null, updatedAt: new Date() })
      .where(eq(contacts.id, existing.id))
  } else {
    await db.insert(contacts).values({ organisationId: user.organisationId, ...data })
  }
}
