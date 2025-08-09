// Common component props
export interface BaseComponentProps {
  id: string
  className?: string
  children?: React.ReactNode
}

// Project data structure
export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  category: 'web-app' | 'mobile-app' | 'tool' | 'experiment' | 'design'
  status: 'completed' | 'in-progress' | 'concept'
  featured: boolean
  image: string
  gallery: string[]
  links: {
    demo?: string
    github?: string
    article?: string
    figma?: string
  }
  createdDate: string
  updatedDate: string
  metrics?: {
    views?: number
    stars?: number
    forks?: number
  }
}

// Skills data structure
export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'mobile' | 'design' | 'tools' | 'other'
  proficiency: 1 | 2 | 3 | 4 | 5 // 1-5 scale
  icon?: string
  color?: string
  description?: string
}

// Experience/Timeline data structure
export interface Experience {
  id: string
  title: string
  company?: string
  location?: string
  type: 'work' | 'education' | 'project' | 'achievement'
  startDate: string
  endDate?: string // undefined for current positions
  description: string
  technologies?: string[]
  achievements?: string[]
  links?: {
    website?: string
    certificate?: string
  }
}

// Contact form data
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Animation variants
export interface AnimationVariant {
  initial: Record<string, unknown>
  animate: Record<string, unknown>
  exit?: Record<string, unknown>
  transition?: Record<string, unknown>
}

// Navigation item
export interface NavItem {
  id: string
  label: string
  href: string
  external?: boolean
}

// Social media links
export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  color?: string
}

// SEO metadata
export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
}

// Performance metrics
export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

// Component state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Form validation
export interface FormValidation {
  isValid: boolean
  errors: Record<string, string[]>
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  status: 'success' | 'error'
}

// Intersection observer hook return type
export interface UseIntersectionObserverResult {
  ref: React.RefObject<HTMLElement>
  isIntersecting: boolean
  hasIntersected: boolean
}

// Device type detection
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Scroll position data
export interface ScrollPosition {
  x: number
  y: number
  progress: number // 0-1 based on document height
}

// Three.js related types
export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Rotation {
  x: number
  y: number
  z: number
}

// Component ref types for imperative actions
export interface AnimatedComponentRef {
  triggerAnimation: () => void
  resetAnimation: () => void
}

// Filter options for projects
export interface ProjectFilters {
  category?: Project['category']
  technology?: string
  status?: Project['status']
  search?: string
}