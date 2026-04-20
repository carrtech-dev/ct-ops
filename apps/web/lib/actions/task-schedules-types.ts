import type { TaskSchedule } from '@/lib/db/schema'

// Task types that can be scheduled (excludes agent_uninstall — one-shot only).
export const SCHEDULABLE_TASK_TYPES = ['patch', 'custom_script', 'service', 'software_inventory'] as const
export type ScheduledTaskType = typeof SCHEDULABLE_TASK_TYPES[number]

export type ScheduleWithTargetName = TaskSchedule & { targetName: string | null }
