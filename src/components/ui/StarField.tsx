'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  animationDelay: number
  animationDuration: number
}

interface StarFieldProps {
  id: string
  className?: string
  starCount?: number
  density?: 'low' | 'medium' | 'high'
}

export default function StarField({ 
  id, 
  className = '', 
  starCount = 150,
  density = 'medium' 
}: StarFieldProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const stars = useMemo(() => {
    if (!isClient) return []
    
    const starArray: Star[] = []
    const actualStarCount = density === 'low' ? starCount * 0.5 : 
                           density === 'high' ? starCount * 1.5 : 
                           starCount
    
    // Use a seed for consistent random generation
    let seed = 12345
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    for (let i = 0; i < actualStarCount; i++) {
      starArray.push({
        id: i,
        x: seededRandom() * 100, // Percentage
        y: seededRandom() * 100, // Percentage
        size: seededRandom() * 3 + 1, // 1-4px
        opacity: seededRandom() * 0.8 + 0.2, // 0.2-1.0
        animationDelay: seededRandom() * 5, // 0-5 seconds
        animationDuration: seededRandom() * 4 + 3, // 3-7 seconds
      })
    }
    
    return starArray
  }, [starCount, density, isClient])
  
  if (!isClient) {
    return null
  }

  return (
    <div 
      id={id}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.animationDuration,
            delay: star.animationDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Add some shooting stars occasionally */}
      {Array.from({ length: 3 }).map((_, i) => {
        // Use seeded random for consistent positioning
        let shootingSeed = 54321 + i * 100
        const shootingSeededRandom = () => {
          shootingSeed = (shootingSeed * 9301 + 49297) % 233280
          return shootingSeed / 233280
        }
        
        return (
          <motion.div
            key={`shooting-star-${i}`}
            className="absolute w-1 h-1 bg-blue-200 rounded-full"
            style={{
              left: `${shootingSeededRandom() * 20}%`, // Start from left side
              top: `${shootingSeededRandom() * 100}%`,
            }}
            animate={{
              x: ['0%', '300px'],
              y: ['0%', '100px'],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 8 + shootingSeededRandom() * 10, // Staggered timing
              repeat: Infinity,
              repeatDelay: 15 + shootingSeededRandom() * 20, // Random intervals
              ease: "easeOut",
            }}
          />
        )
      })}
      
      {/* Add some constellation-like clusters */}
      {Array.from({ length: 5 }).map((_, clusterIndex) => {
        // Use seeded random for clusters
        let clusterSeed = 98765 + clusterIndex * 200
        const clusterSeededRandom = () => {
          clusterSeed = (clusterSeed * 9301 + 49297) % 233280
          return clusterSeed / 233280
        }
        
        const clusterX = clusterSeededRandom() * 80 + 10 // 10-90%
        const clusterY = clusterSeededRandom() * 80 + 10 // 10-90%
        
        return (
          <div
            key={`cluster-${clusterIndex}`}
            className="absolute"
            style={{
              left: `${clusterX}%`,
              top: `${clusterY}%`,
            }}
          >
            {Array.from({ length: 6 }).map((_, starIndex) => {
              let starSeed = clusterSeed + starIndex * 50
              const starSeededRandom = () => {
                starSeed = (starSeed * 9301 + 49297) % 233280
                return starSeed / 233280
              }
              
              return (
                <motion.div
                  key={`cluster-star-${starIndex}`}
                  className="absolute w-1 h-1 bg-blue-100 rounded-full"
                  style={{
                    left: `${(starSeededRandom() - 0.5) * 60}px`, // Cluster around center
                    top: `${(starSeededRandom() - 0.5) * 60}px`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + starSeededRandom() * 3,
                    delay: starIndex * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}