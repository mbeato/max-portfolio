import type { Project } from './types'

// Enhanced project data structure for easy integration
export const PROJECTS: Project[] = [
  {
    id: 'modern-portfolio',
    title: 'Modern Portfolio Website',
    description: 'A cutting-edge portfolio showcasing modern web development techniques with 3D animations and interactive elements.',
    longDescription: `This portfolio website represents the pinnacle of modern web development, 
    combining Next.js 15 with advanced animation libraries and 3D graphics. Features include 
    interactive skill bubbles, floating geometric shapes, smooth scroll animations, and a 
    sophisticated theme system. Built with performance and accessibility in mind, achieving 
    90+ Lighthouse scores across all metrics.`,
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'React'],
    category: 'web-app',
    status: 'in-progress',
    featured: true,
    image: '/projects/portfolio-preview.jpg',
    gallery: [
      '/projects/portfolio-hero.jpg',
      '/projects/portfolio-skills.jpg',
      '/projects/portfolio-projects.jpg'
    ],
    links: {
      demo: 'https://maximusbeato.com',
      github: 'https://github.com/mbeato/portfolio',
      article: 'https://blog.maximusbeato.com/building-modern-portfolio'
    },
    createdDate: '2024-03-01',
    updatedDate: '2024-03-15',
    metrics: {
      views: 1250,
      stars: 34
    }
  },
  {
    id: 'ecommerce-platform',
    title: 'Full-Stack E-Commerce Platform',
    description: 'Comprehensive e-commerce solution with modern payment processing, inventory management, and admin dashboard.',
    longDescription: `A complete e-commerce platform built with modern technologies, featuring 
    user authentication, product catalog management, shopping cart functionality, secure payment 
    processing with Stripe, order management, and a comprehensive admin dashboard. Includes 
    real-time inventory tracking, email notifications, and responsive design for all devices.`,
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth.js', 'Tailwind CSS'],
    category: 'web-app',
    status: 'completed',
    featured: true,
    image: '/projects/ecommerce-preview.jpg',
    gallery: [
      '/projects/ecommerce-home.jpg',
      '/projects/ecommerce-product.jpg',
      '/projects/ecommerce-admin.jpg'
    ],
    links: {
      demo: 'https://shop-demo.maximusbeato.com',
      github: 'https://github.com/mbeato/ecommerce-platform'
    },
    createdDate: '2024-01-15',
    updatedDate: '2024-02-28',
    metrics: {
      views: 890,
      stars: 67,
      forks: 12
    }
  },
  {
    id: 'task-management',
    title: 'Collaborative Task Manager',
    description: 'Real-time collaborative task management application with team features and progress tracking.',
    longDescription: `A sophisticated task management application designed for teams, featuring 
    real-time collaboration through WebSockets, drag-and-drop task organization, project timelines, 
    team member assignments, file attachments, and comprehensive reporting. Built with a focus on 
    user experience and productivity enhancement.`,
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'Material-UI'],
    category: 'web-app',
    status: 'completed',
    featured: false,
    image: '/projects/taskmanager-preview.jpg',
    gallery: [
      '/projects/taskmanager-dashboard.jpg',
      '/projects/taskmanager-kanban.jpg',
      '/projects/taskmanager-analytics.jpg'
    ],
    links: {
      demo: 'https://tasks.maximusbeato.com',
      github: 'https://github.com/mbeato/task-manager'
    },
    createdDate: '2023-11-10',
    updatedDate: '2023-12-20',
    metrics: {
      views: 654,
      stars: 43,
      forks: 8
    }
  },
  {
    id: 'api-testing-tool',
    title: 'API Testing & Documentation Tool',
    description: 'Developer tool for API testing, documentation generation, and endpoint monitoring.',
    longDescription: `A comprehensive API development tool that combines testing, documentation, 
    and monitoring capabilities. Features include automated test generation, endpoint documentation 
    with interactive examples, performance monitoring, and team collaboration features. Designed 
    to streamline the API development workflow.`,
    technologies: ['Electron', 'React', 'Node.js', 'Jest', 'Swagger', 'Chart.js'],
    category: 'tool',
    status: 'completed',
    featured: true,
    image: '/projects/api-tool-preview.jpg',
    gallery: [
      '/projects/api-tool-testing.jpg',
      '/projects/api-tool-docs.jpg',
      '/projects/api-tool-monitoring.jpg'
    ],
    links: {
      demo: 'https://api-tool.maximusbeato.com',
      github: 'https://github.com/mbeato/api-testing-tool'
    },
    createdDate: '2023-09-05',
    updatedDate: '2023-10-15',
    metrics: {
      views: 1123,
      stars: 89,
      forks: 23
    }
  },
  {
    id: 'design-system',
    title: 'Component Design System',
    description: 'Comprehensive design system with reusable React components and design tokens.',
    longDescription: `A complete design system built for scalable application development, 
    featuring a comprehensive component library, design tokens, documentation site, and 
    development tools. Includes accessibility guidelines, theming system, and integration 
    with popular design tools.`,
    technologies: ['React', 'Storybook', 'Styled Components', 'TypeScript', 'Figma', 'Jest'],
    category: 'design',
    status: 'in-progress',
    featured: false,
    image: '/projects/design-system-preview.jpg',
    gallery: [
      '/projects/design-system-components.jpg',
      '/projects/design-system-tokens.jpg',
      '/projects/design-system-docs.jpg'
    ],
    links: {
      demo: 'https://design.maximusbeato.com',
      github: 'https://github.com/mbeato/design-system',
      figma: 'https://figma.com/@maximusbeato/design-system'
    },
    createdDate: '2024-02-01',
    updatedDate: '2024-03-10',
    metrics: {
      views: 445,
      stars: 28,
      forks: 5
    }
  },
  {
    id: 'ml-data-viz',
    title: 'Machine Learning Data Visualizer',
    description: 'Interactive data visualization tool for machine learning model analysis and insights.',
    longDescription: `An advanced data visualization platform specifically designed for machine 
    learning workflows. Features interactive charts, model performance analytics, data exploration 
    tools, and collaboration features for data science teams. Built with performance optimization 
    for large datasets.`,
    technologies: ['Python', 'React', 'D3.js', 'FastAPI', 'Pandas', 'TensorFlow'],
    category: 'experiment',
    status: 'concept',
    featured: false,
    image: '/projects/ml-viz-preview.jpg',
    gallery: [
      '/projects/ml-viz-dashboard.jpg',
      '/projects/ml-viz-charts.jpg',
      '/projects/ml-viz-analysis.jpg'
    ],
    links: {
      github: 'https://github.com/mbeato/ml-data-viz'
    },
    createdDate: '2024-03-20',
    updatedDate: '2024-03-20',
    metrics: {
      views: 89,
      stars: 12
    }
  }
]

