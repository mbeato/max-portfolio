'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Calendar, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import BinaryMatrix from '@/components/ui/BinaryMatrix'
import { fadeInUp, staggerContainer, generateElementId, debounce } from '@/lib/utils'
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
  startDate: string
  endDate: string
  startYear: number
  endYear: number
  description: string[]
  technologies: string[]
  type: 'internship' | 'full-time' | 'freelance' | 'research' | 'future'
  color: string
  position: number // Position on timeline 0-1
}

// Constants for better performance and maintainability
const TIMELINE_CONSTANTS = {
  CARD_DISPLAY_WIDTH: 700,
  CARD_GAP: 32, // matches Tailwind gap-8 (2rem)
  // Derived width used for translation distance per card
  CARD_WIDTH: 700 + 32,
  ANIMATION_DURATION: 0.6,
  DRAG_DEBOUNCE_MS: 16, // 60fps
  START_YEAR: 2023,
  END_YEAR: 2026,
  HANDLE_WIDTH: 40, // Timeline handle width offset
  CONTAINER_HEIGHT: 500 // Increased height to prevent card cutoff
} as const

export default function Experience({ id }: ExperienceProps) {
  const { ref, isIntersecting, hasIntersected } = useScrollAnimation()
  const [currentExperience, setCurrentExperience] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardsViewportRef = useRef<HTMLDivElement>(null)
  const [sidePadding, setSidePadding] = useState<number>(0)
  
  // Draggable timeline values
  const timelineProgress = useMotionValue(0)
  const dragX = useMotionValue(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const trackWidth = useRef(0)

  // Experience data ordered chronologically with positions
  const experiences: Experience[] = [
    {
      id: "data-mine-2022",
      title: "Undergraduate Data Science Researcher",
      company: "The Data Mine, Purdue University",
      location: "West Lafayette, IN",
      duration: "Aug 2022 – May 2023",
      startDate: "2022-08",
      endDate: "2023-05",
      startYear: 2022,
      endYear: 2023,
      description: [
        "Analyzed social services datasets using R and SQL to surface trends and validate data pulls",
        "Cleaned, joined, and documented large datasets in Azure Data Studio to produce reliable, reusable tables",
        "Built Tableau dashboards and presented findings to Indiana FSSA stakeholders and at The Data Mine Symposium"
      ],
      technologies: ["R", "SQL", "Azure Data Studio", "Tableau", "PostgreSQL"],
      type: "research",
      color: "from-cyan-400 to-blue-500",
      position: 0
    },
    {
      id: "docreserve-2024",
      title: "Frontend Engineer",
      company: "DocReserve",
      location: "Boston, MA — Remote",
      duration: "Apr 2024 – Aug 2024",
      startDate: "2024-04",
      endDate: "2024-08",
      startYear: 2024,
      endYear: 2024,
      description: [
        "Built and refactored reusable UI components with React, TypeScript, and MUI to standardize the interface",
        "Improved the calendar experience (navigation, readability, empty/loading states) using TypeScript and Prisma",
        "Developed in a Docker-based environment for consistent builds and straightforward local setup"
      ],
      technologies: ["React", "TypeScript", "MUI", "Prisma", "Docker"],
      type: "freelance",
      color: "from-purple-400 to-violet-500",
      position: 0.5
    },
    {
      id: "vertikalx-2025",
      title: "Software Engineering Intern",
      company: "VertikalX",
      location: "West Lafayette, IN — Remote",
      duration: "May 2025 – Aug 2025",
      startDate: "2025-05",
      endDate: "2025-08",
      startYear: 2025,
      endYear: 2025,
      description: [
        "Migrated in-house auth to AWS Cognito with Google IdP via NextAuth, achieving zero downtime",
        "Built AWS Lambda services (Node.js/TS) using AWS Encryption SDK (KMS keyring) for code decryption",
        "Integrated Stripe APIs/webhooks for mobile onboarding and 501(c)(3)-compliant receipts",
        "Enhanced UX and created new flows in Next.js/NestJS; implemented GraphQL resolvers and added unit/integration tests"
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "AWS Cognito", "AWS Lambda", "AWS KMS", "Stripe", "GraphQL", "NestJS"],
      type: "internship",
      color: "from-blue-400 to-indigo-500",
      position: 1
    },
    {
      id: "future-2026",
      title: "What's Next?",
      company: "Exciting Opportunities Ahead",
      location: "Wherever Innovation Leads",
      duration: "2026 and Beyond",
      startDate: "2026-01",
      endDate: "∞",
      startYear: 2026,
      endYear: 2030,
      description: [
        "Open to full-time software engineering opportunities in cutting-edge technology companies",
        "Excited to contribute to innovative projects that make a meaningful impact on users and society",
        "Passionate about continuous learning and growing alongside talented teams in dynamic environments",
        "Ready to tackle new challenges in emerging technologies like AI, distributed systems, or developer tools"
      ],
      technologies: ["Innovation", "Growth", "Collaboration", "Impact", "Learning"],
      type: "future",
      color: "from-green-400 to-emerald-500",
      position: 1
    }
  ]

  // Memoized timeline years for performance
  const timelineYears = useMemo(() => 
    Array.from(
      { length: TIMELINE_CONSTANTS.END_YEAR - TIMELINE_CONSTANTS.START_YEAR + 1 }, 
      (_, i) => TIMELINE_CONSTANTS.START_YEAR + i
    ), 
    []
  )

  // Transform timeline progress to experience index
  const experienceIndex = useTransform(
    timelineProgress,
    [0, 1],
    [0, experiences.length - 1]
  )

  // Synchronize current experience with timeline progress (avoids update during drag for smooth UX)
  const currentExperienceRef = useRef(currentExperience)
  const isDraggingRef = useRef(isDragging)

  useEffect(() => {
    currentExperienceRef.current = currentExperience
  }, [currentExperience])

  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  useEffect(() => {
    const unsubscribe = experienceIndex.onChange((latest) => {
      const index = Math.round(latest)
      if (index !== currentExperienceRef.current && !isDraggingRef.current) {
        setCurrentExperience(index)
      }
    })
    return unsubscribe
  }, [experienceIndex])

  // Initialize timeline position
  useEffect(() => {
    const initializeTimeline = () => {
      if (timelineRef.current) {
        const trackRect = timelineRef.current.getBoundingClientRect()
        const trackWidthValue = Math.max(0, trackRect.width - 40) // exact inner width between markers (32px each side)
        trackWidth.current = trackWidthValue
        
        // Initialize timeline position based on current experience  
        const initialProgress = currentExperience / (experiences.length - 1)
        timelineProgress.set(initialProgress)
        dragX.set(initialProgress * trackWidthValue)
      }

      // Compute viewport-based side padding so first card starts centered
      if (cardsViewportRef.current) {
        const vw = cardsViewportRef.current.getBoundingClientRect().width
        const pad = Math.max(0, (vw - TIMELINE_CONSTANTS.CARD_DISPLAY_WIDTH) / 2)
        setSidePadding(pad)
      }
    }
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeTimeline, 100)
    
    const handleResize = () => {
      if (timelineRef.current) {
        const trackRect = timelineRef.current.getBoundingClientRect()
        const trackWidthValue = Math.max(0, trackRect.width - 32) // exact inner width between markers (32px each side)
        trackWidth.current = trackWidthValue
        
        // Maintain current position on resize
        const currentProgress = currentExperience / (experiences.length - 1)
        dragX.set(currentProgress * trackWidthValue)
      }

      if (cardsViewportRef.current) {
        const vw = cardsViewportRef.current.getBoundingClientRect().width
        const pad = Math.max(0, (vw - TIMELINE_CONSTANTS.CARD_DISPLAY_WIDTH) / 2)
        setSidePadding(pad)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [currentExperience, experiences.length, timelineProgress, dragX]);

  // Remove debouncing as it interferes with timeline sync
  // Direct updates work better for drag interaction

  // Handle drag - smooth continuous movement
  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (!timelineRef.current) return
    
    const trackRect = timelineRef.current.getBoundingClientRect()
    const trackWidthValue = Math.max(0, trackRect.width - 32) // Account for 32px padding on each side
    const currentX = Math.max(0, Math.min(trackWidthValue, dragX.get()))
    const newProgress = currentX / trackWidthValue
    
    timelineProgress.set(newProgress)
    // Don't update currentExperience during drag for smoother movement
  }, [dragX, timelineProgress])

  // Handle drag start/end
  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    // Snap to nearest experience
    const progress = timelineProgress.get()
    const nearestIndex = Math.round(progress * (experiences.length - 1))
    const targetProgress = nearestIndex / (experiences.length - 1)
    
    if (timelineRef.current) {
      const trackRect = timelineRef.current.getBoundingClientRect()
      const trackWidthValue = Math.max(0, trackRect.width - 32) // Account for 32px padding on each side
      
      timelineProgress.set(targetProgress)
      dragX.set(targetProgress * trackWidthValue)
      setCurrentExperience(nearestIndex)
    }
  }, [timelineProgress, dragX, experiences.length])

  // Navigate to specific experience
  const navigateToExperience = useCallback((index: number) => {
    const targetProgress = index / (experiences.length - 1)
    timelineProgress.set(targetProgress)
    
    if (timelineRef.current) {
      const trackRect = timelineRef.current.getBoundingClientRect()
      const trackWidthValue = Math.max(0, trackRect.width - 32) // Account for 32px padding on each side
      dragX.set(targetProgress * trackWidthValue)
    }
    
    setCurrentExperience(index)
  }, [experiences.length, timelineProgress, dragX])

  // Click year to navigate - map to actual experience years
  const navigateToYear = useCallback((year: number) => {
    // Find the experience that contains this year
    let targetIndex = 0
    
    if (year === 2023) {
      targetIndex = 0 // Data Mine (2022-2023, showing for 2023)
    } else if (year === 2024) {
      targetIndex = 1 // DocReserve (2024)
    } else if (year === 2025) {
      targetIndex = 2 // VertikalX (2025)
    } else if (year >= 2026) {
      targetIndex = 3 // Future opportunities (2026+)
    }
    
    navigateToExperience(targetIndex)
  }, [navigateToExperience])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        navigateToExperience(Math.max(0, currentExperience - 1))
        break
      case 'ArrowRight':
        e.preventDefault()
        navigateToExperience(Math.min(experiences.length - 1, currentExperience + 1))
        break
      case 'Home':
        e.preventDefault()
        navigateToExperience(0)
        break
      case 'End':
        e.preventDefault()
        navigateToExperience(experiences.length - 1)
        break
    }
  }, [currentExperience, experiences.length, navigateToExperience])

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const currentExp = experiences[currentExperience]
  const progress = useTransform(timelineProgress, [0, 1], [0, 100])

  return (
    <section 
      ref={ref}
      id={id}
      className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      role="region"
      aria-label="Professional Experience Timeline"
      aria-describedby="experience-instructions"
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
              id="experience-instructions"
              className="text-lg text-blue-200 max-w-2xl mx-auto"
              role="note"
              aria-live="polite"
            >
              Drag the timeline or use arrow keys to explore my career journey through interactive experience cards
            </p>
          </motion.div>

          {/* Draggable Timeline Scrubber */}
          <motion.div
            id={generateElementId('experience', 'timeline', 'scrubber')}
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Timeline Navigator</h3>
                <div className="text-sm text-blue-200">
                  {currentExp.startYear} - {currentExp.endYear} • Experience {currentExperience + 1} of {experiences.length}
                </div>
              </div>
              
              {/* Thin Timeline Track */}
              <div 
                ref={timelineRef}
                className="relative h-6 mb-2 overflow-visible px-4"
                role="slider"
                aria-label={`Experience timeline, showing ${currentExp.title} at ${currentExp.company}`}
                aria-valuemin={0}
                aria-valuemax={experiences.length - 1}
                aria-valuenow={currentExperience}
                aria-valuetext={`Experience ${currentExperience + 1} of ${experiences.length}: ${currentExp.title}`}
                tabIndex={0}
              >
                {/* Thin Timeline Line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-600 transform -translate-y-1/2 z-0" />
                
                {/* Progress Line */}
                <motion.div
                  className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 transform -translate-y-1/2 z-0"
                  style={{ 
                    width: useTransform(progress, [0, 100], ["0px", "calc(100% - 32px)"])
                  }}
                />
                
                {/* Year Circle Markers */}
                <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between transform -translate-y-1/2 px-4 z-10">
                  {timelineYears.map((year) => {
                    const hasExperience = experiences.some(exp => 
                      year >= exp.startYear && year <= exp.endYear
                    )
                    const isActiveYear = year >= currentExp.startYear && year <= currentExp.endYear
                    
                    return (
                      <motion.button
                        key={year}
                        onClick={() => navigateToYear(year)}
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer z-20 ${
                          isActiveYear 
                            ? 'bg-white border-white scale-125 shadow-lg shadow-white/30' 
                            : hasExperience
                              ? 'bg-blue-400 border-blue-400 hover:bg-white hover:border-white'
                              : 'bg-slate-500 border-slate-500 hover:bg-slate-400 hover:border-slate-400'
                        }`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    )
                  })}
                </div>
                
                {/* Draggable Handle */}
                <motion.div
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md cursor-grab active:cursor-grabbing border border-blue-400 z-30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                  style={{ 
                    left: 20,
                    x: dragX
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: Math.max(0, trackWidth.current || 0) }}
                  dragElastic={0}
                  dragMomentum={false}
                  onDrag={handleDrag}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: 1.2 }}
                  whileDrag={{ scale: 1.4 }}
                  role="slider"
                  tabIndex={0}
                  aria-label="Timeline scrubber handle"
                  aria-describedby="timeline-handle-instructions"
                >
                  {/* Handle Inner Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                </motion.div>
              </div>
              
              {/* Year Labels - positioned below timeline */}
              <div className="flex items-center justify-between px-4 mt-1">
                {timelineYears.map((year) => {
                  const hasExperience = experiences.some(exp => 
                    year >= exp.startYear && year <= exp.endYear
                  )
                  const isActiveYear = year >= currentExp.startYear && year <= currentExp.endYear
                  
                  return (
                    <motion.button
                      key={`label-${year}`}
                      onClick={() => navigateToYear(year)}
                      className={`text-xs font-medium transition-colors duration-300 cursor-pointer ${
                        isActiveYear 
                          ? 'text-white font-bold' 
                          : hasExperience
                            ? 'text-blue-200 hover:text-white'
                            : 'text-slate-400 hover:text-slate-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {year}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Timeline Instructions */}
              <div className="text-center">
                <p 
                  id="timeline-handle-instructions"
                  className="text-sm text-slate-400"
                >
                  Drag the timeline handle, click on years, or use arrow keys to navigate through experiences
                </p>
                <div className="sr-only" aria-live="polite" id="timeline-status">
                  Currently viewing {currentExp.title} at {currentExp.company}, experience {currentExperience + 1} of {experiences.length}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated Experience Cards Container */}
          <motion.div
            id={generateElementId('experience', 'cards', 'container')}
            variants={fadeInUp}
            className={"relative"}
            style={{ minHeight: TIMELINE_CONSTANTS.CONTAINER_HEIGHT }}
          >
            {/* Navigation Arrows */}
            <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none z-20">
              <motion.button
                onClick={() => navigateToExperience(Math.max(0, currentExperience - 1))}
                disabled={currentExperience === 0}
                className={`pointer-events-auto p-4 rounded-full shadow-xl transition-all duration-300 ${
                  currentExperience === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800/90 text-white hover:bg-slate-700 hover:shadow-2xl'
                }`}
                whileHover={currentExperience !== 0 ? { scale: 1.05 } : {}}
                whileTap={currentExperience !== 0 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                onClick={() => navigateToExperience(Math.min(experiences.length - 1, currentExperience + 1))}
                disabled={currentExperience === experiences.length - 1}
                className={`pointer-events-auto p-4 rounded-full shadow-xl transition-all duration-300 ${
                  currentExperience === experiences.length - 1
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800/90 text-white hover:bg-slate-700 hover:shadow-2xl'
                }`}
                whileHover={currentExperience !== experiences.length - 1 ? { scale: 1.05 } : {}}
                whileTap={currentExperience !== experiences.length - 1 ? { scale: 0.95 } : {}}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Experience Cards */}
            <div className="relative w-full py-6">
              <div ref={cardsViewportRef} className="h-full">
                <motion.div 
                  className="flex"
                  style={{ 
                    gap: TIMELINE_CONSTANTS.CARD_GAP,
                    paddingLeft: sidePadding,
                    paddingRight: sidePadding,
                    x: useTransform(
                      timelineProgress, 
                      [0, 1], 
                      [
                        0, // First card centered
                        -((experiences.length - 1) * TIMELINE_CONSTANTS.CARD_WIDTH) // translate by card width + gap per step
                      ]
                    ),
                    willChange: 'transform'
                  }}>
                {experiences.map((experience, index) => {
                  // Emphasis based on how close the timeline is to this card's center
                  const center = index / (experiences.length - 1)
                  const maxDist = 0.5 / (experiences.length - 1) // half step between cards
                  const centerProgress = useTransform(timelineProgress, (p) => {
                    const d = Math.abs(p - center)
                    const t = 1 - Math.min(d / maxDist, 1)
                    return t // 1 at center, 0 when half-step away or more
                  })

                  const scaleMV = useTransform(centerProgress, [0, 1], [0.85, 1])
                  const opacityMV = useTransform(centerProgress, [0, 1], [0.5, 1])
                  const rotateYMV = useTransform(timelineProgress, (p) => {
                    const dir = p < center ? 1 : -1
                    const d = Math.abs(p - center)
                    const t = 1 - Math.min(d / maxDist, 1)
                    return dir * (1 - t) * 15 // tilt away from center
                  })

                  const isActive = index === currentExperience
                  
                  return (
                    <motion.div
                      key={experience.id}
                      className="flex-shrink-0"
                      style={{ 
                        width: `${TIMELINE_CONSTANTS.CARD_DISPLAY_WIDTH}px`,
                        scale: scaleMV,
                        opacity: opacityMV,
                        rotateY: rotateYMV
                      }}
                    >
                      <Card
                        id={generateElementId('experience', 'card', experience.id)}
                        variant="elevated"
                        padding="lg"
                        className="relative overflow-hidden bg-slate-800/90 backdrop-blur-md shadow-2xl border border-slate-700"
                      >
                        {/* Gradient Accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${experience.color}`} />
                        
                        {/* Card Content */}
                        <div className="relative">
                          {/* Header */}
                          <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <motion.h3 
                                  className="text-2xl font-bold text-white mb-2"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 10 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {experience.title}
                                </motion.h3>
                                <motion.div 
                                  className="flex items-center text-blue-300 mb-2"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 10 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <Building2 className="w-6 h-6 mr-3" />
                                  <span className="font-semibold text-xl">{experience.company}</span>
                                </motion.div>
                              </div>
                              <motion.span 
                                className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${experience.color} text-white`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                                transition={{ delay: 0.4 }}
                              >
                                {experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
                              </motion.span>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-300">
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.6, x: -10 }}
                                transition={{ delay: 0.4 }}
                              >
                                <Calendar className="w-5 h-5 mr-2" />
                                <span className="font-medium">{experience.duration}</span>
                              </motion.div>
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.6, x: -10 }}
                                transition={{ delay: 0.5 }}
                              >
                                <MapPin className="w-5 h-5 mr-2" />
                                <span>{experience.location}</span>
                              </motion.div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="mb-4">
                            <ul className="space-y-2">
                              {experience.description.map((item, descIndex) => (
                                <motion.li
                                  key={descIndex}
                                  className="flex items-start text-slate-200 leading-relaxed"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
                                  transition={{ delay: 0.6 + descIndex * 0.1 }}
                                >
                                  <div className={`w-2 h-2 rounded-full mt-3 mr-4 flex-shrink-0 bg-gradient-to-r ${experience.color}`} />
                                  <span className="text-lg">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {/* Technologies */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 10 }}
                            transition={{ delay: 0.8 }}
                          >
                            <h4 className="text-xl font-semibold text-white mb-3">
                              Technologies & Tools
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {experience.technologies.map((tech, techIndex) => (
                                <motion.span
                                  key={tech}
                                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${experience.color} bg-opacity-20 text-white border border-current border-opacity-30`}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.9 }}
                                  transition={{ delay: 0.9 + techIndex * 0.05 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
                </motion.div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}