'use client'

interface ExperienceProps {
  id: string
}

export default function Experience({ id }: ExperienceProps) {
  return (
    <section
      id={id}
      className="min-h-screen py-20 border border-gray-200"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Experience</h2>
        {/* Phase 5: VertikalX, DocReserve, Data Mine entries */}
      </div>
    </section>
  )
}
