'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { slideInLeft, staggerContainer } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import { generateElementId } from '@/lib/utils'

interface ExperienceEntry {
  id: string
  role: string
  company: string
  dates: string
  description: string
  tags: string[]
}

// TODO: DocReserve and Data Mine dates/descriptions pending Max's confirmation (COPY-09 content accuracy)
const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'vertikalx',
    role: 'founder & full-stack engineer',
    company: 'vertikalx',
    dates: '2024 – present',
    description:
      'built vtx athlete from scratch — composite scoring engine aggregating strava, instagram, and competition data into a 0–1000 sponsor-matching score. nestjs + graphql api, expo mobile app (ios + android), redis cache, bull queues for background processing.',
    tags: ['NestJS', 'GraphQL', 'PostgreSQL', 'Redis', 'Expo', 'Strava API'],
  },
  {
    id: 'docreserve',
    role: 'software engineer intern',
    company: 'docreserve',
    dates: '2023', // TODO: confirm exact dates with Max
    description:
      'built internal scheduling and document management features for a healthcare platform. worked across the full stack — react frontend, node.js api, postgresql database. shipped appointment booking flow used by clinic staff daily.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'REST API'],
  },
  {
    id: 'datamine',
    role: 'data analyst',
    company: 'data mine — purdue',
    dates: '2022 – 2023', // TODO: confirm exact dates with Max
    description:
      "analyzed large datasets for corporate partners as part of purdue's data mine learning community. built data pipelines, created visualizations, and presented findings to stakeholders. learned to translate messy real-world data into actionable insights.",
    tags: ['Python', 'R', 'SQL', 'Tableau', 'Data Pipelines'],
  },
]

interface ExperienceProps {
  id: string
}

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={slideInLeft}
      id={generateElementId('experience', 'entry', entry.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeft: `2px solid ${hovered ? 'var(--color-coral-peak)' : 'var(--color-stone-200)'}`,
        paddingLeft: 'var(--spacing-6)',
        transition: 'border-left-color var(--duration-slow) var(--ease-contour)',
      }}
    >
      <h3
        style={{
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--text-h3--line-height)',
          letterSpacing: 'var(--text-h3--letter-spacing)',
          fontWeight: 500,
          color: 'var(--color-stone-900)',
        }}
      >
        {entry.role}
        <span style={{ color: 'var(--color-stone-500)', fontWeight: 400 }}>
          {' '}
          · {entry.company}
        </span>
      </h3>

      <p
        style={{
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--text-body-sm--line-height)',
          color: 'var(--color-stone-500)',
          marginTop: 'var(--spacing-1)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        {entry.dates}
      </p>

      <p
        style={{
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body--line-height)',
          color: 'var(--color-stone-700)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        {entry.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-label)',
              fontWeight: 500,
              lineHeight: 'var(--text-label--line-height)',
              letterSpacing: 'var(--text-label--letter-spacing)',
              backgroundColor: 'var(--color-stone-100)',
              color: 'var(--color-stone-700)',
              borderRadius: 'var(--radius-subtle)',
              padding: '4px 8px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Experience({ id }: ExperienceProps) {
  const { ref, isIntersecting } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section ref={ref} id={id} className="py-16 lg:py-24 bg-[var(--color-map-white)]">
      <div className="max-w-[720px] mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting ? 'animate' : 'initial'}
        >
          <motion.h2
            variants={slideInLeft}
            id={generateElementId('experience', 'heading', 'section')}
            style={{
              fontSize: 'var(--text-h1)',
              lineHeight: 'var(--text-h1--line-height)',
              letterSpacing: 'var(--text-h1--letter-spacing)',
              fontWeight: 600,
              color: 'var(--color-stone-900)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            experience
          </motion.h2>

          <div
            className="flex flex-col"
            style={{ gap: 'var(--spacing-12)' }}
          >
            {EXPERIENCES.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
