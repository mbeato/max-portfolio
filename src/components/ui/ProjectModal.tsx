'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Calendar, Eye, Star, GitFork, Figma } from 'lucide-react'
import Button from './Button'
import { Card } from './Card'
import { generateElementId } from '@/lib/utils'
import type { Project } from '@/lib/types'

interface ProjectModalProps {
  id: string
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ id, project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getLinkIcon = (linkType: string) => {
    switch (linkType) {
      case 'demo': return ExternalLink
      case 'github': return Github
      case 'figma': return Figma
      default: return ExternalLink
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card
              id={generateElementId('project', 'modal', 'content')}
              variant="elevated"
              padding="none"
              className="relative bg-white dark:bg-gray-900"
            >
              {/* Close button */}
              <button
                id={generateElementId('project', 'modal', 'close-button')}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Project image/header */}
              <div 
                id={generateElementId('project', 'modal', 'header')}
                className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden rounded-t-xl"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl opacity-20">💻</div>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </div>
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-16">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div 
                id={generateElementId('project', 'modal', 'body')}
                className="p-8"
              >
                {/* Title and basic info */}
                <div 
                  id={generateElementId('project', 'modal', 'title-section')}
                  className="mb-6"
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  
                  {/* Metrics */}
                  {project.metrics && (
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      {project.metrics.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.metrics.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {project.metrics.stars && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{project.metrics.stars} stars</span>
                        </div>
                      )}
                      {project.metrics.forks && (
                        <div className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          <span>{project.metrics.forks} forks</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div 
                  id={generateElementId('project', 'modal', 'technologies')}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={`${project.id}-tech-${tech}`}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Long description */}
                <div 
                  id={generateElementId('project', 'modal', 'description')}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Project Details
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {project.longDescription}
                    </p>
                  </div>
                </div>

                {/* Project dates */}
                <div 
                  id={generateElementId('project', 'modal', 'dates')}
                  className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Created: {formatDate(project.createdDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Updated: {formatDate(project.updatedDate)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div 
                  id={generateElementId('project', 'modal', 'actions')}
                  className="flex flex-wrap gap-4"
                >
                  {Object.entries(project.links).map(([linkType, url]) => {
                    if (!url) return null
                    
                    const IconComponent = getLinkIcon(linkType)
                    return (
                      <Button
                        key={`${project.id}-link-${linkType}`}
                        id={generateElementId('project', 'modal', `${linkType}-button`)}
                        variant={linkType === 'demo' ? 'primary' : 'outline'}
                        size="md"
                        leftIcon={<IconComponent className="w-4 h-4" />}
                        onClick={() => window.open(url, '_blank')}
                        asMotion
                        motionProps={{
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 }
                        }}
                      >
                        {linkType === 'demo' ? 'View Demo' : 
                         linkType === 'github' ? 'Source Code' :
                         linkType === 'figma' ? 'Design Files' :
                         linkType === 'article' ? 'Read Article' : 
                         'View'}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}