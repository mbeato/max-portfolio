'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

// Sub-page nav: visually rhymes with the homepage Navigation but does NOT
// depend on PuzzleContext (the homepage puzzle gates the home nav and locks
// scroll, neither of which applies on deep pages). Logo + back-to-home is the
// minimum viable surface — anchor links to home sections are dropped because
// scrollIntoView targets don't exist on sub-pages.
export default function CaseStudyNav() {
  const initials = SITE_CONFIG.name
    .split(' ')
    .map((w) => w[0])
    .join('')

  return (
    <header
      className="fixed top-1 left-0 right-0 z-40 bg-map-white/95 border-b border-stone-200"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-stone-900 hover:text-coral-peak transition-colors"
            aria-label="back to home"
          >
            {initials}
          </Link>

          <Link
            href="/#portfolio-projects-section"
            className="font-mono text-mono-label uppercase tracking-[0.3px] text-stone-500 hover:text-contour-black transition-colors"
          >
            ← back to home
          </Link>
        </div>
      </nav>
    </header>
  )
}
