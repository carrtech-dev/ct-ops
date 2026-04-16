'use client'

import { memo } from 'react'
import { getSmoothStepPath, type EdgeProps } from '@xyflow/react'

function dotColor(status: string | undefined): string {
  if (status === 'online') return '#22c55e'   // green-500
  if (status === 'offline') return '#ef4444'  // red-500
  return '#94a3b8'                             // slate-400
}

export const AnimatedFlowEdge = memo(function AnimatedFlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const status = (data as { hostStatus?: string } | undefined)?.hostStatus

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const color = dotColor(status)

  return (
    <>
      {/* Edge line — use muted-foreground which is visible in both light and dark mode */}
      <path
        d={edgePath}
        fill="none"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth={1.5}
        opacity={0.35}
      />
      {/* Leading dot */}
      <circle r="4" fill={color}>
        <animateMotion dur="2s" repeatCount="indefinite" begin="0s" path={edgePath} />
      </circle>
      {/* Trailing dot */}
      <circle r="2.5" fill={color} opacity={0.5}>
        <animateMotion dur="2s" repeatCount="indefinite" begin="0.7s" path={edgePath} />
      </circle>
    </>
  )
})
