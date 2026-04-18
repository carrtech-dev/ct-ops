import Link from 'next/link'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/licence/copy-button'
import { CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Purchase complete' }

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ stub?: string; tier?: string }>
}) {
  const { stub, tier } = await searchParams
  const stubbedKey = 'FAKE_JWT_FOR_SCAFFOLDING'

  return (
    <div className="flex min-h-screen flex-col">
      <Nav isAuthenticated />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-5 text-primary" aria-hidden />
              </div>
              <CardTitle>Purchase complete</CardTitle>
              <CardDescription>
                {stub
                  ? 'This is a scaffold preview — Stripe integration is pending (see PROGRESS.md).'
                  : 'Your licence is ready. Copy it now, or download it any time from your dashboard.'}
                {tier ? <> Tier: <strong className="capitalize">{tier}</strong>.</> : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Licence key
                  </span>
                  <CopyButton value={stubbedKey} />
                </div>
                <pre className="overflow-x-auto text-xs text-foreground">{stubbedKey}</pre>
              </div>

              <p className="text-sm text-muted-foreground">
                Paste this key into <strong>Settings → Licence → Licence key</strong> on your Infrawatch server.
                It is also safe to transfer over air-gap to a disconnected host.
              </p>

              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="https://docs.infrawatch.io/licensing">Installation guide</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
