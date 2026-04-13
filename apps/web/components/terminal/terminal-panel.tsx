'use client'

import { useState, useCallback, useRef } from 'react'
import {
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Terminal,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTerminalPanel } from './terminal-panel-context'
import { TerminalSession } from './terminal-session'
import { HostSelectorDialog } from './host-selector-dialog'

interface Props {
  orgId: string
}

type TabStatus = 'connecting' | 'connected' | 'error' | 'closed'

export function TerminalPanel({ orgId }: Props) {
  const {
    isOpen,
    panelHeight,
    tabs,
    activeTabId,
    closeTab,
    setActiveTab,
    togglePanel,
    setPanelHeight,
  } = useTerminalPanel()

  const [hostSelectorOpen, setHostSelectorOpen] = useState(false)
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({})
  const panelRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const handleStatusChange = useCallback((tabId: string, status: TabStatus) => {
    setTabStatuses((prev) => ({ ...prev, [tabId]: status }))
  }, [])

  // Resize drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isResizing.current = true
      startY.current = e.clientY
      startHeight.current = panelHeight

      const handleMouseMove = (me: MouseEvent) => {
        if (!isResizing.current) return
        const delta = startY.current - me.clientY
        setPanelHeight(startHeight.current + delta)
      }

      const handleMouseUp = () => {
        isResizing.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [panelHeight, setPanelHeight],
  )

  if (tabs.length === 0) {
    return (
      <HostSelectorDialog
        open={hostSelectorOpen}
        onOpenChange={setHostSelectorOpen}
        orgId={orgId}
      />
    )
  }

  const statusColor = (tabId: string) => {
    const s = tabStatuses[tabId]
    if (s === 'connected') return 'text-green-500'
    if (s === 'connecting') return 'text-amber-500 animate-pulse'
    if (s === 'error') return 'text-red-500'
    return 'text-zinc-500'
  }

  return (
    <>
      <div
        ref={panelRef}
        className="border-t border-border bg-background flex flex-col shrink-0"
        style={{ height: isOpen ? panelHeight : 'auto' }}
      >
        {/* Resize handle */}
        {isOpen && (
          <div
            className="h-1 cursor-ns-resize hover:bg-primary/20 active:bg-primary/30 transition-colors shrink-0"
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Tab bar */}
        <div className="flex items-center border-b border-border bg-muted/30 shrink-0">
          <div className="flex-1 flex items-center overflow-x-auto min-w-0">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  'group flex items-center gap-1.5 px-3 py-1.5 text-xs border-r border-border cursor-pointer select-none shrink-0 max-w-48',
                  tab.id === activeTabId
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (!isOpen) togglePanel()
                }}
              >
                <Circle className={cn('size-2 shrink-0 fill-current', statusColor(tab.id))} />
                <span className="truncate">
                  {tab.hostname}
                  {tab.username && (
                    <span className="text-muted-foreground ml-1">({tab.username})</span>
                  )}
                </span>
                <button
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-0.5 px-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setHostSelectorOpen(true)}
              title="Open new terminal"
            >
              <Plus className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={togglePanel}
              title={isOpen ? 'Minimize panel' : 'Expand panel'}
            >
              {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
            </Button>
          </div>
        </div>

        {/* Terminal content */}
        {isOpen && (
          <div className="flex-1 min-h-0 relative">
            {tabs.map((tab) => (
              <TerminalSession
                key={tab.id}
                tab={tab}
                isVisible={tab.id === activeTabId}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <HostSelectorDialog
        open={hostSelectorOpen}
        onOpenChange={setHostSelectorOpen}
        orgId={orgId}
      />
    </>
  )
}

/**
 * Button that can be placed anywhere (e.g. sidebar) to open the terminal host selector.
 * Must be rendered inside a TerminalPanelProvider.
 */
export function TerminalPanelTrigger({ orgId }: { orgId: string }) {
  const { tabs, openPanel } = useTerminalPanel()
  const [selectorOpen, setSelectorOpen] = useState(false)

  const handleClick = () => {
    if (tabs.length > 0) {
      openPanel()
    } else {
      setSelectorOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sidebar-foreground/70"
      >
        <Terminal className="size-4" />
        <span>Terminal</span>
      </button>
      <HostSelectorDialog open={selectorOpen} onOpenChange={setSelectorOpen} orgId={orgId} />
    </>
  )
}
