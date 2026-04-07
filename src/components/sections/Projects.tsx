'use client'

const PROJECTS = ['Tonos', 'VTX', 'APIMesh', 'awesome-mpp'] as const

interface ProjectsProps {
  id: string
}

export default function Projects({ id }: ProjectsProps) {
  return (
    <section
      id={id}
      className="min-h-screen py-20 border border-gray-200 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects</h2>
        <ul className="space-y-2">
          {PROJECTS.map((name) => (
            <li key={name} className="text-lg text-gray-700">{name}</li>
          ))}
        </ul>
        {/* Phase 3: case study cards linking to /work/[slug] */}
      </div>
    </section>
  )
}
