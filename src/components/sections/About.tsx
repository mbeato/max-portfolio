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
          {/* Text column — 60% */}
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
              i&apos;m a purdue university student who builds because it&apos;s fun. i like making things that run fast, look sharp, and actually make someone&apos;s day better. whether it&apos;s a new framework, a weird api, or some half-baked side project, i&apos;m always curious to see how it works and what i can make with it.
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
              climbing taught me to break big problems into small moves. route reading feels a lot like debugging: stay calm, test the next hold, and commit when it matters. that mindset carries into my work — iterate, get signal quickly, and keep momentum.
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
              powerlifting keeps me disciplined. progressive overload is just versioning for strength — small, consistent gains over time. i bring the same approach to shipping features: tight feedback loops, good tooling, and steady improvement.
            </motion.p>

            <motion.p
              variants={slideInLeft}
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--text-body--line-height)',
                color: 'var(--color-stone-700)',
              }}
            >
              i like working with people who get excited about the little details — clean animations, smart abstractions, the &apos;it just works&apos; moments. if you&apos;re into building things that feel great to use and stretching a stack in new ways, we&apos;ll get along.
            </motion.p>
          </motion.div>

          {/* Photo column — 40% */}
          <motion.div
            ref={photoRef as React.RefObject<HTMLDivElement>}
            className="lg:w-[40%]"
            variants={staggerContainer}
            initial="initial"
            animate={photosVisible ? "animate" : "initial"}
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Me.jpg — spans both rows of left column */}
              <motion.div variants={fadeIn} className="row-span-2 relative" style={{ minHeight: '400px' }}>
                <Image
                  src="/images/Me.jpg"
                  alt="max beato portrait"
                  fill
                  priority
                  className="object-cover"
                  style={{ objectPosition: 'center 15%', borderRadius: 'var(--radius-comfortable)' }}
                />
              </motion.div>

              {/* Top right — climbing */}
              <motion.div variants={fadeIn} className="relative" style={{ minHeight: '195px' }}>
                <Image
                  src="/images/Climbing.jpg"
                  alt="rock climbing in a gym"
                  fill
                  className="object-cover"
                  style={{ borderRadius: 'var(--radius-comfortable)' }}
                />
              </motion.div>

              {/* Bottom right — lifting + cats stacked */}
              <div className="grid grid-rows-2 gap-3">
                <motion.div variants={fadeIn} className="relative" style={{ minHeight: '93px' }}>
                  <Image
                    src="/images/Lifting.jpg"
                    alt="powerlifting training"
                    fill
                    className="object-cover"
                    style={{ borderRadius: 'var(--radius-comfortable)' }}
                  />
                </motion.div>
                <motion.div variants={fadeIn} className="relative" style={{ minHeight: '93px' }}>
                  <Image
                    src="/images/Cats.jpg"
                    alt="cats at home"
                    fill
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
