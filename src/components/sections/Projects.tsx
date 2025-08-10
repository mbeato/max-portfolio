'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Calendar, Search, Filter, Eye, Star, GitFork, RefreshCw, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useGitHubProjects } from '@/hooks/useGitHubProjects'
import { fadeInUp, staggerContainer, generateElementId } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import type { ProjectData } from '@/lib/github'

interface ProjectsProps {
  id: string
}

export default function Projects({ id }: ProjectsProps) {
  const { ref, isIntersecting } = useScrollAnimation()
  const { projects, loading, error, stats, refetch } = useGitHubProjects()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(project => project.category === activeFilter)
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }, [projects, activeFilter, searchQuery])

  // Available categories from GitHub projects
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(projects.map(p => p.category)))
    return [
      { id: 'all', label: 'All Projects' },
      ...categories.map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    ]
  }, [projects])

  return (
    <section 
      ref={ref}
      id={id}
      className="py-24 bg-gray-50 dark:bg-gray-900"
    >
      <div 
        id={generateElementId('projects', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isIntersecting ? "animate" : "initial"}
        >
          {/* Section Header */}
          <motion.div
            id={generateElementId('projects', 'header', 'section')}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              A collection of projects showcasing my skills in full-stack development, 
              UI/UX design, and modern web technologies
            </p>
            
            {/* GitHub Integration Status & Stats */}
            {loading ? (
              <div className="flex items-center justify-center gap-3 mb-8">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">Loading projects from GitHub...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to load GitHub projects</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Retry
                </Button>
              </div>
            ) : stats ? (
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Repositories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalStars}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    GitHub Stars
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalForks}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Forks
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.technologies}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Technologies
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            id={generateElementId('projects', 'controls', 'section')}
            variants={fadeInUp}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Filter className="w-4 h-4" />
                <span>
                  Showing {filteredProjects.length} of {stats?.total || 0} projects
                </span>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Filter Buttons from GitHub */}
          {!loading && !error && (
            <motion.div
              id={generateElementId('projects', 'filters', 'container')}
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {availableCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  id={generateElementId('projects', 'filter', category.id)}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeFilter === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Projects Grid */}
          <motion.div
            id={generateElementId('projects', 'grid', 'container')}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                id={generateElementId('projects', 'card', project.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.1 }}
                layout
                layoutId={project.id}
              >
                <Card
                  id={generateElementId('projects', 'card', `${project.id}-wrapper`)}
                  variant="elevated"
                  padding="none"
                  className="h-full group hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => window.open(project.links.github, '_blank')}
                  asMotion
                  motionProps={{
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 }
                  }}
                >
                  {/* Project Image */}
                  <div 
                    id={generateElementId('projects', 'image', `${project.id}-container`)}
                    className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden"
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl opacity-20">💻</div>
                    </div>
                    
                    {/* Status and Featured badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : project.status === 'in-progress'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
                      }`}>
                        {project.status === 'in-progress' ? 'Active' : 'Completed'}
                      </div>
                      
                      {project.featured && (
                        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Project metrics overlay */}
                    {project.metrics && (
                      <div className="absolute bottom-3 right-3 flex gap-3 text-xs text-white bg-black/50 rounded px-2 py-1">
                        {project.metrics.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{project.metrics.views}</span>
                          </div>
                        )}
                        {project.metrics.stars && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{project.metrics.stars}</span>
                          </div>
                        )}
                        {project.metrics.forks && (
                          <div className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            <span>{project.metrics.forks}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div 
                    id={generateElementId('projects', 'content', `${project.id}-wrapper`)}
                    className="p-6"
                  >
                    {/* Project Header */}
                    <div 
                      id={generateElementId('projects', 'header', `${project.id}-wrapper`)}
                      className="mb-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Updated {new Date(project.updatedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div 
                      id={generateElementId('projects', 'technologies', `${project.id}-wrapper`)}
                      className="mb-6"
                    >
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={`${project.id}-${tech}`}
                            id={generateElementId('projects', 'tech', `${project.id}-${tech.toLowerCase().replace(/\s+/g, '-')}`)}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div 
                      id={generateElementId('projects', 'actions', `${project.id}-wrapper`)}
                      className="flex gap-3"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
                    >
                      {project.links.demo && (
                        <Button
                          id={generateElementId('projects', 'demo', `${project.id}-button`)}
                          size="sm"
                          leftIcon={<ExternalLink className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.links.demo, '_blank')
                          }}
                          className="flex-1"
                        >
                          Demo
                        </Button>
                      )}
                      
                      {project.links.github && (
                        <Button
                          id={generateElementId('projects', 'github', `${project.id}-button`)}
                          variant="outline"
                          size="sm"
                          leftIcon={<Github className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.links.github, '_blank')
                          }}
                          className="flex-1"
                        >
                          Code
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              id={generateElementId('projects', 'empty', 'state')}
              initial={{ opacity: 0, y: 20 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              className="text-center py-12"
            >
              <div className="text-6xl opacity-20 mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or browse all projects.
              </p>
              <Button
                id={generateElementId('projects', 'empty', 'reset-button')}
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilter('all')
                }}
              >
                Show All Projects
              </Button>
            </motion.div>
          )}

          {/* View All Projects CTA */}
          {filteredProjects.length > 0 && (
            <motion.div
              id={generateElementId('projects', 'cta', 'container')}
              variants={fadeInUp}
              className="text-center mt-12"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Interested in collaborating?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  I&apos;m always excited to work on new projects and explore innovative ideas. 
                  Check out more of my work on GitHub or get in touch to discuss opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    id={generateElementId('projects', 'cta', 'github-button')}
                    variant="primary"
                    size="lg"
                    leftIcon={<Github className="w-5 h-5" />}
                    onClick={() => window.open('https://github.com/mbeato', '_blank')}
                    asMotion
                    motionProps={{
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 }
                    }}
                  >
                    View All on GitHub
                  </Button>
                  
                  <Button
                    id={generateElementId('projects', 'cta', 'contact-button')}
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const contactSection = document.querySelector('#portfolio-contact-section')
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    asMotion
                    motionProps={{
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 }
                    }}
                  >
                    Get In Touch
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
    </section>
  )
}