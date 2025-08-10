// GitHub API integration for fetching repository data
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string | null
  languages_url: string
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  archived: boolean
  disabled: boolean
  visibility: 'public' | 'private'
  default_branch: string
}

export interface GitHubLanguages {
  [key: string]: number
}

export interface ProjectData {
  id: string
  title: string
  description: string
  technologies: string[]
  category: string
  status: 'completed' | 'in-progress' | 'planning'
  featured: boolean
  links: {
    github: string
    demo?: string
  }
  metrics: {
    stars: number
    forks: number
    views: number
  }
  createdDate: string
  updatedDate: string
}

// Your GitHub username - update this
const GITHUB_USERNAME = 'mbeato'
const GITHUB_API_BASE = 'https://api.github.com'

// Cache for API responses to avoid rate limiting
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Fetch all public repositories
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const cacheKey = `repos-${GITHUB_USERNAME}`
  const cachedRepos = getCachedData<GitHubRepo[]>(cacheKey)
  
  if (cachedRepos) {
    return cachedRepos
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add token if you have one to increase rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const repos: GitHubRepo[] = await response.json()
    
    // Filter out forks and archived repos, keep only meaningful projects
    const filteredRepos = repos.filter(repo => 
      !repo.archived &&
      !repo.disabled &&
      repo.visibility === 'public' &&
      repo.name !== GITHUB_USERNAME && // Not profile repo
      !repo.name.toLowerCase().includes('config') &&
      !repo.name.toLowerCase().includes('dotfiles') &&
      !repo.name.toLowerCase().includes('.github')
    )

    setCachedData(cacheKey, filteredRepos)
    return filteredRepos

  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error)
    return []
  }
}

// Fetch languages for a specific repository
export async function fetchRepoLanguages(repoName: string): Promise<string[]> {
  const cacheKey = `languages-${GITHUB_USERNAME}-${repoName}`
  const cachedLanguages = getCachedData<string[]>(cacheKey)
  
  if (cachedLanguages) {
    return cachedLanguages
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    )

    if (!response.ok) {
      return []
    }

    const languages: GitHubLanguages = await response.json()
    
    // Sort languages by bytes of code and return top 5
    const sortedLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang)

    setCachedData(cacheKey, sortedLanguages)
    return sortedLanguages

  } catch (error) {
    console.error(`Failed to fetch languages for ${repoName}:`, error)
    return []
  }
}

// Convert GitHub repo to project data
export async function convertRepoToProject(repo: GitHubRepo): Promise<ProjectData> {
  const languages = await fetchRepoLanguages(repo.name)
  
  // Determine category based on languages and topics
  let category = 'fullstack'
  if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
    if (languages.includes('Python') || languages.includes('Java')) {
      category = 'fullstack'
    } else {
      category = 'frontend'
    }
  } else if (languages.includes('Python') || languages.includes('Java') || languages.includes('Go')) {
    category = 'backend'
  } else if (repo.topics.some(topic => 
    ['mobile', 'ios', 'android', 'react-native', 'flutter'].includes(topic.toLowerCase())
  )) {
    category = 'mobile'
  }

  // Determine status based on recent activity
  const lastPush = new Date(repo.pushed_at)
  const monthsAgo = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24 * 30)
  const status: ProjectData['status'] = monthsAgo < 3 ? 'in-progress' : 'completed'

  // Featured projects (high stars or recent activity)
  const featured = repo.stargazers_count >= 5 || monthsAgo < 1

  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: formatRepoName(repo.name),
    description: repo.description || `A ${repo.language || 'project'} repository`,
    technologies: languages.length > 0 ? languages : [repo.language || 'Code'].filter(Boolean),
    category,
    status,
    featured,
    links: {
      github: repo.html_url,
      demo: repo.homepage || undefined
    },
    metrics: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      views: repo.watchers_count * 10 // Approximate views
    },
    createdDate: repo.created_at,
    updatedDate: repo.updated_at
  }
}

// Format repository name for display
function formatRepoName(name: string): string {
  return name
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Fetch all projects from GitHub
export async function fetchGitHubProjects(): Promise<ProjectData[]> {
  const repos = await fetchGitHubRepos()
  
  const projects = await Promise.all(
    repos.map(repo => convertRepoToProject(repo))
  )

  // Sort by featured first, then by stars, then by update date
  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.metrics.stars !== b.metrics.stars) return b.metrics.stars - a.metrics.stars
    return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
  })
}

// Get project statistics
export function getGitHubProjectStats(projects: ProjectData[]) {
  return {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    featured: projects.filter(p => p.featured).length,
    totalStars: projects.reduce((sum, p) => sum + p.metrics.stars, 0),
    totalForks: projects.reduce((sum, p) => sum + p.metrics.forks, 0),
    totalViews: projects.reduce((sum, p) => sum + p.metrics.views, 0),
    technologies: Array.from(new Set(projects.flatMap(p => p.technologies))).length,
    categories: Array.from(new Set(projects.map(p => p.category))).length
  }
}