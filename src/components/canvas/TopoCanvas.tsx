'use client'

import { useRef, useEffect, useState } from 'react'
import { useTopoAnimation } from '@/hooks/useTopoAnimation'
import type { LetterBody, DragFeedback } from '@/hooks/useTopoAnimation'
import DraggableLetters from '@/components/canvas/DraggableLetters'

const INITIAL_FEEDBACK: DragFeedback = { active: false, targetX: 0, targetY: 0, letterX: 0, letterY: 0, proximity: 0 }

export default function TopoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lettersRef = useRef<LetterBody[]>([])
  const completionBurstRef = useRef(false)
  const dragFeedbackRef = useRef<DragFeedback>(INITIAL_FEEDBACK)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Reduce canvas bleed on mobile — tall viewports don't need the extra overshoot
  const bleedTop = isMobile ? '-2%' : '-10%'
  const bleedBottom = isMobile ? '-5%' : '-30%'

  useTopoAnimation(canvasRef, { isMobile }, lettersRef, completionBurstRef, dragFeedbackRef)

  return (
    <>
      {/* Canvas wrapper — bleeds beyond hero section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: bleedTop,
          left: 0,
          right: 0,
          bottom: bleedBottom,
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
          <DraggableLetters lettersRef={lettersRef} canvasRef={canvasRef} completionBurstRef={completionBurstRef} dragFeedbackRef={dragFeedbackRef} />
        </div>
      </div>
    </>
  )
}
