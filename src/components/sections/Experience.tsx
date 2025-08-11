'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Calendar, MapPin, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import BinaryMatrix from '@/components/ui/BinaryMatrix'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'

interface ExperienceProps {
  id: string
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  duration: string
  description: string[]
  technologies: string[]
  type: 'internship' | 'full-time' | 'freelance' | 'research' | 'future'
  color: string
}

const CARD_WIDTH = 700
const CARD_GAP = 48  // Increased spacing between cards

export default function Experience({ id }: ExperienceProps) {
  const { ref, isIntersecting, hasIntersected } = useScrollAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  
  // Single source of truth for card position
  const x = useMotionValue(0)

  const experiences: Experience[] = [
    {
      id: "data-mine-2022",
      title: "Undergraduate Data Science Researcher",
      company: "The Data Mine, Purdue University",
      location: "West Lafayette, IN",
      duration: "Aug 2022 – May 2023",
      description: [
        "Analyzed social services datasets using R and SQL to surface trends and validate data pulls",
        "Cleaned, joined, and documented large datasets in Azure Data Studio to produce reliable, reusable tables",
        "Built Tableau dashboards and presented findings to Indiana FSSA stakeholders and at The Data Mine Symposium"
      ],
      technologies: ["R", "SQL", "Azure Data Studio", "Tableau", "PostgreSQL"],
      type: "research",
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: "docreserve-2024",
      title: "Frontend Engineer",
      company: "DocReserve",
      location: "Boston, MA — Remote",
      duration: "Apr 2024 – Aug 2024",
      description: [
        "Built and refactored reusable UI components with React, TypeScript, and MUI to standardize the interface",
        "Improved the calendar experience (navigation, readability, empty/loading states) using TypeScript and Prisma",
        "Developed in a Docker-based environment for consistent builds and straightforward local setup"
      ],
      technologies: ["React", "TypeScript", "MUI", "Prisma", "Docker"],
      type: "freelance",
      color: "from-purple-400 to-violet-500"
    },
    {
      id: "vertikalx-2025",
      title: "Software Engineering Intern",
      company: "VertikalX",
      location: "West Lafayette, IN — Remote",
      duration: "May 2025 – Aug 2025",
      description: [
        "Migrated in-house auth to AWS Cognito with Google IdP via NextAuth, achieving zero downtime",
        "Built AWS Lambda services (Node.js/TS) using AWS Encryption SDK (KMS keyring) for code decryption",
        "Integrated Stripe APIs/webhooks for mobile onboarding and 501(c)(3)-compliant receipts",
        "Enhanced UX and created new flows in Next.js/NestJS; implemented GraphQL resolvers and added unit/integration tests"
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "AWS Cognito", "AWS Lambda", "AWS KMS", "Stripe", "GraphQL", "NestJS"],
      type: "internship",
      color: "from-blue-400 to-indigo-500"
    },
    {
      id: "future-2026",
      title: "What's Next?",
      company: "Exciting Opportunities Ahead",
      location: "Wherever Innovation Leads",
      duration: "2026 and Beyond",
      description: [
        "Open to full-time software engineering opportunities in cutting-edge technology companies",
        "Excited to contribute to innovative projects that make a meaningful impact on users and society",
        "Passionate about continuous learning and growing alongside talented teams in dynamic environments",
        "Ready to tackle new challenges in emerging technologies like AI, distributed systems, or developer tools"
      ],
      technologies: ["Innovation", "Growth", "Collaboration", "Impact", "Learning"],
      type: "future",
      color: "from-green-400 to-emerald-500"
    }
  ]

  // Track geometry
  const totalWidth = experiences.length * (CARD_WIDTH + CARD_GAP) - CARD_GAP
  // Max distance to drag so that the last card can be centered.
  // Derivation: to center card i, x = -i * (CARD_WIDTH + CARD_GAP).
  // Thus for the last card (i = n-1), maxDraggable = (n-1) * (CARD_WIDTH + CARD_GAP)
  // which equals totalWidth - CARD_WIDTH.
  const maxDraggable = Math.max(0, totalWidth - CARD_WIDTH)
  // Distance between card centers for navigation
  const step = CARD_WIDTH + CARD_GAP
  
  // Calculate side padding for layout (cannot be negative in CSS)
  const sidePadding = Math.max(0, (containerWidth - CARD_WIDTH) / 2)
  // Compute the x value that centers the first card regardless of viewport size
  const baseX = (containerWidth / 2) - (sidePadding + CARD_WIDTH / 2)
  const rightBound = baseX
  const leftBound = baseX - maxDraggable

  // Calculate current progress aligned to centered-card positions
  // 0 = first card centered (x = 0), 1 = last card centered (x = -maxDraggable)
  const progress = useTransform(x, (currentX) => {
    // Normalize relative to baseX so 0 maps to first card centered, 1 to last centered
    const t = -(currentX - baseX) / (maxDraggable || 1)
    return Math.max(0, Math.min(1, t))
  })
  
  // Current card index based on position
  const currentIndex = useTransform(progress, 
    [0, 1], 
    [0, experiences.length - 1]
  )

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Initialize position so the first card starts centered based on current viewport
  useEffect(() => {
    x.set(baseX)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseX])

  // Drag handlers
  const handleDragStart = () => {
    // Stop any ongoing animations
    x.stop()
  }

  const handleDrag = () => {
    // Let Framer Motion handle the dragging
  }

  const handleDragEnd = () => {
    // Clamp position to valid range
    const currentX = x.get()
    const clampedX = Math.max(leftBound, Math.min(rightBound, currentX))
    if (currentX !== clampedX) {
      x.set(clampedX)
    }
  }

  // Navigate to specific card (desktop only)
  const navigateToCard = useCallback((cardIndex: number) => {
    const targetIndex = Math.max(0, Math.min(experiences.length - 1, cardIndex))
    const targetX = baseX - targetIndex * step
    const clampedX = Math.max(leftBound, Math.min(rightBound, targetX))
    
    animate(x, clampedX, {
      type: 'spring',
      stiffness: 400,
      damping: 30
    })
  }, [baseX, leftBound, rightBound, step, x, experiences.length])

  // Keyboard navigation (desktop only)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle on desktop (viewport width > 768px)
    if (window.innerWidth <= 768) return
    
    const currentProgress = progress.get()
    const currentCardIndex = Math.round(currentProgress * (experiences.length - 1))
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        navigateToCard(currentCardIndex - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        navigateToCard(currentCardIndex + 1)
        break
      case 'Home':
        e.preventDefault()
        navigateToCard(0)
        break
      case 'End':
        e.preventDefault()
        navigateToCard(experiences.length - 1)
        break
    }
  }, [progress, experiences.length, navigateToCard])

  // Add keyboard event listeners (desktop only)
  useEffect(() => {
    // Only add listeners on desktop
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <section 
      ref={ref}
      id={id}
      className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      role="region"
      aria-label="Professional Experience Timeline"
    >
      {/* Binary Matrix Background */}
      <BinaryMatrix
        id={generateElementId('experience', 'background', 'binary-matrix')}
        className="opacity-20"
        density="low"
      />
      
      <div 
        id={generateElementId('experience', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting || hasIntersected ? "animate" : "initial"}
        >
          {/* Section Header */}
          <motion.div
            id={generateElementId('experience', 'header', 'section')}
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Professional Timeline
            </h2>
            <p 
              className="text-lg text-blue-200 max-w-2xl mx-auto"
              role="note"
              aria-live="polite"
            >
              <span className="md:hidden">Swipe the cards to explore my career journey</span>
              <span className="hidden md:inline">Drag the cards or use arrow keys to explore my career journey</span>
            </p>
          </motion.div>

          {/* Experience Cards Container */}
          <motion.div
            id={generateElementId('experience', 'cards', 'container')}
            variants={fadeInUp}
            className="relative"
            style={{ minHeight: 500 }}
          >
            {/* Cards Viewport */}
            <div 
              ref={containerRef}
              className="w-full overflow-hidden"
            >
              <motion.div 
                className="flex cursor-grab active:cursor-grabbing"
                style={{ 
                  x,
                  gap: CARD_GAP,
                  paddingLeft: sidePadding,
                  paddingRight: sidePadding
                }}
                drag="x"
                dragConstraints={{ 
                  left: leftBound, 
                  right: rightBound 
                }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
              >
                {experiences.map((experience, index) => {
                  // Emphasis based on true pixel distance of card center to viewport center
                  const centerProgress = useTransform(x, (currentX) => {
                    const cardCenter = sidePadding + index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2 + currentX
                    const viewportCenter = containerWidth / 2
                    const dist = Math.abs(cardCenter - viewportCenter)
                    // Fully focused within ~60% of card width
                    const maxDistPx = CARD_WIDTH * 0.6
                    const t = 1 - Math.min(dist / maxDistPx, 1)
                    return t
                  })

                  const scale = useTransform(centerProgress, [0, 1], [0.9, 1])
                  const opacity = useTransform(centerProgress, [0, 1], [0.6, 1])
                  const rotateY = useTransform(x, (currentX) => {
                    const cardCenter = sidePadding + index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2 + currentX
                    const viewportCenter = containerWidth / 2
                    const dist = Math.abs(cardCenter - viewportCenter)
                    const maxDistPx = CARD_WIDTH * 0.6
                    const t = 1 - Math.min(dist / maxDistPx, 1)
                    const dir = cardCenter < viewportCenter ? 1 : -1
                    return dir * (1 - t) * 12 // Subtle 3D tilt away from center
                  })
                  
                  return (
                  <motion.div
                    key={experience.id}
                    className="flex-shrink-0"
                    style={{ 
                      width: CARD_WIDTH,
                      scale,
                      opacity,
                      rotateY
                    }}
                  >
                    <Card
                      id={generateElementId('experience', 'card', experience.id)}
                      variant="elevated"
                      padding="lg"
                      className="relative overflow-hidden bg-slate-800/90 backdrop-blur-md shadow-2xl border border-slate-700 h-full"
                    >
                      {/* Gradient Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${experience.color}`} />
                      
                      {/* Card Content */}
                      <div className="relative">
                        {/* Header */}
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {experience.title}
                              </h3>
                              <div className="flex items-center text-blue-300 mb-2">
                                <Building2 className="w-6 h-6 mr-3" />
                                <span className="font-semibold text-xl">{experience.company}</span>
                              </div>
                            </div>
                            <span 
                              className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${experience.color} text-white`}
                            >
                              {experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-300">
                            <div className="flex items-center">
                              <Calendar className="w-5 h-5 mr-2" />
                              <span className="font-medium">{experience.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 mr-2" />
                              <span>{experience.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                          <ul className="space-y-2">
                            {experience.description.map((item, descIndex) => (
                              <li
                                key={descIndex}
                                className="flex items-start text-slate-200 leading-relaxed"
                              >
                                <div className={`w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0 bg-gradient-to-r ${experience.color}`} />
                                <span className="text-lg">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-3">
                            Technologies & Tools
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {experience.technologies.map((tech) => (
                              <span
                                key={tech}
                                className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${experience.color} bg-opacity-20 text-white border border-current border-opacity-30`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Timeline connector line with active indicator */}
            <div className="flex justify-center items-center mt-6">
              <div className="flex items-center gap-0 relative">
                {experiences.map((_, index) => {
                  const isActive = useTransform(currentIndex, (current) => {
                    return Math.abs(current - index) < 0.5
                  })
                  
                  return (
                  <div key={index} className="flex items-center">
                    <motion.div 
                      className="w-3 h-3 rounded-full border-2 transition-all duration-300"
                      style={{
                        backgroundColor: useTransform(isActive, (active) => 
                          active ? '#ffffff' : '#64748b'
                        ),
                        borderColor: useTransform(isActive, (active) => 
                          active ? '#ffffff' : '#64748b'
                        ),
                        scale: useTransform(isActive, (active) => 
                          active ? 1.25 : 1
                        ),
                        boxShadow: useTransform(isActive, (active) => 
                          active ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
                        )
                      }}
                    />
                    {index < experiences.length - 1 && (
                      <div className="w-20 h-0.5 bg-slate-600 mx-2" />
                    )}
                  </div>
                  )
                })}
              </div>
            </div>
            
            {/* Drag instruction */}
            <div className="flex justify-center mt-3">
              <p className="text-sm text-slate-400 text-center">
                <span className="md:hidden">Swipe</span><span className="hidden md:inline">Drag</span> cards to explore timeline
              </p>
            </div>

          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}