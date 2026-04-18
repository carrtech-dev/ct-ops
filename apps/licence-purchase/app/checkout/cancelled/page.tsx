import Link from 'next/link'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Checkout cancelled' }

export default function CancelledPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav isAuthenticated />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Checkout cancelled</CardTitle>
              <CardDescription>
                No charge was made. You can restart the purchase whenever you&apos;re ready.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/pricing">Back to pricing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
