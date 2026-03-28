import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hosts',
}

export default function HostsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Hosts</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  )
}
