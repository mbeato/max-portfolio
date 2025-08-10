'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface MousePosition {
  x: number
  y: number
}

interface ParticleProps {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

// Geometric floating shapes that respond to scroll and mouse
function FloatingGeometry({ mousePos }: { mousePos: MousePosition }) {
  const { scrollYProgress } = useScroll()
  
  const shapes = [
    { id: 1, size: 80, color: 'from-blue-500 to-cyan-400', delay: 0 },
    { id: 2, size: 60, color: 'from-purple-500 to-pink-400', delay: 0.2 },
    { id: 3, size: 100, color: 'from-green-400 to-blue-500', delay: 0.4 },
    { id: 4, size: 50, color: 'from-orange-400 to-red-500', delay: 0.6 },
    { id: 5, size: 70, color: 'from-indigo-500 to-purple-500', delay: 0.8 }
  ]

  return (
    <>
      {shapes.map((shape) => {
        const yOffset = useTransform(scrollYProgress, [0, 1], [0, -400])
        const rotation = useTransform(scrollYProgress, [0, 1], [0, 360])
        
        return (
          <motion.div
            key={shape.id}
            className={`absolute bg-gradient-to-br ${shape.color} opacity-30`}
            style={{
              width: shape.size,
              height: shape.size,
              rotate: rotation,
              y: yOffset,
              left: `${5 + (shape.id * 15)}%`,
              top: `${15 + (shape.id * 10)}%`,
              borderRadius: shape.id % 2 === 0 ? '50%' : '20%',
              filter: 'blur(2px)',
            }}
            animate={{
              x: mousePos.x * (shape.delay + 0.1) * 0.5,
              y: mousePos.y * (shape.delay + 0.1) * 0.5,
              scale: [1, 1.3, 1],
            }}
            transition={{
              scale: {
                duration: 4 + shape.delay,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: { type: "spring", damping: 25, stiffness: 80 },
              y: { type: "spring", damping: 25, stiffness: 80 }
            }}
          />
        )
      })}
    </>
  )
}

// Enhanced particle system that follows mouse and animates on scroll
function ParticleSystem({ mousePos }: { mousePos: MousePosition }) {
  const [particles, setParticles] = useState<ParticleProps[]>([])
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  const particleScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.5, 1.8, 1])
  const particleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 0.9, 0.9, 0.5])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full shadow-lg ${
            particle.id % 3 === 0 ? 'bg-blue-400' : 
            particle.id % 3 === 1 ? 'bg-purple-400' : 'bg-cyan-400'
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            scale: particleScale,
            opacity: particleOpacity,
            filter: 'blur(1px)',
          }}
          animate={{
            x: mousePos.x * 0.2 * (particle.id % 4 + 1),
            y: mousePos.y * 0.2 * (particle.id % 4 + 1),
            rotate: [0, 360],
          }}
          transition={{
            x: { type: "spring", damping: 30, stiffness: 80 },
            y: { type: "spring", damping: 30, stiffness: 80 },
            rotate: {
              duration: 8 + particle.delay,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      ))}
    </div>
  )
}

// Sharp geometric lines that create depth
function GeometricLines({ mousePos }: { mousePos: MousePosition }) {
  const { scrollYProgress } = useScroll()
  const lineProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  
  const lines = [
    { id: 1, angle: 45, length: 200, offset: { x: 20, y: 30 } },
    { id: 2, angle: -30, length: 150, offset: { x: 70, y: 20 } },
    { id: 3, angle: 120, length: 180, offset: { x: 30, y: 70 } },
    { id: 4, angle: -60, length: 120, offset: { x: 80, y: 60 } },
  ]

  return (
    <>
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute origin-left bg-gradient-to-r from-blue-400/30 via-cyan-400/50 to-transparent h-0.5"
          style={{
            left: `${line.offset.x}%`,
            top: `${line.offset.y}%`,
            rotate: line.angle,
            width: line.length,
            scaleX: lineProgress,
          }}
          animate={{
            x: mousePos.x * 0.05,
            y: mousePos.y * 0.05,
          }}
          transition={{
            x: { type: "spring", damping: 100, stiffness: 200 },
            y: { type: "spring", damping: 100, stiffness: 200 }
          }}
        />
      ))}
    </>
  )
}

// Enhanced mouse cursor trail effect
function MouseTrail({ mousePos }: { mousePos: MousePosition }) {
  const [trail, setTrail] = useState<MousePosition[]>([])
  const trailLength = 12

  useEffect(() => {
    setTrail(prev => {
      const newTrail = [mousePos, ...prev.slice(0, trailLength - 1)]
      return newTrail
    })
  }, [mousePos])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${
            index % 2 === 0 ? 'bg-blue-500/40' : 'bg-purple-500/30'
          }`}
          style={{
            width: 8 + (trailLength - index) * 2,
            height: 8 + (trailLength - index) * 2,
            left: point.x - (4 + (trailLength - index)),
            top: point.y - (4 + (trailLength - index)),
            opacity: (trailLength - index) / trailLength * 0.8,
            filter: `blur(${index * 0.5}px)`,
          }}
          animate={{
            scale: [1, 0.8, 0],
            opacity: [(trailLength - index) / trailLength * 0.8, 0]
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Scroll-driven grid animation
function AnimatedGrid() {
  const { scrollYProgress } = useScroll()
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.3, 0.2, 0.05])
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: gridOpacity,
        scale: gridScale,
        backgroundImage: `
          radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.2) 2px, transparent 0),
          radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.15) 1px, transparent 0)
        `,
        backgroundSize: '100px 100px',
        backgroundPosition: '0 0, 25px 25px',
      }}
    />
  )
}

interface InteractiveGraphicsProps {
  id: string
  className?: string
}

export default function InteractiveGraphics({ id, className = '' }: InteractiveGraphicsProps) {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const springMousePos = useSpring(mousePos, { damping: 50, stiffness: 200 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePos({ x, y })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div 
      id={id}
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Animated Grid Background */}
      <AnimatedGrid />
      
      {/* Floating Geometric Shapes */}
      <FloatingGeometry mousePos={springMousePos} />
      
      {/* Particle System */}
      <ParticleSystem mousePos={springMousePos} />
      
      {/* Sharp Geometric Lines */}
      <GeometricLines mousePos={springMousePos} />
      
      {/* Mouse Trail Effect */}
      <MouseTrail mousePos={mousePos} />
      
      {/* Enhanced sharp accent elements */}
      <motion.div 
        className="absolute top-20 right-20 w-40 h-40 border-4 border-blue-400/30 transform rotate-45"
        animate={{ 
          rotate: [45, 90, 45],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-32 h-32 border-2 border-purple-400/40 rounded-full"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        className="absolute top-1/3 left-1/4 w-24 h-2 bg-gradient-to-r from-cyan-400/50 to-transparent transform -rotate-12 rounded-full"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Additional dynamic elements */}
      <motion.div 
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg transform rotate-12"
        animate={{
          rotate: [12, -12, 12],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-1/4 w-16 h-16 bg-orange-400/25 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.25, 0.5, 0.25]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}