import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Animation duration constants
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
} as const

// Common animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

// Stagger animation for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Utility function to check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Create accessible animation variants that respect reduced motion
export const createAccessibleVariant = (variant: Record<string, unknown>) => {
  if (prefersReducedMotion()) {
    return {
      initial: variant.animate,
      animate: variant.animate,
      exit: variant.animate
    }
  }
  return variant
}

// Utility for generating unique IDs following our convention
export const generateElementId = (section: string, element: string, purpose: string) => {
  return `${section}-${element}-${purpose}`.toLowerCase().replace(/\s+/g, '-')
}

// Debounce utility for performance
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Format date utility
export const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Clamp utility for numeric values
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

// Linear interpolation utility
export const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor
}