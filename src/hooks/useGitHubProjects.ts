import { useState, useEffect } from 'react'
import { fetchGitHubProjects, getGitHubProjectStats, type ProjectData } from '@/lib/github'

export interface UseGitHubProjectsResult {
  projects: ProjectData[]
  loading: boolean
  error: string | null
  stats: ReturnType<typeof getGitHubProjectStats> | null
  refetch: () => Promise<void>
}

export function useGitHubProjects(): UseGitHubProjectsResult {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ReturnType<typeof getGitHubProjectStats> | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const fetchedProjects = await fetchGitHubProjects()
      setProjects(fetchedProjects)
      setStats(getGitHubProjectStats(fetchedProjects))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub projects'
      setError(errorMessage)
      console.error('Error fetching GitHub projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    stats,
    refetch: fetchProjects
  }
}