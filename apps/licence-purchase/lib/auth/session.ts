import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import type { User } from '@/lib/db/schema'

export type { User as SessionUser }

export type RequiredSession = {
  session: {
    id: string
    expiresAt: Date
    token: string
    userId: string
    ipAddress?: string | null
    userAgent?: string | null
  }
  user: User
}

export async function getRequiredSession(): Promise<RequiredSession> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })
  if (!user) redirect('/login')

  return {
    session: session.session as RequiredSession['session'],
    user,
  }
}

export async function getOptionalSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })
  if (!user) return null
  return { session: session.session, user }
}
