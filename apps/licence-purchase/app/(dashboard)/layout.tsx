import Link from 'next/link'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/shared/footer'
import { getRequiredSession } from '@/lib/auth/session'
import { cn } from '@/lib/utils'

const NAV: { href: string; label: string }[] = [
  { href: '/dashboard', label: 'Licences' },
  { href: '/invoices', label: 'Invoices' },
  { href: '/account', label: 'Account' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await getRequiredSession()
  return (
    <div className="flex min-h-screen flex-col">
      <Nav isAuthenticated />
      <div className="flex-1">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[200px_1fr]">
          <aside className="self-start rounded-xl border bg-card p-2">
            <nav className="flex flex-col text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
