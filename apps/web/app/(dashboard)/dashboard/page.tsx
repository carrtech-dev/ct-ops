import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Overview',
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Overview</h1>
      <p className="text-muted-foreground">
        Welcome to Infrawatch. Your infrastructure monitoring dashboard will appear here once
        agents are connected and data is flowing.
      </p>
    </div>
  )
}
