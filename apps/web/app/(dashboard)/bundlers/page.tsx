import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bundlers',
}

export default function BundlersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Bundlers</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  )
}
