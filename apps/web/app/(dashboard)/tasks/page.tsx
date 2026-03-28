import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tasks',
}

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Tasks</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  )
}
