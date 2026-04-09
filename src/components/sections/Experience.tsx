'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { slideInLeft, staggerContainer } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import { generateElementId } from '@/lib/utils'

interface ExperienceEntry {
  id: string
  role: string
  company: string
  dates: string
  progression?: string
  description: string
  tags: string[]
  logo?: string
}

const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'vertikalx',
    role: 'cto',
    company: 'vertikalx',
    dates: 'may 2025 – present',
    progression: 'intern → senior swe → cto',
    logo: '/logos/vtx-icon.svg',
    description:
      'joined as cto and inherited the existing infrastructure, then majorly refactored the entire stack. nestjs + graphql backend on kubernetes (kops on ec2), react native mobile app with expo, serving 60+ athletes. led 3 engineers, rebuilt ci/cd from manual deploys to a 5-stage gitlab pipeline cutting deploy time from 3hrs to 15min, and reduced aws costs by 45%.',
    tags: ['NestJS', 'GraphQL', 'PostgreSQL', 'Redis', 'Expo', 'Kubernetes', 'AWS', 'GitLab CI/CD'],
  },
  {
    id: 'docreserve',
    role: 'founding engineer',
    company: 'docreserve',
    dates: 'jan 2024 – oct 2024',
    description:
      'first engineer at an early-stage healthcare reservation startup, built everything end to end before it shut down. react/typescript/mui frontend, prisma data models, docker environments, and the full deployment pipeline. focused mainly on calendar-based reservation ux.',
    tags: ['React', 'TypeScript', 'MUI', 'Prisma', 'Docker', 'PostgreSQL'],
  },
  {
    id: 'datamine',
    role: 'data science researcher',
    company: 'the data mine, purdue',
    dates: 'undergrad',
    description:
      "worked on data analysis projects through purdue's corporate data science partnership program. collaborated with industry partners on real datasets and research problems.",
    tags: ['Python', 'SQL', 'Data Analysis'],
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
      <div className="flex items-center gap-3">
        {entry.logo && (
          <Image
            src={entry.logo}
            alt={`${entry.company} logo`}
            width={28}
            height={28}
            className="opacity-70"
          />
        )}
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
      </div>

      <p
        style={{
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--text-body-sm--line-height)',
          color: 'var(--color-stone-500)',
          marginTop: 'var(--spacing-1)',
          marginBottom: entry.progression ? 'var(--spacing-1)' : 'var(--spacing-4)',
        }}
      >
        {entry.dates}
      </p>
      {entry.progression && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-label)',
            lineHeight: 'var(--text-label--line-height)',
            letterSpacing: 'var(--text-label--letter-spacing)',
            color: 'var(--color-stone-400)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          {entry.progression}
        </p>
      )}

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
