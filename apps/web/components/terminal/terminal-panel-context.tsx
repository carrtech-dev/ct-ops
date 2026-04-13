'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
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

// --- sessionStorage persistence ---

const STORAGE_KEY = 'terminal-panel-state'

interface PersistedTerminalState {
  tabs: Omit<TerminalTabInfo, 'id'>[]
  activeTabIndex: number | null
  isOpen: boolean
  panelHeight: number
}

function isValidPersistedState(value: unknown): value is PersistedTerminalState {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  if (typeof obj.isOpen !== 'boolean') return false
  if (typeof obj.panelHeight !== 'number' || !Number.isFinite(obj.panelHeight)) return false
  if (obj.activeTabIndex !== null && typeof obj.activeTabIndex !== 'number') return false
  if (!Array.isArray(obj.tabs)) return false

  return obj.tabs.every((tab: unknown) => {
    if (typeof tab !== 'object' || tab === null) return false
    const t = tab as Record<string, unknown>
    return (
      typeof t.hostId === 'string' &&
      typeof t.hostname === 'string' &&
      (t.username === null || typeof t.username === 'string') &&
      typeof t.orgId === 'string' &&
      typeof t.directAccess === 'boolean'
    )
  })
}

function loadPersistedState(): TerminalPanelState | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isValidPersistedState(parsed)) return null
    if (parsed.tabs.length === 0) return null

    const tabs: TerminalTabInfo[] = parsed.tabs.map((t) => ({
      id: createId(),
      ...t,
    }))

    const restoredTab =
      parsed.activeTabIndex !== null ? tabs[parsed.activeTabIndex] : undefined
    const activeTabId = restoredTab?.id ?? tabs[0]?.id ?? null

    return {
      tabs,
      activeTabId,
      isOpen: parsed.isOpen,
      panelHeight: Math.max(MIN_PANEL_HEIGHT, Math.min(parsed.panelHeight, 1200)),
    }
  } catch {
    return null
  }
}

function persistState(state: TerminalPanelState): void {
  try {
    if (state.tabs.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    const toPersist: PersistedTerminalState = {
      tabs: state.tabs.map((t) => ({
        hostId: t.hostId,
        hostname: t.hostname,
        username: t.username,
        orgId: t.orgId,
        directAccess: t.directAccess,
      })),
      activeTabIndex: state.activeTabId
        ? state.tabs.findIndex((t) => t.id === state.activeTabId)
        : null,
      isOpen: state.isOpen,
      panelHeight: state.panelHeight,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist))
  } catch {
    // sessionStorage may be unavailable
  }
}

const DEFAULT_STATE: TerminalPanelState = {
  isOpen: false,
  panelHeight: DEFAULT_PANEL_HEIGHT,
  tabs: [],
  activeTabId: null,
}

// --- Provider ---

export function TerminalPanelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TerminalPanelState>(
    () => loadPersistedState() ?? DEFAULT_STATE,
  )

  useEffect(() => {
    persistState(state)
  }, [state])

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
