import type { Metadata } from 'next'
import { getRequiredSession } from '@/lib/auth/session'
import { listSchedules } from '@/lib/actions/task-schedules'
import { SchedulesClient } from './schedules-client'

export const metadata: Metadata = {
  title: 'Scheduled Tasks',
}

export default async function ScheduledTasksPage() {
  const session = await getRequiredSession()
  const orgId = session.user.organisationId!

  const schedules = await listSchedules(orgId)

  return (
    <SchedulesClient
      orgId={orgId}
      userRole={session.user.role}
      initialSchedules={schedules}
    />
  )
}
