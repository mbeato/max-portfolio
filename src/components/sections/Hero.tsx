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

  useEffect(() => {
    if (!puzzleSolved) return
    const timer = setTimeout(() => {
      setShowArrow(true)
      setShowSubtitle(true)
    }, 1800)
    return () => clearTimeout(timer)
  }, [puzzleSolved])

  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center bg-[var(--color-map-white)]"
    >
      <TopoCanvas />

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
        purdue cs + 4 years building systems that run at inference speed
      </motion.p>

      {/* Reset puzzle button — appears after solve */}
      {puzzleSolved && showArrow && (
        <button
          onClick={resetPuzzle}
          className="absolute z-30 text-stone-300 hover:text-stone-500 transition-colors"
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

      {/* Scroll indicator — fades in after puzzle unlock */}
      <div
        className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
        style={{
          opacity: showArrow ? 1 : 0,
          transform: showArrow ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1s ease, transform 1s ease',
          pointerEvents: showArrow ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => {
            const about = document.getElementById('portfolio-about-section')
            about?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex flex-col items-center gap-2 text-stone-400 hover:text-coral-peak transition-colors group"
          aria-label="Scroll to content"
        >
          <span
            className="tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-mono-label)',
              letterSpacing: 'var(--text-mono-label--letter-spacing)',
            }}
          >
            explore
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
            style={{ animationDuration: '2.5s' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
