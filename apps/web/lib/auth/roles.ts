export type AdminRole = 'org_admin' | 'super_admin'
export type MembershipRole = 'org_admin' | 'super_admin' | 'engineer'

export const ADMIN_ROLES: string[] = ['org_admin', 'super_admin']
export const MEMBERSHIP_ROLES: string[] = ['org_admin', 'super_admin', 'engineer']
export const DEFAULT_NOTIFICATION_ROLES: string[] = ['super_admin', 'org_admin', 'engineer']
