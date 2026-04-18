'use server'

import { and, eq, isNull, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { licences } from '@/lib/db/schema'
import { getRequiredSession } from '@/lib/auth/session'
import type { Licence } from '@/lib/db/schema'

export async function listLicencesForOrganisation(): Promise<Licence[]> {
  const { user } = await getRequiredSession()
  if (!user.organisationId) return []
  return db.query.licences.findMany({
    where: and(eq(licences.organisationId, user.organisationId), isNull(licences.revokedAt)),
    orderBy: [desc(licences.issuedAt)],
  })
}

export async function getLicenceById(id: string): Promise<Licence | null> {
  const { user } = await getRequiredSession()
  if (!user.organisationId) return null
  const result = await db.query.licences.findFirst({
    where: and(eq(licences.id, id), eq(licences.organisationId, user.organisationId)),
  })
  return result ?? null
}
