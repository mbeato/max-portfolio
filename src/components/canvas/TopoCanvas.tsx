'use client'

import { useRef, useEffect, useState } from 'react'
import { useTopoAnimation } from '@/hooks/useTopoAnimation'

export default function TopoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // SSR-safe mobile detection — default false, set in effect after mount
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useTopoAnimation(canvasRef, { isMobile })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
