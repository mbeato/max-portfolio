import { useEffect, useRef, useState } from 'react'
import type { UseIntersectionObserverResult } from '@/lib/types'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
  triggerOnce?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
  triggerOnce = true
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverResult {
  const ref = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const frozen = freezeOnceVisible && hasIntersected

    if (frozen) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        // If triggerOnce is true and element has intersected, disconnect observer
        if (triggerOnce && isElementIntersecting) {
          observer.unobserve(element)
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, triggerOnce, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Specialized hook for scroll animations
export function useScrollAnimation(options?: UseIntersectionObserverOptions) {
  return useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    ...options
  })
}

// Hook for elements that need to trigger multiple times
export function useRepeatingIntersection(options?: UseIntersectionObserverOptions) {
  return useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: false,
    ...options
  })
}