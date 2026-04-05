'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { users, invitations } from '@/lib/db/schema'
import { eq, and, isNull, isNotNull, gt } from 'drizzle-orm'
import type { User, Invitation } from '@/lib/db/schema'

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['org_admin', 'engineer', 'read_only']),
})

const updateRoleSchema = z.object({
  role: z.enum(['super_admin', 'org_admin', 'engineer', 'read_only']),
})

export async function getOrgUsers(
  orgId: string,
): Promise<{ members: User[]; pendingInvites: Invitation[] }> {
  const [members, pendingInvites] = await Promise.all([
    db.query.users.findMany({
      where: and(eq(users.organisationId, orgId), isNull(users.deletedAt)),
    }),
    db.query.invitations.findMany({
      where: and(
        eq(invitations.organisationId, orgId),
        isNull(invitations.deletedAt),
        isNull(invitations.acceptedAt),
        gt(invitations.expiresAt, new Date()),
      ),
    }),
  ])
  return { members, pendingInvites }
}

export async function inviteUser(
  orgId: string,
  invitedById: string,
  input: { email: string; role: string },
): Promise<{ inviteLink: string } | { restored: true } | { error: string }> {
  const parsed = inviteSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  try {
    // Check for a previously removed user — restore them rather than re-registering,
    // since their account (and email) still exist in the database.
    const removedUser = await db.query.users.findFirst({
      where: and(
        eq(users.email, parsed.data.email),
        eq(users.organisationId, orgId),
        isNotNull(users.deletedAt),
      ),
    })
    if (removedUser) {
      await db
        .update(users)
        .set({ deletedAt: null, isActive: true, role: parsed.data.role, updatedAt: new Date() })
        .where(eq(users.id, removedUser.id))
      return { restored: true }
    }

    const existing = await db.query.users.findFirst({
      where: and(
        eq(users.email, parsed.data.email),
        eq(users.organisationId, orgId),
        isNull(users.deletedAt),
      ),
    })
    if (existing) {
      return { error: 'This user is already a member of your organisation' }
    }

    const existingInvite = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.email, parsed.data.email),
        eq(invitations.organisationId, orgId),
        isNull(invitations.deletedAt),
        isNull(invitations.acceptedAt),
        gt(invitations.expiresAt, new Date()),
      ),
    })
    if (existingInvite) {
      return { error: 'An invitation has already been sent to this email address' }
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const [invite] = await db
      .insert(invitations)
      .values({
        email: parsed.data.email,
        role: parsed.data.role,
        organisationId: orgId,
        invitedById,
        expiresAt,
      })
      .returning()

    if (!invite) return { error: 'Failed to create invitation' }

    const baseUrl = process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3000'
    return { inviteLink: `${baseUrl}/register?invite=${invite.token}` }
  } catch (err) {
    console.error('Failed to invite user:', err)
    return { error: 'An unexpected error occurred' }
  }
}

export async function updateUserRole(
  orgId: string,
  targetUserId: string,
  role: string,
): Promise<{ success: true } | { error: string }> {
  const parsed = updateRoleSchema.safeParse({ role })
  if (!parsed.success) {
    return { error: 'Invalid role' }
  }

  try {
    if (parsed.data.role !== 'super_admin') {
      const superAdmins = await db.query.users.findMany({
        where: and(
          eq(users.organisationId, orgId),
          eq(users.role, 'super_admin'),
        ),
      })
      const isTarget = superAdmins.some((u) => u.id === targetUserId)
      if (isTarget && superAdmins.length === 1) {
        return { error: 'Cannot demote the last super admin' }
      }
    }

    await db
      .update(users)
      .set({ role: parsed.data.role, updatedAt: new Date() })
      .where(and(eq(users.id, targetUserId), eq(users.organisationId, orgId)))

    return { success: true }
  } catch (err) {
    console.error('Failed to update role:', err)
    return { error: 'An unexpected error occurred' }
  }
}

export async function deactivateUser(
  orgId: string,
  requesterId: string,
  targetUserId: string,
): Promise<{ success: true } | { error: string }> {
  if (requesterId === targetUserId) {
    return { error: 'You cannot deactivate your own account' }
  }

  try {
    const activeSuperAdmins = await db.query.users.findMany({
      where: and(
        eq(users.organisationId, orgId),
        eq(users.role, 'super_admin'),
        eq(users.isActive, true),
      ),
    })
    const isTarget = activeSuperAdmins.some((u) => u.id === targetUserId)
    if (isTarget && activeSuperAdmins.length === 1) {
      return { error: 'Cannot deactivate the last active super admin' }
    }

    await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(users.id, targetUserId), eq(users.organisationId, orgId)))

    return { success: true }
  } catch (err) {
    console.error('Failed to deactivate user:', err)
    return { error: 'An unexpected error occurred' }
  }
}

export async function reactivateUser(
  orgId: string,
  targetUserId: string,
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(and(eq(users.id, targetUserId), eq(users.organisationId, orgId)))

    return { success: true }
  } catch (err) {
    console.error('Failed to reactivate user:', err)
    return { error: 'An unexpected error occurred' }
  }
}

export async function removeUser(
  orgId: string,
  requesterId: string,
  targetUserId: string,
): Promise<{ success: true } | { error: string }> {
  if (requesterId === targetUserId) {
    return { error: 'You cannot remove your own account' }
  }

  try {
    const superAdmins = await db.query.users.findMany({
      where: and(
        eq(users.organisationId, orgId),
        eq(users.role, 'super_admin'),
        isNull(users.deletedAt),
      ),
    })
    const isTarget = superAdmins.some((u) => u.id === targetUserId)
    if (isTarget && superAdmins.length === 1) {
      return { error: 'Cannot remove the last super admin' }
    }

    await db
      .update(users)
      .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
      .where(and(eq(users.id, targetUserId), eq(users.organisationId, orgId)))

    return { success: true }
  } catch (err) {
    console.error('Failed to remove user:', err)
    return { error: 'An unexpected error occurred' }
  }
}

export async function cancelInvite(
  orgId: string,
  inviteId: string,
): Promise<{ success: true } | { error: string }> {
  try {
    await db
      .update(invitations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(invitations.id, inviteId), eq(invitations.organisationId, orgId)))

    return { success: true }
  } catch (err) {
    console.error('Failed to cancel invite:', err)
    return { error: 'An unexpected error occurred' }
  }
}
