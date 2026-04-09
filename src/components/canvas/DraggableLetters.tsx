'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { usePuzzle } from '@/contexts/PuzzleContext'
import type { LetterBody, DragFeedback } from '@/hooks/useTopoAnimation'

const NAME = 'Maximus Beato'
const CHARS = NAME.split('')
const SNAP_THRESHOLD = 150
const SCATTER_COUNT = 5
const FEEDBACK_MAX_DIST = 400 // px — distance at which proximity = 0
const SPOTLIGHT_RADIUS = 140   // px — outer edge of the soft spotlight gradient
const MAX_BLUR = 8             // px — full blur on scattered letters

interface DraggableLettersProps {
  lettersRef: React.RefObject<LetterBody[]>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  completionBurstRef: React.RefObject<boolean>
  dragFeedbackRef: React.RefObject<DragFeedback>
}

// Pick which indices to scatter (always include both 'a' positions for deduction)
function pickScatterIndices(): number[] {
  // Indices of duplicate 'a': positions 1 and 10 in "Maximus Beato"
  const aIndices = CHARS.reduce<number[]>((acc, c, i) => {
    if (c.toLowerCase() === 'a') acc.push(i)
    return acc
  }, [])

  // Remaining non-space, non-'a' indices
  const candidates = CHARS.reduce<number[]>((acc, c, i) => {
    if (c !== ' ' && c.toLowerCase() !== 'a') acc.push(i)
    return acc
  }, [])

  // Shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  // Both 'a's + enough others to reach SCATTER_COUNT
  const extra = candidates.slice(0, SCATTER_COUNT - aIndices.length)
  return [...aIndices, ...extra].sort((a, b) => a - b)
}

