'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { usePuzzle } from '@/contexts/PuzzleContext'
import type { LetterBody } from '@/hooks/useTopoAnimation'

const NAME = 'Maximus Beato'
const CHARS = NAME.split('')
const SNAP_THRESHOLD = 50

interface DraggableLettersProps {
  lettersRef: React.RefObject<LetterBody[]>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  completionBurstRef: React.RefObject<boolean>
}

export default function DraggableLetters({ lettersRef, canvasRef, completionBurstRef }: DraggableLettersProps) {
  const { puzzleSolved, solvePuzzle } = usePuzzle()
  const measureRef = useRef<HTMLHeadingElement>(null)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const letterElRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])
  const positionsRef = useRef<{ x: number; y: number }[]>([])
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number; width: number; height: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [snapped, setSnapped] = useState<boolean[]>([])
  const [targetOccupied, setTargetOccupied] = useState<boolean[]>([])
  const targetOccupiedRef = useRef<boolean[]>([])
  const [completed, setCompleted] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [hintVisible, setHintVisible] = useState(false)
  const [skipVisible, setSkipVisible] = useState(false)

  const draggingIdx = useRef<number | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const canvasOffsetRef = useRef({ x: 0, y: 0 })
  const animatingRef = useRef<boolean[]>([])
  // Keep positionsRef in sync
  useEffect(() => { positionsRef.current = positions }, [positions])

  // Show hint after delay, skip button slightly later
  useEffect(() => {
    if (!mounted || puzzleSolved) return
    const hintTimer = setTimeout(() => setHintVisible(true), 2500)
    const skipTimer = setTimeout(() => setSkipVisible(true), 4000)
    return () => { clearTimeout(hintTimer); clearTimeout(skipTimer) }
  }, [mounted, puzzleSolved])

  // Initialize: measure targets, scatter letters
  useEffect(() => {
    if (puzzleSolved) return

    const section = measureRef.current?.closest('section')
    const canvasParent = canvasRef.current?.parentElement
    if (!section || !canvasParent) return

    document.fonts.ready.then(() => {
      const sectionRect = section.getBoundingClientRect()
      const canvasParentRect = canvasParent.getBoundingClientRect()
      const resolvedFontSize = parseFloat(getComputedStyle(spanRefs.current[0]!).fontSize)

      canvasOffsetRef.current = {
        x: sectionRect.left - canvasParentRect.left,
        y: sectionRect.top - canvasParentRect.top,
      }

      // Measure target positions from natural heading layout
      const targets: { x: number; y: number; width: number; height: number }[] = []
      spanRefs.current.forEach((span) => {
        if (!span) return
        const rect = span.getBoundingClientRect()
        targets.push({
          x: rect.left - sectionRect.left,
          y: rect.top - sectionRect.top,
          width: rect.width,
          height: rect.height,
        })
      })

      setTargetPositions(targets)

      // Spaces are pre-snapped / pre-occupied
      const initialSnapped = CHARS.map(c => c === ' ')
      const initialOccupied = CHARS.map(c => c === ' ')
      setSnapped(initialSnapped)
      setTargetOccupied(initialOccupied)
      targetOccupiedRef.current = initialOccupied
      animatingRef.current = CHARS.map(() => false)

      // Calculate avoidance zone around target text
      const nonSpaceTargets = targets.filter((_, i) => CHARS[i] !== ' ')
      const avoidLeft = Math.min(...nonSpaceTargets.map(t => t.x)) - 40
      const avoidRight = Math.max(...nonSpaceTargets.map(t => t.x + t.width)) + 40
      const avoidTop = Math.min(...nonSpaceTargets.map(t => t.y)) - 40
      const avoidBottom = Math.max(...nonSpaceTargets.map(t => t.y + t.height)) + 40

      // Scatter letters randomly, avoiding center outline zone
      const scattered: { x: number; y: number }[] = []
      const EDGE_PAD = 30

      for (let i = 0; i < CHARS.length; i++) {
        if (CHARS[i] === ' ') {
          scattered.push({ x: targets[i].x, y: targets[i].y })
          continue
        }

        let x: number, y: number
        let attempts = 0
        const maxX = sectionRect.width - targets[i].width - EDGE_PAD
        const maxY = sectionRect.height - targets[i].height - EDGE_PAD

        do {
          x = EDGE_PAD + Math.random() * Math.max(0, maxX - EDGE_PAD)
          y = EDGE_PAD + Math.random() * Math.max(0, maxY - EDGE_PAD)
          attempts++

          const inAvoidZone = (
            x + targets[i].width > avoidLeft && x < avoidRight &&
            y + targets[i].height > avoidTop && y < avoidBottom
          )

          if (!inAvoidZone || attempts > 80) break
        } while (true)

        scattered.push({ x, y })
      }

      setPositions(scattered)
      positionsRef.current = scattered

      // Create physics bodies at scattered positions
      const bodies: LetterBody[] = scattered.map((pos, i) => ({
        x: pos.x + canvasOffsetRef.current.x,
        y: pos.y + canvasOffsetRef.current.y,
        width: targets[i].width,
        height: targets[i].height,
        fontSize: resolvedFontSize,
        prevX: pos.x + canvasOffsetRef.current.x,
        prevY: pos.y + canvasOffsetRef.current.y,
        dragging: false,
        char: CHARS[i],
      }))

      lettersRef.current = bodies
      setMounted(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Puzzle completion + hide hint on first snap
  useEffect(() => {
    if (!mounted || snapped.length === 0 || puzzleSolved) return
    // Hide hint once any non-space letter is snapped
    if (snapped.some((s, i) => s && CHARS[i] !== ' ')) setHintVisible(false)
    if (snapped.every(Boolean)) {
      setCompleted(true)
      // Fire wave burst + particle scatter via canvas hook
      completionBurstRef.current = true
      const t1 = setTimeout(() => setCompleted(false), 900)
      const t2 = setTimeout(solvePuzzle, 1300)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [snapped, mounted, puzzleSolved, solvePuzzle])

  // rAF snap animation — letter letterIdx snaps to target slot targetIdx
  const animateToTarget = useCallback((letterIdx: number, targetIdx: number) => {
    const el = letterElRefs.current[letterIdx]
    if (!el || !targetPositions[targetIdx]) return

    animatingRef.current[letterIdx] = true
    // Eagerly mark target occupied to prevent double-snapping
    targetOccupiedRef.current[targetIdx] = true

    const startX = positionsRef.current[letterIdx].x
    const startY = positionsRef.current[letterIdx].y
    const targetX = targetPositions[targetIdx].x
    const targetY = targetPositions[targetIdx].y
    const startTime = performance.now()
    const duration = 250

    function step(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)

      const x = startX + (targetX - startX) * ease
      const y = startY + (targetY - startY) * ease

      el!.style.left = `${x}px`
      el!.style.top = `${y}px`

      if (lettersRef.current?.[letterIdx]) {
        const body = lettersRef.current[letterIdx]
        body.prevX = body.x
        body.prevY = body.y
        body.x = x + canvasOffsetRef.current.x
        body.y = y + canvasOffsetRef.current.y
      }

      if (t < 1) {
        requestAnimationFrame(step)
      } else {
        animatingRef.current[letterIdx] = false
        positionsRef.current[letterIdx] = { x: targetX, y: targetY }
        setPositions(prev => {
          const next = [...prev]
          next[letterIdx] = { x: targetX, y: targetY }
          return next
        })
        setSnapped(prev => {
          const next = [...prev]
          next[letterIdx] = true
          return next
        })
        setTargetOccupied(prev => {
          const next = [...prev]
          next[targetIdx] = true
          return next
        })
      }
    }

    requestAnimationFrame(step)
  }, [targetPositions, lettersRef])

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    if (snapped[idx] || animatingRef.current[idx]) return

    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    draggingIdx.current = idx

    const section = (e.target as HTMLElement).closest('section')
    const canvasParent = canvasRef.current?.parentElement
    if (!section || !canvasParent) return
    const sectionRect = section.getBoundingClientRect()
    const canvasParentRect = canvasParent.getBoundingClientRect()

    dragOffset.current = {
      x: e.clientX - sectionRect.left - positionsRef.current[idx].x,
      y: e.clientY - sectionRect.top - positionsRef.current[idx].y,
    }
    canvasOffsetRef.current = {
      x: sectionRect.left - canvasParentRect.left,
      y: sectionRect.top - canvasParentRect.top,
    }

    if (lettersRef.current?.[idx]) {
      lettersRef.current[idx].dragging = true
    }
    setActiveIdx(idx)
  }, [snapped, lettersRef, canvasRef])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const idx = draggingIdx.current
    if (idx === null) return

    const section = (e.target as HTMLElement).closest('section')
    if (!section) return
    const sectionRect = section.getBoundingClientRect()

    const cssX = e.clientX - sectionRect.left - dragOffset.current.x
    const cssY = e.clientY - sectionRect.top - dragOffset.current.y

    positionsRef.current[idx] = { x: cssX, y: cssY }
    setPositions(prev => {
      const next = [...prev]
      next[idx] = { x: cssX, y: cssY }
      return next
    })

    if (lettersRef.current?.[idx]) {
      const body = lettersRef.current[idx]
      body.prevX = body.x
      body.prevY = body.y
      body.x = cssX + canvasOffsetRef.current.x
      body.y = cssY + canvasOffsetRef.current.y
    }
  }, [lettersRef])

  const handlePointerUp = useCallback(() => {
    const idx = draggingIdx.current
    if (idx !== null) {
      if (lettersRef.current?.[idx]) {
        lettersRef.current[idx].dragging = false
      }

      // Find closest matching unoccupied target (allows identical chars to swap slots)
      if (CHARS[idx] !== ' ' && lettersRef.current?.[idx]) {
        const body = lettersRef.current[idx]
        const currentX = body.x - canvasOffsetRef.current.x
        const currentY = body.y - canvasOffsetRef.current.y

        let bestTarget = -1
        let bestDist = SNAP_THRESHOLD

        for (let t = 0; t < targetPositions.length; t++) {
          if (CHARS[t] !== CHARS[idx] || targetOccupiedRef.current[t]) continue
          const target = targetPositions[t]
          const dx = currentX - target.x
          const dy = currentY - target.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < bestDist) {
            bestDist = dist
            bestTarget = t
          }
        }

        if (bestTarget !== -1) {
          animateToTarget(idx, bestTarget)
        }
      }
    }
    draggingIdx.current = null
    setActiveIdx(null)
  }, [lettersRef, targetPositions, animateToTarget])

  // When puzzle is already solved, show static heading
  if (puzzleSolved && !mounted) {
    return (
      <>
        <h1
          className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-contour-black)' }}
        >
          {CHARS.map((char, i) => (
            <span key={i} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <h1 className="sr-only">Maximus Beato</h1>
      </>
    )
  }

  return (
    <>
      {/* Ghost outline heading — visible target layout */}
      <h1
        ref={measureRef}
        className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none pointer-events-none"
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'transparent',
          WebkitTextStroke: '1.5px var(--color-stone-300)',
        }}
      >
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={el => { spanRefs.current[i] = el }}
            className="inline-block"
            style={{
              opacity: targetOccupied[i] ? 0 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Draggable / snapped letters */}
      {mounted && positions.length > 0 && CHARS.map((char, i) => {
        if (char === ' ') return null
        const isSnapped = snapped[i]

        return (
          <span
            key={`drag-${i}`}
            ref={el => { letterElRefs.current[i] = el }}
            onPointerDown={isSnapped ? undefined : (e) => handlePointerDown(e, i)}
            onPointerMove={isSnapped ? undefined : handlePointerMove}
            onPointerUp={isSnapped ? undefined : handlePointerUp}
            className="absolute text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none touch-none"
            style={{
              fontFamily: 'var(--font-sans)',
              left: positions[i].x,
              top: positions[i].y,
              color: completed
                ? 'var(--color-coral-peak)'
                : 'var(--color-contour-black)',
              cursor: isSnapped ? 'default' : (activeIdx === i ? 'grabbing' : 'grab'),
              zIndex: activeIdx === i ? 30 : 20,
              transform: activeIdx === i ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
              filter: activeIdx === i
                ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.18)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
                : 'none',
              transition: 'transform 0.15s ease-out, filter 0.15s ease-out, color 0.3s ease',
              pointerEvents: isSnapped ? 'none' : 'auto',
            }}
          >
            {char}
          </span>
        )
      })}

      {/* Hint text */}
      {!puzzleSolved && mounted && (
        <div
          className="absolute top-12 left-0 right-0 text-center pointer-events-none"
          style={{
            opacity: hintVisible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <p
            className="text-stone-500 tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body-sm)',
              letterSpacing: 'var(--text-label--letter-spacing)',
            }}
          >
            drag the letters into place
          </p>
        </div>
      )}

      {/* Skip button */}
      {!puzzleSolved && mounted && (
        <div
          className="absolute bottom-8 left-0 right-0 text-center"
          style={{
            opacity: skipVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
            pointerEvents: skipVisible ? 'auto' : 'none',
          }}
        >
          <button
            onClick={solvePuzzle}
            className="text-stone-400 hover:text-coral-peak transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body-sm)',
              letterSpacing: 'var(--text-label--letter-spacing)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            skip &rarr;
          </button>
        </div>
      )}

      {/* Accessible hidden heading */}
      <h1 className="sr-only">Maximus Beato</h1>
    </>
  )
}
