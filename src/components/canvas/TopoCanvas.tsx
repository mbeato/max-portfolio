'use client'

import { useRef, useEffect, useState } from 'react'
import { useTopoAnimation } from '@/hooks/useTopoAnimation'
import type { LetterBody } from '@/hooks/useTopoAnimation'
import DraggableLetters from '@/components/canvas/DraggableLetters'

export default function TopoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lettersRef = useRef<LetterBody[]>([])
  const completionBurstRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useTopoAnimation(canvasRef, { isMobile }, lettersRef, completionBurstRef)

  return (
    <>
      {/* Canvas wrapper — bleeds beyond hero section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: 0,
          right: 0,
          bottom: '-30%',
          zIndex: 0,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 70%, transparent 100%)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Draggable name — fills section so coords match canvas physics */}
      <div className="absolute inset-0 z-10">
        <div className="flex items-center justify-center h-full max-w-4xl mx-auto px-4">
          <DraggableLetters lettersRef={lettersRef} canvasRef={canvasRef} completionBurstRef={completionBurstRef} />
        </div>
      </div>
    </>
  )
}
