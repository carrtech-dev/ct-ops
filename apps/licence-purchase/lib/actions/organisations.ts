'use server'

import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { organisations, users } from '@/lib/db/schema'
import { getRequiredSession } from '@/lib/auth/session'

const schema = z.object({
  name: z.string().min(2).max(200),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().length(2).optional(),
  vatNumber: z.string().max(32).optional(),
})

export async function saveOrganisation(input: unknown): Promise<{ id: string }> {
  const data = schema.parse(input)
  const { user } = await getRequiredSession()

  if (user.organisationId) {
    await db.update(organisations).set({ ...data, updatedAt: new Date() }).where(eq(organisations.id, user.organisationId))
    return { id: user.organisationId }
  }

  const [created] = await db.insert(organisations).values(data).returning({ id: organisations.id })
  if (!created) throw new Error('Failed to create organisation')
  await db.update(users).set({ organisationId: created.id, updatedAt: new Date() }).where(eq(users.id, user.id))
  return { id: created.id }
}
