'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal, Server } from 'lucide-react'
import type { HostNodeData } from './network-flow-nodes'

interface Props {
  x: number
  y: number
  data: HostNodeData
  onClose: () => void
  onOpenTerminal: (data: HostNodeData) => void
}

export function HostNodeContextMenu({ x, y, data, onClose, onOpenTerminal }: Props) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: y, left: x, zIndex: 9999 }}
      className="bg-popover text-popover-foreground border rounded-md shadow-md py-1 min-w-[160px]"
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground gap-2 cursor-default"
        onClick={() => {
          onOpenTerminal(data)
          onClose()
        }}
      >
        <Terminal className="size-4 shrink-0" />
        Open Terminal
      </button>
      <div className="h-px bg-border my-1" />
      <button
        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground gap-2 cursor-default"
        onClick={() => {
          router.push(`/hosts/${data.hostId}`)
          onClose()
        }}
      >
        <Server className="size-4 shrink-0" />
        View Host
      </button>
    </div>
  )
}
