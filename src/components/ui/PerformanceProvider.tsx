'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useTheme'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

interface PerformanceContextType {
  metrics: PerformanceMetrics
  isLowEndDevice: boolean
  connectionSpeed: 'slow' | 'fast' | 'unknown'
  prefersReducedMotion: boolean
  enableAnimations: boolean
}

const PerformanceContext = createContext<PerformanceContextType>({
  metrics: { fcp: null, lcp: null, fid: null, cls: null, ttfb: null },
  isLowEndDevice: false,
  connectionSpeed: 'unknown',
  prefersReducedMotion: false,
  enableAnimations: true
})

export const usePerformance = () => useContext(PerformanceContext)

interface PerformanceProviderProps {
  children: ReactNode
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null, 
    fid: null,
    cls: null,
    ttfb: null
  })
  
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown')
  const prefersReducedMotion = useReducedMotion()
  const enableAnimations = !prefersReducedMotion && !isLowEndDevice

  useEffect(() => {
    // Device capability detection
    const detectDeviceCapabilities = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
      
      // Consider device low-end if it has limited CPU or memory
      const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2
      setIsLowEndDevice(isLowEnd)
      
      // Detect connection speed
      if (connection) {
        const effectiveType = connection.effectiveType
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionSpeed('slow')
        } else if (effectiveType === '3g' || effectiveType === '4g') {
          setConnectionSpeed('fast')
        }
      }
    }

    detectDeviceCapabilities()

    // Web Vitals measurement
    const measureWebVitals = () => {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['paint'] })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.renderTime || lastEntry.loadTime }))
        }
      })

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('LCP observer not supported:', error)
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { processingStart?: number }>) {
          if (entry.name === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          }
        }
      })

      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('FID observer not supported:', error)
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }))
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('CLS observer not supported:', error)
      }

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart
        setMetrics(prev => ({ ...prev, ttfb }))
      }
    }

    measureWebVitals()

    // Performance optimization based on device capabilities
    if (isLowEndDevice) {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--animation-duration', '0.1s')
      
      // Disable non-essential animations
      const style = document.createElement('style')
      style.textContent = `
        * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isLowEndDevice])

  // Log performance metrics to console for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const metricsWithValues = Object.entries(metrics).filter(([, value]) => value !== null)
      if (metricsWithValues.length > 0) {
        console.group('🔬 Performance Metrics')
        metricsWithValues.forEach(([key, value]) => {
          const formatted = typeof value === 'number' ? `${value.toFixed(2)}ms` : value
          const isGood = getMetricStatus(key, value as number)
          console.log(`${key.toUpperCase()}: ${formatted} ${isGood ? '✅' : '⚠️'}`)
        })
        console.groupEnd()
      }
    }
  }, [metrics])

  const getMetricStatus = (metric: string, value: number): boolean => {
    switch (metric) {
      case 'fcp': return value < 1500
      case 'lcp': return value < 2500
      case 'fid': return value < 100
      case 'cls': return value < 0.1
      case 'ttfb': return value < 600
      default: return true
    }
  }

  const contextValue: PerformanceContextType = {
    metrics,
    isLowEndDevice,
    connectionSpeed,
    prefersReducedMotion,
    enableAnimations
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  )
}