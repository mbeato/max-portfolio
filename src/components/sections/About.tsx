'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { slideInLeft, fadeIn, staggerContainer } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import { generateElementId } from '@/lib/utils'

interface AboutProps {
  id: string
}

export default function About({ id }: AboutProps) {
  const { ref: textRef, isIntersecting: textVisible } = useScrollAnimation({ threshold: 0.2 })
  const { ref: photoRef, isIntersecting: photosVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section
      id={id}
      className="bg-[var(--color-map-white)] py-16 lg:py-24"
    >
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Text column,60% */}
          <motion.div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className="lg:w-[60%]"
            variants={staggerContainer}
            initial="initial"
            animate={textVisible ? "animate" : "initial"}
          >
            <motion.h2
              variants={slideInLeft}
              id={generateElementId('about', 'heading', 'section')}
              style={{
                fontSize: 'var(--text-h1)',
                lineHeight: 'var(--text-h1--line-height)',
                letterSpacing: 'var(--text-h1--letter-spacing)',
                fontWeight: 600,
                color: 'var(--color-stone-900)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              about
            </motion.h2>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body-lg)',
                lineHeight: 'var(--text-body-lg--line-height)',
                fontWeight: 400,
                color: 'var(--color-stone-500)',
                marginBottom: 'var(--spacing-8)',
              }}
            >
              purdue student &middot; rock climber &middot; powerlifter
            </motion.p>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--text-body--line-height)',
                color: 'var(--color-stone-700)',
                marginBottom: 'var(--spacing-6)',
              }}
            >
              cs senior at purdue, wrapping up may 2026. i focus on software engineering and machine intelligence, but i have the most fun building full-stack apps that solve real problems.
            </motion.p>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--text-body--line-height)',
                color: 'var(--color-stone-700)',
                marginBottom: 'var(--spacing-6)',
              }}
            >
              i&apos;m cto at vertikalx right now where i basically built the whole stack from scratch. nestjs backend with graphql, kubernetes handling orchestration, react native on mobile. went from nothing to production infrastructure in just a few months which was pretty cool to figure out.
            </motion.p>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--text-body--line-height)',
                color: 'var(--color-stone-700)',
                marginBottom: 'var(--spacing-6)',
              }}
            >
              side projects are where i get more experimental. tonos is a personal voice ai platform i built because i wanted to be able to automate outreach without sounding robotic. apimesh is an attempt at filling a potential gap in new tech that seems like its changing every day. both are in the projects section if you want to dig into the technical stuff.
            </motion.p>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--text-body--line-height)',
                color: 'var(--color-stone-700)',
              }}
            >
              outside of work and school i climb and powerlift basically every day when i&apos;m not hanging out with my two lovely cats.
            </motion.p>
          </motion.div>

          {/* Photo column,40% */}
          <motion.div
            ref={photoRef as React.RefObject<HTMLDivElement>}
            className="lg:w-[40%]"
            variants={staggerContainer}
            initial="initial"
            animate={photosVisible ? "animate" : "initial"}
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Me.jpg,spans both rows of left column */}
              <motion.div variants={fadeIn} className="row-span-2 relative" style={{ minHeight: 'clamp(250px, 55vw, 400px)' }}>
                <Image
                  src="/images/Me.jpg"
                  alt="max beato portrait"
                  fill
                  priority
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"
                  className="object-cover"
                  style={{ objectPosition: 'center 15%', borderRadius: 'var(--radius-comfortable)' }}
                />
              </motion.div>

              {/* Top right,climbing */}
              <motion.div variants={fadeIn} className="relative" style={{ minHeight: 'clamp(120px, 27vw, 195px)' }}>
                <Image
                  src="/images/Climbing.jpg"
                  alt="rock climbing in a gym"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"
                  className="object-cover"
                  style={{ borderRadius: 'var(--radius-comfortable)' }}
                />
              </motion.div>

              {/* Bottom right,lifting + cats stacked */}
              <div className="grid grid-rows-2 gap-3">
                <motion.div variants={fadeIn} className="relative" style={{ minHeight: 'clamp(56px, 12vw, 93px)' }}>
                  <Image
                    src="/images/Lifting.jpg"
                    alt="powerlifting training"
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 100px"
                    className="object-cover"
                    style={{ borderRadius: 'var(--radius-comfortable)' }}
                  />
                </motion.div>
                <motion.div variants={fadeIn} className="relative" style={{ minHeight: 'clamp(56px, 12vw, 93px)' }}>
                  <Image
                    src="/images/Cats.jpg"
                    alt="cats at home"
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 100px"
                    className="object-cover"
                    style={{ borderRadius: 'var(--radius-comfortable)' }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Photo caption */}
            <motion.p
              variants={fadeIn}
              className="mt-4 text-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-label)',
                lineHeight: 'var(--text-label--line-height)',
                letterSpacing: 'var(--text-label--letter-spacing)',
                fontWeight: 500,
                color: 'var(--color-stone-500)',
              }}
            >
              climbing &middot; lifting &middot; cats &middot; purdue
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
