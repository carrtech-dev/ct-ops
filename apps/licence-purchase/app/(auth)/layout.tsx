import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            <span className="text-lg font-semibold">Infrawatch Licensing</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">Buy and manage Infrawatch licences</p>
        </div>
        {children}
      </div>
    </div>
  )
}
