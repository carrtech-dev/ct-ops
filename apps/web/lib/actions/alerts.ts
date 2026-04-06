'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { alertRules, alertInstances, notificationChannels, hosts } from '@/lib/db/schema'
import { eq, and, isNull, or, desc, inArray, sql } from 'drizzle-orm'
import type {
  AlertRule,
  AlertInstance,
  AlertInstanceStatus,
  AlertSeverity,
  AlertRuleConfig,
  NotificationChannel,
  WebhookChannelConfig,
} from '@/lib/db/schema'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertInstanceWithRule = AlertInstance & {
  ruleName: string
  ruleSeverity: AlertSeverity
  hostname: string
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const checkStatusConfigSchema = z.object({
  checkId: z.string().min(1),
  failureThreshold: z.number().int().min(1).max(10),
})

const metricThresholdConfigSchema = z.object({
  metric: z.enum(['cpu', 'memory', 'disk']),
  operator: z.enum(['gt', 'lt']),
  threshold: z.number().min(0).max(100),
})

const createAlertRuleSchema = z.object({
  hostId: z.string().min(1).nullable().optional(),
  name: z.string().min(1).max(100),
  conditionType: z.enum(['check_status', 'metric_threshold']),
  config: z.union([checkStatusConfigSchema, metricThresholdConfigSchema]),
  severity: z.enum(['info', 'warning', 'critical']).default('warning'),
})

const updateAlertRuleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  enabled: z.boolean().optional(),
  severity: z.enum(['info', 'warning', 'critical']).optional(),
  config: z.union([checkStatusConfigSchema, metricThresholdConfigSchema]).optional(),
})

const createNotificationChannelSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.literal('webhook'),
  config: z.object({
    url: z.string().url(),
    secret: z.string().optional(),
  }),
})

// ─── Alert Rules ──────────────────────────────────────────────────────────────

export async function getAlertRules(orgId: string, hostId?: string): Promise<AlertRule[]> {
  return db.query.alertRules.findMany({
    where: and(
      eq(alertRules.organisationId, orgId),
      isNull(alertRules.deletedAt),
      hostId != null
        ? or(eq(alertRules.hostId, hostId), isNull(alertRules.hostId))
        : undefined,
    ),
    orderBy: alertRules.createdAt,
  })
}

export async function createAlertRule(
  orgId: string,
  input: unknown,
): Promise<{ success: true; id: string } | { error: string }> {
  const parsed = createAlertRuleSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const data = parsed.data

  try {
    const [row] = await db
      .insert(alertRules)
      .values({
        organisationId: orgId,
        hostId: data.hostId ?? null,
        name: data.name,
        conditionType: data.conditionType,
        config: data.config as AlertRuleConfig,
        severity: data.severity,
      })
      .returning({ id: alertRules.id })

    if (!row) return { error: 'Insert failed' }
    return { success: true, id: row.id }
  } catch {
    return { error: 'Failed to create alert rule' }
  }
}

export async function updateAlertRule(
  orgId: string,
  ruleId: string,
  input: unknown,
): Promise<{ success: true } | { error: string }> {
  const parsed = updateAlertRuleSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const data = parsed.data

  const existing = await db.query.alertRules.findFirst({
    where: and(
      eq(alertRules.id, ruleId),
      eq(alertRules.organisationId, orgId),
      isNull(alertRules.deletedAt),
    ),
  })
  if (!existing) return { error: 'Alert rule not found' }

  await db
    .update(alertRules)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.enabled !== undefined && { enabled: data.enabled }),
      ...(data.severity !== undefined && { severity: data.severity }),
      ...(data.config !== undefined && { config: data.config as AlertRuleConfig }),
      updatedAt: new Date(),
    })
    .where(and(eq(alertRules.id, ruleId), eq(alertRules.organisationId, orgId)))

  return { success: true }
}

export async function deleteAlertRule(
  orgId: string,
  ruleId: string,
): Promise<{ success: true } | { error: string }> {
  const existing = await db.query.alertRules.findFirst({
    where: and(
      eq(alertRules.id, ruleId),
      eq(alertRules.organisationId, orgId),
      isNull(alertRules.deletedAt),
    ),
  })
  if (!existing) return { error: 'Alert rule not found' }

  await db
    .update(alertRules)
    .set({ deletedAt: new Date() })
    .where(and(eq(alertRules.id, ruleId), eq(alertRules.organisationId, orgId)))

  return { success: true }
}

// ─── Alert Instances ──────────────────────────────────────────────────────────

