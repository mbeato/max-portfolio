'use client'

import TopoCanvas from '@/components/canvas/TopoCanvas'

interface HeroProps {
  id: string
}

export default function Hero({ id }: HeroProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-map-white)]"
    >
      <TopoCanvas />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900">Max Beato</h1>
        {/* Phase 5: hero content, CTA */}
      </div>
    </section>
  )
}
