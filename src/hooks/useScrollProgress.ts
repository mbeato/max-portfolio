'use client'

import { useState, useEffect } from 'react'
import { throttle } from '@/lib/utils'

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isScrolling, setIsScrolling] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout

    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / scrollHeight) * 100

      setScrollProgress(Math.min(100, Math.max(0, progress)))
      
      // Determine scroll direction
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      setLastScrollTop(scrollTop)

      // Track if user is actively scrolling
      setIsScrolling(true)
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }, 16) // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [lastScrollTop])

  return {
    scrollProgress,
    scrollDirection,
    isScrolling,
    scrollY: lastScrollTop
  }
}

// Hook for parallax effects
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset
      setOffset(scrollTop * speed)
    }, 16)

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return offset
}

// Hook for section-based navigation tracking
export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.querySelector(`#${sectionIds[i]}`)
        if (element) {
          const elementTop = (element as HTMLElement).offsetTop
          
          if (scrollPosition >= elementTop) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sectionIds])

  return activeSection
}