'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TopoCanvas from '@/components/canvas/TopoCanvas'
import { usePuzzle } from '@/contexts/PuzzleContext'
import { fadeIn } from '@/lib/motion'

interface HeroProps {
  id: string
}

export default function Hero({ id }: HeroProps) {
  const { puzzleSolved, resetPuzzle } = usePuzzle()
  const [showArrow, setShowArrow] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  useEffect(() => {
    if (!puzzleSolved) return
    // Coral flash immediately on solve
    setShowFlash(true)
    const t0 = setTimeout(() => setShowFlash(false), 1200)
    // Subtitle + arrow arrive together with the flash
    const t1 = setTimeout(() => setShowSubtitle(true), 800)
    const t2 = setTimeout(() => setShowArrow(true), 800)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [puzzleSolved])

  return (
    <section
      id={id}
      className="relative min-h-dvh flex items-center justify-center bg-[var(--color-map-white)]"
    >
      <TopoCanvas />

      {/* Completion flash — full-screen coral radial pulse */}
      {showFlash && (
        <div
          className="absolute inset-0 z-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(232,82,63,0.12) 0%, rgba(232,82,63,0.04) 40%, transparent 70%)',
            animation: 'completionFlash 1.2s ease-out forwards',
          }}
        />
      )}
      <style>{`
        @keyframes completionFlash {
          0% { opacity: 0; transform: scale(0.8) }
          15% { opacity: 1; transform: scale(1) }
          100% { opacity: 0; transform: scale(1.3) }
        }
      `}</style>

      {/* Post-solve subtitle — fades in after puzzle unlock */}
      <motion.p
        variants={fadeIn}
        initial="initial"
        animate={showSubtitle ? "animate" : "initial"}
        className="absolute left-0 right-0 text-center z-20 pointer-events-none"
        style={{
          top: '62%',
          fontSize: 'var(--text-body-lg)',
          lineHeight: 'var(--text-body-lg--line-height)',
          fontWeight: 400,
          color: 'var(--color-stone-700)',
        }}
      >
        building full-stack platforms, ai tooling, and the infra to run them
      </motion.p>

      {/* Reset puzzle button — appears after solve */}
      {puzzleSolved && showArrow && (
        <button
          onClick={resetPuzzle}
          className="absolute z-30 text-stone-300 hover:text-stone-500 transition-colors pb-[env(safe-area-inset-bottom)]"
          style={{
            bottom: '2.5rem',
            right: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono-label)',
            letterSpacing: 'var(--text-mono-label--letter-spacing)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Reset puzzle"
        >
          replay ↻
        </button>
      )}

      {/* Scroll indicator — topo-ring with explore text */}
      <motion.div
        className="absolute bottom-8 pb-[env(safe-area-inset-bottom)] left-0 right-0 flex justify-center z-20"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={showArrow ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: showArrow ? 'auto' : 'none' }}
      >
        <button
          onClick={() => {
            const about = document.getElementById('portfolio-about-section')
            about?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="relative flex flex-col items-center text-stone-400 hover:text-coral-peak transition-colors duration-500 group"
          aria-label="Scroll to content"
        >
          {/* Animated contour rings */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid currentColor',
                opacity: 0.25,
              }}
              animate={showArrow ? { scale: [1, 1.4, 1], opacity: [0.25, 0, 0.25] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '85%',
                height: '85%',
                border: '1px solid currentColor',
                opacity: 0.35,
              }}
              animate={showArrow ? { scale: [1, 1.25, 1], opacity: [0.35, 0.05, 0.35] } : {}}
              transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '65%',
                height: '65%',
                border: '1px solid currentColor',
                opacity: 0.15,
              }}
            />
            {/* Chevron in center */}
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
              animate={showArrow ? { y: [0, 3, 0] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>
          {/* Explore text below ring */}
          <motion.span
            className="mt-2 uppercase"
            initial={{ opacity: 0 }}
            animate={showArrow ? { opacity: 0.6 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body-sm)',
              letterSpacing: '0.25em',
            }}
          >
            explore
          </motion.span>
        </button>
      </motion.div>
    </section>
  )
}
