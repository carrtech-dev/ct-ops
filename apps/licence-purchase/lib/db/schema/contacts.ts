import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { organisations } from './organisations'

// A customer company has one contact per role — stored one row per (org, role).
// Roles: technical (receives licence-ready notifications),
//        billing (receives invoices and payment-update emails),
//        procurement (receives purchase-order and renewal correspondence).
export const contacts = pgTable(
  'contact',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    organisationId: text('organisation_id')
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    role: text('role').notNull(), // 'technical' | 'billing' | 'procurement'
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgRoleUnique: uniqueIndex('contact_org_role_unique').on(table.organisationId, table.role),
  }),
)

export type ContactRole = 'technical' | 'billing' | 'procurement'
export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
