import Link from 'next/link'
import { env } from '@/lib/env'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <div className="font-semibold text-foreground">Infrawatch Licensing</div>
          <p className="mt-2 text-muted-foreground">
            Offline-capable, JWT-signed licences for air-gapped infrastructure monitoring.
          </p>
        </div>
        <div>
          <div className="font-medium text-foreground">Product</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/#trust" className="hover:text-foreground">Security</Link></li>
            <li><Link href="https://docs.infrawatch.io" className="hover:text-foreground">Documentation</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground">Account</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Create account</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground">Legal</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><Link href={env.termsUrl} className="hover:text-foreground">Terms</Link></li>
            <li><Link href={env.privacyUrl} className="hover:text-foreground">Privacy</Link></li>
            <li><a href={`mailto:${env.supportEmail}`} className="hover:text-foreground">{env.supportEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Infrawatch. Payments processed by Stripe.
      </div>
    </footer>
  )
}
