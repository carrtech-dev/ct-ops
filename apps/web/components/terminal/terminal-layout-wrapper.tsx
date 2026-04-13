'use client'

import { TerminalPanelProvider } from './terminal-panel-context'
import { TerminalPanel } from './terminal-panel'

interface Props {
  orgId: string
  children: React.ReactNode
}

export function TerminalLayoutWrapper({ orgId, children }: Props) {
  return (
    <TerminalPanelProvider>
      <div className="flex flex-col flex-1 min-h-0">
        {children}
        <TerminalPanel orgId={orgId} />
      </div>
    </TerminalPanelProvider>
  )
}
