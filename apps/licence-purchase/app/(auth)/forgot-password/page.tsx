import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = { title: 'Forgot password' }

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Password reset is implemented in Phase 3 (see PROGRESS.md). In the meantime, contact support.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Email <a href="mailto:support@infrawatch.io" className="text-foreground underline">support@infrawatch.io</a> and
          we&apos;ll reset it for you.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/login" className="text-foreground underline">Back to sign in</Link>
        </p>
      </CardContent>
    </Card>
  )
}
