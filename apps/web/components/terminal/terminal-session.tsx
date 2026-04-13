'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { createTerminalSession } from '@/lib/actions/terminal'
import type { TerminalTabInfo } from './terminal-panel-context'

type Status = 'connecting' | 'connected' | 'error' | 'closed'

interface Props {
  tab: TerminalTabInfo
  isVisible: boolean
  onStatusChange?: (tabId: string, status: Status) => void
}

export function TerminalSession({ tab, isVisible, onStatusChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<unknown>(null)
  const fitRef = useRef<unknown>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const hasConnectedRef = useRef(false)
  const [status, setStatus] = useState<Status>('connecting')

  const updateStatus = useCallback(
    (s: Status) => {
      setStatus(s)
      onStatusChange?.(tab.id, s)
    },
    [tab.id, onStatusChange],
  )

  // Refit when visibility changes
  useEffect(() => {
    if (isVisible && fitRef.current) {
      const fit = fitRef.current as { fit: () => void }
      requestAnimationFrame(() => {
        try {
          fit.fit()
        } catch {
          // ignore
        }
      })
    }
  }, [isVisible])

  // Connect on mount
  useEffect(() => {
    if (hasConnectedRef.current) return
    hasConnectedRef.current = true

    let cancelled = false

    const connect = async () => {
      const result = await createTerminalSession(
        tab.orgId,
        tab.hostId,
        tab.directAccess ? undefined : (tab.username ?? undefined),
      )
      if (cancelled) return

      if ('error' in result) {
        updateStatus('error')
        return
      }

      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import('@xterm/xterm'),
        import('@xterm/addon-fit'),
        import('@xterm/addon-web-links'),
      ])
      await import('@xterm/xterm/css/xterm.css')

      if (cancelled || !containerRef.current) return

      containerRef.current.innerHTML = ''

      const term = new Terminal({
        cursorBlink: true,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 13,
        theme: {
          background: '#09090b',
          foreground: '#e4e4e7',
          cursor: '#22c55e',
          selectionBackground: '#27272a',
        },
      })
      const fitAddon = new FitAddon()
      const webLinksAddon = new WebLinksAddon()
      term.loadAddon(fitAddon)
      term.loadAddon(webLinksAddon)
      term.open(containerRef.current)
      termRef.current = term
      fitRef.current = fitAddon

      requestAnimationFrame(() => {
        fitAddon.fit()
      })

      const connectMsg = tab.directAccess
        ? `Connecting to ${tab.hostname}...`
        : `Connecting to ${tab.hostname} as ${tab.username}...`
      term.writeln(`\x1b[90m${connectMsg}\x1b[0m`)

      const ws = new WebSocket(result.ingestWsUrl)
      wsRef.current = ws

      let agentDidConnect = false
      const waitingTimer = setTimeout(() => {
        if (!agentDidConnect) {
          term.writeln('\x1b[33mWaiting for agent to start shell...\x1b[0m')
        }
      }, 5000)

      ws.onopen = () => {
        updateStatus('connected')
        term.writeln('\x1b[32mConnected to ingest. Waiting for agent...\x1b[0m')
        fitAddon.fit()
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
        }
        term.focus()
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'agent_connected') {
            agentDidConnect = true
            clearTimeout(waitingTimer)
            term.writeln('\x1b[32mAgent connected. Starting shell...\x1b[0m\r\n')
          } else if (msg.type === 'output' && msg.data) {
            if (!agentDidConnect) {
              agentDidConnect = true
              clearTimeout(waitingTimer)
            }
            term.write(atob(msg.data))
          } else if (msg.type === 'closed') {
            clearTimeout(waitingTimer)
            term.writeln('\r\n\x1b[90mSession ended.\x1b[0m')
            updateStatus('closed')
          } else if (msg.type === 'diagnostic' && msg.message) {
            term.writeln(`\x1b[90m[diag] ${msg.message}\x1b[0m`)
          } else if (msg.type === 'error' && msg.message) {
            clearTimeout(waitingTimer)
            term.writeln(`\r\n\x1b[31mError: ${msg.message}\x1b[0m`)
            updateStatus('error')
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onerror = () => {
        updateStatus('error')
      }

      ws.onclose = (e) => {
        if (e.code !== 1000) {
          updateStatus('closed')
        }
      }

      const dataDisposable = term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'input', data: btoa(data) }))
        }
      })

      const resizeDisposable = term.onResize(({ cols, rows }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        }
      })

      let resizeObserver: ResizeObserver | null = null
      if (containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          try {
            fitAddon.fit()
          } catch {
            // ignore errors during cleanup
          }
        })
        resizeObserver.observe(containerRef.current)
      }

      cleanupRef.current = () => {
        clearTimeout(waitingTimer)
        dataDisposable.dispose()
        resizeDisposable.dispose()
        resizeObserver?.disconnect()
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.send(JSON.stringify({ type: 'close' }))
          ws.close(1000, 'tab closed')
        }
        term.dispose()
        termRef.current = null
        fitRef.current = null
        wsRef.current = null
      }
    }

    connect()

    return () => {
      cancelled = true
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [tab, updateStatus])

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-zinc-950"
      style={{
        display: isVisible ? 'block' : 'none',
        padding: '4px',
      }}
    />
  )
}