export async function getAlertInstances(
  orgId: string,
  filters: { status?: AlertInstanceStatus; hostId?: string; limit?: number } = {},
): Promise<AlertInstanceWithRule[]> {
  const limit = filters.limit ?? 50

  const rows = await db
    .select({
      id: alertInstances.id,
      ruleId: alertInstances.ruleId,
      hostId: alertInstances.hostId,
      organisationId: alertInstances.organisationId,
      status: alertInstances.status,
      message: alertInstances.message,
      triggeredAt: alertInstances.triggeredAt,
      resolvedAt: alertInstances.resolvedAt,
      acknowledgedAt: alertInstances.acknowledgedAt,
      acknowledgedBy: alertInstances.acknowledgedBy,
      metadata: alertInstances.metadata,
      ruleName: alertRules.name,
      ruleSeverity: alertRules.severity,
      hostname: hosts.hostname,
    })
    .from(alertInstances)
    .innerJoin(alertRules, eq(alertInstances.ruleId, alertRules.id))
    .innerJoin(hosts, eq(alertInstances.hostId, hosts.id))
    .where(
      and(
        eq(alertInstances.organisationId, orgId),
        filters.status != null ? eq(alertInstances.status, filters.status) : undefined,
        filters.hostId != null ? eq(alertInstances.hostId, filters.hostId) : undefined,
      ),
    )
    .orderBy(desc(alertInstances.triggeredAt))
    .limit(limit)

  return rows.map((r) => ({
    ...r,
    ruleName: r.ruleName,
    ruleSeverity: r.ruleSeverity as AlertSeverity,
    hostname: r.hostname,
  }))
}

export async function acknowledgeAlert(
  orgId: string,
  instanceId: string,
  userId: string,
): Promise<{ success: true } | { error: string }> {
  const existing = await db.query.alertInstances.findFirst({
    where: and(
      eq(alertInstances.id, instanceId),
      eq(alertInstances.organisationId, orgId),
      eq(alertInstances.status, 'firing'),
    ),
  })
  if (!existing) return { error: 'Alert not found or not in firing state' }

  await db
    .update(alertInstances)
    .set({
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
    })
    .where(and(eq(alertInstances.id, instanceId), eq(alertInstances.organisationId, orgId)))

  return { success: true }
}

export async function getActiveAlertCountsForHosts(
  orgId: string,
  hostIds: string[],
): Promise<Record<string, number>> {
  if (hostIds.length === 0) return {}

  const rows = await db
    .select({
      hostId: alertInstances.hostId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(alertInstances)
    .where(
      and(
        eq(alertInstances.organisationId, orgId),
        eq(alertInstances.status, 'firing'),
        inArray(alertInstances.hostId, hostIds),
      ),
    )
    .groupBy(alertInstances.hostId)

  return Object.fromEntries(rows.map((r) => [r.hostId, r.count]))
}

// ─── Notification Channels ────────────────────────────────────────────────────

export type NotificationChannelSafe = Omit<NotificationChannel, 'config'> & {
  config: { url: string; hasSecret: boolean }
}

export async function getNotificationChannels(orgId: string): Promise<NotificationChannelSafe[]> {
  const rows = await db.query.notificationChannels.findMany({
    where: and(
      eq(notificationChannels.organisationId, orgId),
      isNull(notificationChannels.deletedAt),
    ),
    orderBy: notificationChannels.createdAt,
  })

  return rows.map((ch) => ({
    ...ch,
    config: {
      url: (ch.config as WebhookChannelConfig).url,
      hasSecret: !!((ch.config as WebhookChannelConfig).secret),
    },
  }))
}

export async function createNotificationChannel(
  orgId: string,
  input: unknown,
): Promise<{ success: true; id: string } | { error: string }> {
  const parsed = createNotificationChannelSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const data = parsed.data

  try {
    const [row] = await db
      .insert(notificationChannels)
      .values({
        organisationId: orgId,
        name: data.name,
        type: data.type,
        config: data.config as WebhookChannelConfig,
      })
      .returning({ id: notificationChannels.id })

    if (!row) return { error: 'Insert failed' }
    return { success: true, id: row.id }
  } catch {
    return { error: 'Failed to create notification channel' }
  }
}

export async function deleteNotificationChannel(
  orgId: string,
  channelId: string,
): Promise<{ success: true } | { error: string }> {
  const existing = await db.query.notificationChannels.findFirst({
    where: and(
      eq(notificationChannels.id, channelId),
      eq(notificationChannels.organisationId, orgId),
      isNull(notificationChannels.deletedAt),
    ),
  })
  if (!existing) return { error: 'Notification channel not found' }

  await db
    .update(notificationChannels)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(notificationChannels.id, channelId), eq(notificationChannels.organisationId, orgId)),
    )

  return { success: true }
}
