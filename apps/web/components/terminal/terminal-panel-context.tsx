'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { createId } from '@paralleldrive/cuid2'

export interface TerminalTabInfo {
  id: string
  hostId: string
  hostname: string
  username: string | null
  orgId: string
  directAccess: boolean
}

interface TerminalPanelState {
  isOpen: boolean
  panelHeight: number
  tabs: TerminalTabInfo[]
  activeTabId: string | null
}

interface TerminalPanelActions {
  openTerminal: (params: {
    hostId: string
    hostname: string
    username: string | null
    orgId: string
    directAccess: boolean
  }) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  togglePanel: () => void
  openPanel: () => void
  closePanel: () => void
  setPanelHeight: (height: number) => void
}

type TerminalPanelContextValue = TerminalPanelState & TerminalPanelActions

const TerminalPanelContext = createContext<TerminalPanelContextValue | null>(null)

const DEFAULT_PANEL_HEIGHT = 350
const MIN_PANEL_HEIGHT = 150
const MAX_PANEL_HEIGHT_RATIO = 0.7

export function TerminalPanelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TerminalPanelState>({
    isOpen: false,
    panelHeight: DEFAULT_PANEL_HEIGHT,
    tabs: [],
    activeTabId: null,
  })

  const openTerminal = useCallback(
    (params: {
      hostId: string
      hostname: string
      username: string | null
      orgId: string
      directAccess: boolean
    }) => {
      const tabId = createId()
      const tab: TerminalTabInfo = { id: tabId, ...params }

      setState((prev) => ({
        ...prev,
        isOpen: true,
        tabs: [...prev.tabs, tab],
        activeTabId: tabId,
      }))
    },
    [],
  )

  const closeTab = useCallback((tabId: string) => {
    setState((prev) => {
      const remaining = prev.tabs.filter((t) => t.id !== tabId)
      let nextActive = prev.activeTabId
      if (prev.activeTabId === tabId) {
        const closedIdx = prev.tabs.findIndex((t) => t.id === tabId)
        nextActive =
          remaining[Math.max(0, closedIdx - 1)]?.id ?? remaining[0]?.id ?? null
      }
      return {
        ...prev,
        tabs: remaining,
        activeTabId: nextActive,
        isOpen: remaining.length > 0 ? prev.isOpen : false,
      }
    })
  }, [])

  const setActiveTab = useCallback((tabId: string) => {
    setState((prev) => ({ ...prev, activeTabId: tabId }))
  }, [])

  const togglePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  const openPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }))
  }, [])

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const setPanelHeight = useCallback((height: number) => {
    const maxH = window.innerHeight * MAX_PANEL_HEIGHT_RATIO
    setState((prev) => ({
      ...prev,
      panelHeight: Math.max(MIN_PANEL_HEIGHT, Math.min(height, maxH)),
    }))
  }, [])

  return (
    <TerminalPanelContext.Provider
      value={{
        ...state,
        openTerminal,
        closeTab,
        setActiveTab,
        togglePanel,
        openPanel,
        closePanel,
        setPanelHeight,
      }}
    >
      {children}
    </TerminalPanelContext.Provider>
  )
}

export function useTerminalPanel(): TerminalPanelContextValue {
  const ctx = useContext(TerminalPanelContext)
  if (!ctx) {
    throw new Error('useTerminalPanel must be used within a TerminalPanelProvider')
  }
  return ctx
}