// Utility functions for project management
export const getFeaturedProjects = (): Project[] => {
  return PROJECTS.filter(project => project.featured)
}

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return PROJECTS
  return PROJECTS.filter(project => project.category === category)
}

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return PROJECTS.filter(project => project.status === status)
}

export const searchProjects = (query: string): Project[] => {
  const lowercaseQuery = query.toLowerCase()
  return PROJECTS.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(lowercaseQuery)
    )
  )
}

export const getProjectById = (id: string): Project | undefined => {
  return PROJECTS.find(project => project.id === id)
}

export const getProjectStats = () => {
  const totalProjects = PROJECTS.length
  const completedProjects = PROJECTS.filter(p => p.status === 'completed').length
  const inProgressProjects = PROJECTS.filter(p => p.status === 'in-progress').length
  const totalViews = PROJECTS.reduce((sum, p) => sum + (p.metrics?.views || 0), 0)
  const totalStars = PROJECTS.reduce((sum, p) => sum + (p.metrics?.stars || 0), 0)
  
  return {
    total: totalProjects,
    completed: completedProjects,
    inProgress: inProgressProjects,
    concepts: PROJECTS.filter(p => p.status === 'concept').length,
    totalViews,
    totalStars,
    totalForks: PROJECTS.reduce((sum, p) => sum + (p.metrics?.forks || 0), 0)
  }
}

// GitHub integration utilities (placeholder for future implementation)
export const fetchGitHubStats = async (username: string) => {
  // This would fetch real GitHub data in a production environment
  return {
    repos: 42,
    stars: 156,
    followers: 89,
    contributions: 1247
  }
}

export const syncProjectWithGitHub = async (project: Project) => {
  // This would sync project data with GitHub repository stats
  // For now, return mock data
  return {
    ...project,
    metrics: {
      ...project.metrics,
      lastUpdated: new Date().toISOString()
    }
  }
}