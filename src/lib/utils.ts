import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
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



