import type { NavItem, SocialLink } from './types'

// Site configuration
export const SITE_CONFIG = {
  name: "Maximus Beato",
  title: "Maximus Beato - Portfolio",
  description: "Modern portfolio website showcasing innovative projects and technical expertise in full-stack development.",
  url: "https://maximusbeato.com",
  email: "contact@maximusbeato.com", // Replace with actual email
  location: "Your Location", // Replace with actual location
  timezone: "America/New_York", // Replace with actual timezone
} as const

// Navigation items
export const NAVIGATION: NavItem[] = [
  {
    id: "nav-home",
    label: "Home",
    href: "#hero"
  },
  {
    id: "nav-about", 
    label: "About",
    href: "#about"
  },
  {
    id: "nav-projects",
    label: "Projects", 
    href: "#projects"
  },
  {
    id: "nav-contact",
    label: "Contact",
    href: "#contact"
  }
] as const

// Social media links - Replace with actual profiles
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "social-github",
    name: "GitHub",
    url: "https://github.com/maximusbeato", // Replace with actual
    icon: "Github",
    color: "#333"
  },
  {
    id: "social-linkedin", 
    name: "LinkedIn",
    url: "https://linkedin.com/in/maximusbeato", // Replace with actual
    icon: "Linkedin",
    color: "#0077B5"
  },
  {
    id: "social-twitter",
    name: "Twitter",
    url: "https://twitter.com/maximusbeato", // Replace with actual
    icon: "Twitter", 
    color: "#1DA1F2"
  },
  {
    id: "social-email",
    name: "Email",
    url: `mailto:${SITE_CONFIG.email}`,
    icon: "Mail",
    color: "#EA4335"
  }
] as const

// Skills categories and data
export const SKILL_CATEGORIES = {
  frontend: {
    name: "Frontend",
    color: "#61DAFB",
    skills: [
      "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", 
      "Tailwind CSS", "Framer Motion", "Three.js", "Vue.js"
    ]
  },
  backend: {
    name: "Backend", 
    color: "#339933",
    skills: [
      "Node.js", "Express.js", "Python", "PostgreSQL", "MongoDB",
      "REST APIs", "GraphQL", "Prisma", "Supabase", "Firebase"
    ]
  },
  tools: {
    name: "Tools & Technologies",
    color: "#FF6B6B", 
    skills: [
      "Git", "Docker", "AWS", "Vercel", "Figma", "VS Code",
      "Linux", "CI/CD", "Jest", "Cypress"
    ]
  }
} as const

// Project categories
export const PROJECT_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "web-app", label: "Web Applications" },
  { id: "mobile-app", label: "Mobile Apps" },
  { id: "tool", label: "Tools & Utilities" },
  { id: "experiment", label: "Experiments" },
  { id: "design", label: "Design Work" }
] as const

// Animation settings
export const ANIMATION_CONFIG = {
  // Respect user's motion preferences
  reducedMotion: false, // Will be set dynamically
  
  // Common durations
  durations: {
    fast: 0.15,
    normal: 0.25,  
    slow: 0.35
  },

  // Common easing curves
  easings: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    spring: { type: "spring", damping: 20, stiffness: 300 }
  },

  // Stagger delays
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2
  }
} as const

// Responsive breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768, 
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  tooltip: 60
} as const

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  lighthouse: {
    performance: 90,
    accessibility: 90, 
    bestPractices: 90,
    seo: 90
  },
  coreWebVitals: {
    fcp: 1500, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms) 
    fid: 100,  // First Input Delay (ms)
    cls: 0.1   // Cumulative Layout Shift
  }
} as const

// Email.js configuration keys (using @emailjs/browser)
export const EMAIL_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  // For development/demo purposes, these can be empty
  // In production, these should be set via environment variables
} as const

// Contact form validation rules
export const FORM_VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 50,
    required: true
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  subject: {
    minLength: 5,
    maxLength: 100,
    required: true
  },
  message: {
    minLength: 10,
    maxLength: 1000,
    required: true
  }
} as const

// SEO defaults
export const SEO_DEFAULTS = {
  titleTemplate: "%s | Maximus Beato",
  defaultTitle: "Maximus Beato - Portfolio",
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_CONFIG.name
  },
  twitter: {
    cardType: "summary_large_image"
  }
} as const

// Theme configuration
export const THEME_CONFIG = {
  storageKey: "portfolio-theme",
  defaultTheme: "system" as const,
  themes: ["light", "dark", "system"] as const
} as const

// 3D scene configuration
export const THREE_CONFIG = {
  camera: {
    position: [0, 0, 5] as [number, number, number],
    fov: 75
  },
  renderer: {
    antialias: true,
    alpha: true
  },
  controls: {
    enableZoom: false,
    enablePan: false,
    autoRotate: true,
    autoRotateSpeed: 0.5
  }
} as const

// Error messages
export const ERROR_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  network: "Network error. Please check your connection.",
  validation: "Please check your input and try again.",
  emailSend: "Failed to send message. Please try again later.",
  required: "This field is required."
} as const

// Success messages  
export const SUCCESS_MESSAGES = {
  emailSent: "Message sent successfully! I'll get back to you soon.",
  formSubmit: "Form submitted successfully!",
  copied: "Copied to clipboard!"
} as const