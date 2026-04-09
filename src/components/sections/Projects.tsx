'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CASE_STUDIES } from '@/lib/case-studies'
import type { CaseStudy } from '@/lib/case-studies'
import { fadeInUp, staggerContainer } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import { generateElementId } from '@/lib/utils'

interface ProjectsProps {
  id: string
}

function ProjectCard({ study }: { study: CaseStudy }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={`/work/${study.slug}`}
      variants={fadeInUp}
      id={generateElementId('projects', 'card', study.slug)}
      className="block bg-white"
      style={{
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-border)',
        borderRadius: 'var(--radius-comfortable)',
        padding: 'var(--spacing-8)',
        borderLeft: `2px solid ${hovered ? 'var(--color-coral-peak)' : 'transparent'}`,
        transition: `box-shadow var(--duration-slow) var(--ease-contour), border-left-color var(--duration-slow) var(--ease-contour)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: title + year/status */}
      <div
        className="flex items-start justify-between"
        style={{ marginBottom: 'var(--spacing-2)' }}
      >
        <div className="flex items-center gap-3">
          {study.logo && (
            <Image
              src={study.logo}
              alt={`${study.title} logo`}
              width={24}
              height={24}
              className="opacity-70"
            />
          )}
          <h3
            style={{
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2--line-height)',
              letterSpacing: 'var(--text-h2--letter-spacing)',
              fontWeight: 600,
              color: 'var(--color-stone-900)',
            }}
          >
            {study.title}
          </h3>
        </div>
        <span
          style={{
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--text-body-sm--line-height)',
            color: 'var(--color-stone-500)',
            whiteSpace: 'nowrap',
            marginLeft: 'var(--spacing-4)',
          }}
        >
          {study.year} · {study.status}
        </span>
      </div>

      {/* Hook */}
      <p
        style={{
          fontSize: 'var(--text-body-lg)',
          lineHeight: 'var(--text-body-lg--line-height)',
          color: 'var(--color-stone-700)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        {study.hook}
      </p>

      {/* Tech tags — limited to 5 per card */}
      <div
        className="flex flex-wrap gap-2"
        style={{ marginBottom: 'var(--spacing-4)' }}
      >
        {study.tech.slice(0, 5).map((tag) => (
          <span
            key={tag.label}
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
            {tag.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <span
        style={{
          fontSize: 'var(--text-body-sm)',
          fontWeight: 500,
          color: 'var(--color-stone-900)',
          textDecoration: 'underline',
          textDecorationColor: 'var(--color-stone-300)',
          textUnderlineOffset: '4px',
        }}
      >
        view case study →
      </span>
    </motion.a>
  )
}

export default function Projects({ id }: ProjectsProps) {
  const { ref, isIntersecting } = useScrollAnimation({ threshold: 0.15 })

  return (
    <section
      ref={ref}
      id={id}
      className="py-16 lg:py-24 bg-[var(--color-map-white)]"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting ? 'animate' : 'initial'}
        >
          <motion.h2
            variants={fadeInUp}
            id={generateElementId('projects', 'heading', 'section')}
            style={{
              fontSize: 'var(--text-h1)',
              lineHeight: 'var(--text-h1--line-height)',
              letterSpacing: 'var(--text-h1--letter-spacing)',
              fontWeight: 600,
              color: 'var(--color-stone-900)',
              marginBottom: 'var(--spacing-12)',
            }}
          >
            work
          </motion.h2>

          <div
            className="flex flex-col"
            style={{ gap: 'var(--spacing-8)' }}
          >
            {CASE_STUDIES.map((study) => (
              <ProjectCard key={study.slug} study={study} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
