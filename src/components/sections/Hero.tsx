'use client'

interface HeroProps {
  id: string
}

export default function Hero({ id }: HeroProps) {
  return (
    <section
      id={id}
      className="min-h-screen flex items-center justify-center border border-gray-200"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900">Max Beato</h1>
        {/* Phase 5: hero content, CTA, topographic animation */}
      </div>
    </section>
  )
}
