import { eq } from 'drizzle-orm'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/account/contact-form'
import { getRequiredSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { contacts, organisations } from '@/lib/db/schema'

export const metadata = { title: 'Account' }

export default async function AccountPage() {
  const { user } = await getRequiredSession()

  const org = user.organisationId
    ? await db.query.organisations.findFirst({ where: eq(organisations.id, user.organisationId) })
    : null

  const orgContacts = user.organisationId
    ? await db.query.contacts.findMany({ where: eq(contacts.organisationId, user.organisationId) })
    : []

  function findContact(role: 'technical' | 'billing' | 'procurement') {
    const c = orgContacts.find((c) => c.role === role)
    return c ? { name: c.name, email: c.email, phone: c.phone ?? '' } : undefined
  }

  return (
    <>
      <PageHeader
        title="Account"
        description="Company details and the people we should contact about billing, procurement and engineering."
      />

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company</CardTitle>
            <CardDescription>
              {org
                ? `Registered as ${org.name}. Edit via Stripe Customer Portal once subscriptions are active.`
                : 'Company details will be captured on your first checkout.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm md:grid-cols-2">
              <div><dt className="text-xs uppercase text-muted-foreground">Name</dt><dd className="text-foreground">{org?.name ?? '—'}</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Country</dt><dd className="text-foreground">{org?.country ?? '—'}</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">VAT number</dt><dd className="text-foreground">{org?.vatNumber ?? '—'}</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Stripe customer</dt><dd className="font-mono text-xs text-foreground">{org?.stripeCustomerId ?? '—'}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ContactForm
          role="technical"
          title="Technical contact"
          description="Receives 'licence ready' notifications."
          initial={findContact('technical')}
        />
        <ContactForm
          role="billing"
          title="Billing contact"
          description="Receives invoices and payment failures."
          initial={findContact('billing')}
        />
        <ContactForm
          role="procurement"
          title="Procurement contact"
          description="Receives renewal reminders and PO correspondence."
          initial={findContact('procurement')}
        />
      </div>
    </>
  )
}
