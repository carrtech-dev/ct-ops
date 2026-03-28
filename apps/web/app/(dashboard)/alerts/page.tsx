import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alerts',
}

export default function AlertsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Alerts</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  )
}
