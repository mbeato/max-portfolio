'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { debounce } from '@/lib/utils'

interface BinaryColumn {
  id: number
  x: number
  chars: string[]
  speed: number
  opacity: number
}

interface BinaryMatrixProps {
  id: string
  className?: string
  density?: 'low' | 'medium' | 'high'
}

// Constants for performance optimization
const DENSITY_CONFIG = {
  low: { columnSpacing: 30, updateInterval: 100 },
  medium: { columnSpacing: 20, updateInterval: 80 },
  high: { columnSpacing: 15, updateInterval: 60 }
} as const

export default function BinaryMatrix({ 
  id, 
  className = '', 
  density = 'medium' 
}: BinaryMatrixProps) {
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const columnsRef = useRef<BinaryColumn[]>([])
  const lastUpdateRef = useRef<number>(0)
  
  // Use intersection observer to pause animation when not visible
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false
  })
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoize configuration based on density
  const config = useMemo(() => DENSITY_CONFIG[density], [density])

  const initializeMatrix = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)

    const fontSize = 16
    const columnWidth = config.columnSpacing
    const columnCount = Math.floor(canvas.width / columnWidth)
    const rowCount = Math.floor(canvas.height / fontSize)

    // Initialize columns
    columnsRef.current = []
    let seed = 12345

    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < columnCount; i++) {
      const column: BinaryColumn = {
        id: i,
        x: i * columnWidth,
        chars: Array(rowCount).fill('').map(() => seededRandom() > 0.5 ? '1' : '0'),
        speed: seededRandom() * config.updateInterval + config.updateInterval, // Dynamic based on density
        opacity: seededRandom() * 0.4 + 0.6, // 0.6-1.0 opacity
      }
      columnsRef.current.push(column)
    }
  }, [config])

  const updateMatrix = useCallback((currentTime: number) => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with slight trail effect for matrix feel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const fontSize = 16
    ctx.font = `${fontSize}px "Courier New", monospace`
    ctx.textBaseline = 'top'

    // Update columns
    columnsRef.current.forEach((column, columnIndex) => {
      // Update binary values at different speeds
      if (currentTime - lastUpdateRef.current > column.speed) {
        // Randomly change some characters in the column
        column.chars = column.chars.map((char, rowIndex) => {
          // Create a wave effect - higher chance of change at certain positions
          const wavePosition = (currentTime * 0.001 + columnIndex * 0.1) % (Math.PI * 2)
          const changeChance = (Math.sin(wavePosition + rowIndex * 0.2) + 1) * 0.02 // 0-4% chance
          
          if (Math.random() < changeChance) {
            return Math.random() > 0.5 ? '1' : '0'
          }
          return char
        })
      }

      // Draw the column
      column.chars.forEach((char, rowIndex) => {
        const y = rowIndex * fontSize
        
        // Create gradient effect - brighter at top, dimmer at bottom
        const gradientPosition = rowIndex / column.chars.length
        const brightness = Math.max(0.1, 1 - gradientPosition)
        
        // Vary color intensity
        const greenIntensity = Math.floor(brightness * 255 * column.opacity)
        ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, ${brightness * column.opacity})`
        
        // Add occasional bright highlights
        if (Math.random() < 0.01) {
          ctx.fillStyle = `rgba(100, 255, 100, ${brightness})`
        }
        
        ctx.fillText(char, column.x, y)
      })
    })

    lastUpdateRef.current = currentTime
  }, [])

  const animate = useCallback((currentTime: number) => {
    if (!isIntersecting) return // Pause animation when not visible
    
    updateMatrix(currentTime)
    animationRef.current = requestAnimationFrame(animate)
  }, [updateMatrix, isIntersecting])

  // Debounced resize handler to prevent excessive re-initialization
  const debouncedResize = useMemo(
    () => debounce(() => initializeMatrix(), 250),
    [initializeMatrix]
  )

  useEffect(() => {
    if (!isClient) return

    initializeMatrix()
    
    // Only start animation if component is visible
    if (isIntersecting) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClient, initializeMatrix])

  // Handle visibility changes
  useEffect(() => {
    if (isIntersecting && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (!isIntersecting && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
  }, [isIntersecting, animate])

  // Handle resize events
  useEffect(() => {
    window.addEventListener('resize', debouncedResize)
    return () => window.removeEventListener('resize', debouncedResize)
  }, [debouncedResize])

  if (!isClient) {
    return null
  }

  return (
    <div 
      ref={observerRef}
      id={id}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          filter: 'blur(0.5px)',
          willChange: 'auto'
        }}
      />
      
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/70 via-gray-50/50 to-gray-50/70 dark:from-gray-900/70 dark:via-gray-900/50 dark:to-gray-900/70 pointer-events-none" />
    </div>
  )
}