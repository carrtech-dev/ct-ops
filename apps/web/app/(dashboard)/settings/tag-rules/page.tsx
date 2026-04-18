import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getRequiredSession } from '@/lib/auth/session'
import { listTagRules } from '@/lib/actions/tag-rules'
import { TagRulesClient } from './tag-rules-client'

export const metadata: Metadata = {
  title: 'Tag Rules',
}

export default async function TagRulesPage() {
  const session = await getRequiredSession()
  const isAdmin =
    session.user.role === 'super_admin' || session.user.role === 'org_admin'
  if (!isAdmin) redirect('/dashboard')

  const orgId = session.user.organisationId!
  const rules = await listTagRules(orgId)

  return <TagRulesClient orgId={orgId} initialRules={rules} />
}