export default function DraggableLetters({ lettersRef, canvasRef, completionBurstRef, dragFeedbackRef }: DraggableLettersProps) {
  const { puzzleSolved, solvePuzzle } = usePuzzle()
  const measureRef = useRef<HTMLDivElement>(null)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const letterElRefs = useRef<(HTMLSpanElement | null)[]>([])
  const revealElRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])
  const positionsRef = useRef<{ x: number; y: number }[]>([])
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number; width: number; height: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [snapped, setSnapped] = useState<boolean[]>([])
  const [targetOccupied, setTargetOccupied] = useState<boolean[]>([])
  const targetOccupiedRef = useRef<boolean[]>([])
  const [completed, setCompleted] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [skipVisible, setSkipVisible] = useState(false)
  const scatterIndicesRef = useRef<number[]>([])
  const snappedRef = useRef<boolean[]>([])

  const draggingIdx = useRef<number | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const canvasOffsetRef = useRef({ x: 0, y: 0 })
  const animatingRef = useRef<boolean[]>([])

  useEffect(() => { positionsRef.current = positions }, [positions])
  useEffect(() => { snappedRef.current = snapped }, [snapped])

  // Skip button after delay
  useEffect(() => {
    if (!mounted || puzzleSolved) return
    const timer = setTimeout(() => setSkipVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [mounted, puzzleSolved])

  // Spotlight reveal — cursor acts as a flashlight, clear circle follows cursor over blurred letters
  useEffect(() => {
    if (!mounted) return
    const section = measureRef.current?.closest('section')
    if (!section) return

    const updateSpotlight = (clientX: number, clientY: number) => {
      scatterIndicesRef.current.forEach(idx => {
        const reveal = revealElRefs.current[idx]
        if (!reveal || snappedRef.current[idx]) return
        if (draggingIdx.current === idx) return // dragged letter is fully clear

        const container = letterElRefs.current[idx]
        if (!container) return
        const rect = container.getBoundingClientRect()

        // Cursor position relative to the letter container
        const relX = clientX - rect.left
        const relY = clientY - rect.top

        const mask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${relX}px ${relY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.15) 55%, transparent 100%)`
        reveal.style.maskImage = mask
        reveal.style.webkitMaskImage = mask
      })
    }

    const handleMouseMove = (e: MouseEvent) => updateSpotlight(e.clientX, e.clientY)
    const handleMouseLeave = () => {
      // Hide all spotlights when cursor leaves — fully transparent mask
      scatterIndicesRef.current.forEach(idx => {
        const reveal = revealElRefs.current[idx]
        if (!reveal || snappedRef.current[idx]) return
        reveal.style.maskImage = 'linear-gradient(transparent,transparent)'
        reveal.style.webkitMaskImage = 'linear-gradient(transparent,transparent)'
      })
    }

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mounted])

  // Initialize: measure targets, pre-snap most, scatter mystery letters
  useEffect(() => {
    if (puzzleSolved) return

    const container = measureRef.current
    const section = container?.closest('section')
    const canvasParent = canvasRef.current?.parentElement
    if (!container || !section || !canvasParent) return

    const scatterSet = pickScatterIndices()
    scatterIndicesRef.current = scatterSet

    document.fonts.ready.then(() => {
      // Guard: component may have re-rendered (e.g. returning visitor puzzle restore)
      if (!spanRefs.current[0]) return

      const sectionRect = section.getBoundingClientRect()
      const canvasParentRect = canvasParent.getBoundingClientRect()
      const resolvedFontSize = parseFloat(getComputedStyle(spanRefs.current[0]).fontSize)

      canvasOffsetRef.current = {
        x: sectionRect.left - canvasParentRect.left,
        y: sectionRect.top - canvasParentRect.top,
      }

      // Measure target positions from the hidden measurement heading
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

      // Pre-snap: spaces + non-scattered letters. Scatter: selected indices.
      const initialSnapped = CHARS.map((c, i) => c === ' ' || !scatterSet.includes(i))
      const initialOccupied = [...initialSnapped]
      setSnapped(initialSnapped)
      snappedRef.current = initialSnapped
      setTargetOccupied(initialOccupied)
      targetOccupiedRef.current = initialOccupied
      animatingRef.current = CHARS.map(() => false)

      // Calculate avoidance zone around pre-snapped text
      const snappedTargets = targets.filter((_, i) => initialSnapped[i] && CHARS[i] !== ' ')
      const avoidLeft = snappedTargets.length ? Math.min(...snappedTargets.map(t => t.x)) - 60 : 0
      const avoidRight = snappedTargets.length ? Math.max(...snappedTargets.map(t => t.x + t.width)) + 60 : 0
      const avoidTop = snappedTargets.length ? Math.min(...snappedTargets.map(t => t.y)) - 60 : 0
      const avoidBottom = snappedTargets.length ? Math.max(...snappedTargets.map(t => t.y + t.height)) + 60 : 0

      // Position letters: pre-snapped at target, scattered randomly
      const initialPositions: { x: number; y: number }[] = []
      const EDGE_PAD = 40

      for (let i = 0; i < CHARS.length; i++) {
        if (initialSnapped[i]) {
          initialPositions.push({ x: targets[i].x, y: targets[i].y })
          continue
        }

        let x: number, y: number
        let attempts = 0
        const maxX = sectionRect.width - targets[i].width - EDGE_PAD
        const maxY = sectionRect.height - targets[i].height - EDGE_PAD
        const MIN_SCATTER_DIST = 120 // minimum px between scattered letters

        do {
          x = EDGE_PAD + Math.random() * Math.max(0, maxX - EDGE_PAD)
          y = EDGE_PAD + Math.random() * Math.max(0, maxY - EDGE_PAD)
          attempts++

          const inAvoidZone = (
            x + targets[i].width > avoidLeft && x < avoidRight &&
            y + targets[i].height > avoidTop && y < avoidBottom
          )

          // Check distance to already-placed scattered letters
          let tooClose = false
          if (!inAvoidZone) {
            for (let j = 0; j < initialPositions.length; j++) {
              if (initialSnapped[j]) continue
              const dx = x - initialPositions[j].x
              const dy = y - initialPositions[j].y
              if (Math.sqrt(dx * dx + dy * dy) < MIN_SCATTER_DIST) {
                tooClose = true
                break
              }
            }
          }

          if (!inAvoidZone && !tooClose || attempts > 80) break
        } while (true)

        initialPositions.push({ x, y })
      }

      setPositions(initialPositions)
      positionsRef.current = initialPositions

      // Create physics bodies for ALL letters (pre-snapped + scattered)
      const bodies: LetterBody[] = initialPositions.map((pos, i) => ({
        x: pos.x + canvasOffsetRef.current.x,
        y: pos.y + canvasOffsetRef.current.y,
        width: targets[i].width,
        height: targets[i].height,
        fontSize: resolvedFontSize,
        prevX: pos.x + canvasOffsetRef.current.x,
        prevY: pos.y + canvasOffsetRef.current.y,
        dragging: false,
        snapped: initialSnapped[i],
        char: CHARS[i],
      }))

      lettersRef.current = bodies
      setMounted(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Puzzle completion check
  useEffect(() => {
    if (!mounted || snapped.length === 0 || puzzleSolved) return
    if (snapped.every(Boolean)) {
      setCompleted(true)
      completionBurstRef.current = true
      const t1 = setTimeout(() => setCompleted(false), 900)
      const t2 = setTimeout(solvePuzzle, 1300)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [snapped, mounted, puzzleSolved, solvePuzzle, completionBurstRef])

  // Find best matching target for a character (handles duplicate 'a')
  const findBestTarget = useCallback((letterIdx: number, fromX: number, fromY: number) => {
    const char = CHARS[letterIdx]
    let bestTarget = -1
    let bestDist = Infinity

    for (let t = 0; t < targetPositions.length; t++) {
      if (CHARS[t] !== char || targetOccupiedRef.current[t]) continue
      const target = targetPositions[t]
      const dx = fromX - target.x
      const dy = fromY - target.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < bestDist) {
        bestDist = dist
        bestTarget = t
      }
    }

    return { targetIdx: bestTarget, distance: bestDist }
  }, [targetPositions])

  // Animated snap to target
  const animateToTarget = useCallback((letterIdx: number, targetIdx: number) => {
    const el = letterElRefs.current[letterIdx]
    if (!el || !targetPositions[targetIdx]) return

    animatingRef.current[letterIdx] = true
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
        // Mark physics body as snapped so it creates wave boundary
        if (lettersRef.current?.[letterIdx]) {
          lettersRef.current[letterIdx].snapped = true
        }
        // Clear drag feedback on snap
        dragFeedbackRef.current = { active: false, targetX: 0, targetY: 0, letterX: 0, letterY: 0, proximity: 0 }
      }
    }

    requestAnimationFrame(step)
  }, [targetPositions, lettersRef, dragFeedbackRef])

  // Update drag feedback for hot/cold canvas response
  const updateFeedback = useCallback((letterIdx: number, cssX: number, cssY: number) => {
    const letterDims = targetPositions[letterIdx]
    const centerX = cssX + canvasOffsetRef.current.x + (letterDims?.width ?? 0) / 2
    const centerY = cssY + canvasOffsetRef.current.y + (letterDims?.height ?? 0) / 2

    const { targetIdx, distance } = findBestTarget(letterIdx, cssX, cssY)
    if (targetIdx === -1) {
      dragFeedbackRef.current = { active: true, targetX: 0, targetY: 0, letterX: centerX, letterY: centerY, proximity: 0 }
      return
    }
    const target = targetPositions[targetIdx]
    const proximity = Math.max(0, 1 - distance / FEEDBACK_MAX_DIST)
    dragFeedbackRef.current = {
      active: true,
      targetX: target.x + canvasOffsetRef.current.x + target.width / 2,
      targetY: target.y + canvasOffsetRef.current.y + target.height / 2,
      letterX: centerX,
      letterY: centerY,
      proximity,
    }
  }, [findBestTarget, targetPositions, dragFeedbackRef])

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    if (snapped[idx] || animatingRef.current[idx]) return

    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    draggingIdx.current = idx

    // Fully reveal on pickup — hide blur layer, show clear layer
    const container = letterElRefs.current[idx]
    const reveal = revealElRefs.current[idx]
    if (container) {
      // Hide the blurred child, fully expose the reveal child
      const blurChild = container.querySelector('[data-blur]') as HTMLElement
      if (blurChild) blurChild.style.opacity = '0'
      if (reveal) {
        reveal.style.maskImage = 'none'
        reveal.style.webkitMaskImage = 'none'
        reveal.style.opacity = '1'
      }
    }

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

    // Initial feedback
    updateFeedback(idx, positionsRef.current[idx].x, positionsRef.current[idx].y)
  }, [snapped, lettersRef, canvasRef, updateFeedback])

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

    // Update hot/cold feedback
    updateFeedback(idx, cssX, cssY)
  }, [lettersRef, updateFeedback])

  const handlePointerUp = useCallback(() => {
    const idx = draggingIdx.current
    if (idx !== null) {
      if (lettersRef.current?.[idx]) {
        lettersRef.current[idx].dragging = false
      }

      let didSnap = false

      // Check snap
      if (CHARS[idx] !== ' ' && lettersRef.current?.[idx]) {
        const body = lettersRef.current[idx]
        const currentX = body.x - canvasOffsetRef.current.x
        const currentY = body.y - canvasOffsetRef.current.y

        const { targetIdx, distance } = findBestTarget(idx, currentX, currentY)
        if (targetIdx !== -1 && distance < SNAP_THRESHOLD) {
          animateToTarget(idx, targetIdx)
          didSnap = true
        }
      }

      // Re-blur if not snapped (letter was fully revealed during drag)
      if (!didSnap) {
        const container = letterElRefs.current[idx]
        const reveal = revealElRefs.current[idx]
        if (container) {
          const blurChild = container.querySelector('[data-blur]') as HTMLElement
          if (blurChild) blurChild.style.opacity = '1'
          if (reveal) {
            reveal.style.opacity = ''
            reveal.style.maskImage = 'none'
            reveal.style.webkitMaskImage = 'none'
          }
        }
      }

      // Clear feedback
      dragFeedbackRef.current = { active: false, targetX: 0, targetY: 0, letterX: 0, letterY: 0, proximity: 0 }
    }
    draggingIdx.current = null
    setActiveIdx(null)
  }, [lettersRef, findBestTarget, animateToTarget, dragFeedbackRef])

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
      {/* Hidden measurement heading — used to calculate target positions */}
      <div
        ref={measureRef}
        className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none pointer-events-none"
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'transparent',
          position: 'relative',
        }}
      >
        {CHARS.map((char, i) => (
          <span
            key={i}
            ref={el => { spanRefs.current[i] = el }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Pre-snapped letters — rendered at target positions, visible as solid text */}
      {mounted && positions.length > 0 && CHARS.map((char, i) => {
        if (char === ' ' || !snapped[i] || scatterIndicesRef.current.includes(i) && !snapped[i]) return null
        if (!snapped[i]) return null

        return (
          <span
            key={`snap-${i}`}
            className="absolute text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none pointer-events-none"
            style={{
              fontFamily: 'var(--font-sans)',
              left: positions[i].x,
              top: positions[i].y,
              color: completed ? 'var(--color-coral-peak)' : 'var(--color-contour-black)',
              transform: completed ? 'scale(1.15)' : 'scale(1)',
              transition: 'color 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformOrigin: 'center center',
              zIndex: 15,
            }}
          >
            {char}
          </span>
        )
      })}

      {/* Scattered (draggable) letters — two layers: blurred base + spotlight reveal */}
      {mounted && positions.length > 0 && CHARS.map((char, i) => {
        if (char === ' ' || snapped[i]) return null

        return (
          <span
            key={`drag-${i}`}
            ref={el => { letterElRefs.current[i] = el }}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight select-none touch-none"
            style={{
              fontFamily: 'var(--font-sans)',
              left: positions[i].x,
              top: positions[i].y,
              cursor: activeIdx === i ? 'grabbing' : 'grab',
              zIndex: activeIdx === i ? 30 : 20,
              transform: activeIdx === i ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Blurred base — always visible, faded, with subtle jitter to signal interactivity */}
            <span
              data-blur
              style={{
                filter: `blur(${MAX_BLUR}px)`,
                opacity: 0.4,
                color: 'var(--color-stone-500)',
                transition: 'opacity 0.2s ease',
              }}
            >
              {char}
            </span>
            {/* Clear reveal — masked by cursor-following spotlight */}
            <span
              ref={el => { revealElRefs.current[i] = el }}
              style={{
                position: 'absolute',
                inset: 0,
                color: completed ? 'var(--color-coral-peak)' : 'var(--color-contour-black)',
                maskImage: 'linear-gradient(transparent,transparent)',
                WebkitMaskImage: 'linear-gradient(transparent,transparent)',
                pointerEvents: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              {char}
            </span>
          </span>
        )
      })}

      {/* Hint — appears briefly */}
      {!puzzleSolved && mounted && !snapped.every(Boolean) && (
        <div
          className="absolute top-24 left-0 right-0 text-center pointer-events-none"
          style={{
            opacity: 1,
            animation: 'fadeInOut 4s ease forwards',
          }}
        >
          <p
            className="text-stone-500 tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body)',
              fontWeight: 500,
              letterSpacing: '0.2em',
            }}
          >
            complete the name
          </p>
          <style>{`@keyframes fadeInOut { 0% { opacity: 0; transform: scale(0.95) } 15% { opacity: 1; transform: scale(1) } 70% { opacity: 1; transform: scale(1) } 100% { opacity: 0; transform: scale(0.95) } }`}</style>
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

      <h1 className="sr-only">Maximus Beato</h1>
    </>
  )
}
