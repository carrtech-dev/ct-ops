import Link from 'next/link'
import { PageHeader } from '@/components/shared/page-header'
import { LicenceCard } from '@/components/licence/licence-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { listLicencesForOrganisation } from '@/lib/actions/licences'

export const metadata = { title: 'Your licences' }

export default async function DashboardPage() {
  const licences = await listLicencesForOrganisation()

  return (
    <>
      <PageHeader
        title="Your licences"
        description="Download, copy or renew any licence issued to your organisation."
      />

      {licences.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No licences yet</CardTitle>
            <CardDescription>
              Once you complete a purchase, your signed licence key will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/pricing">See pricing</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {licences.map((licence) => (
            <LicenceCard key={licence.id} licence={licence} />
          ))}
        </div>
      )}
    </>
  )
}
