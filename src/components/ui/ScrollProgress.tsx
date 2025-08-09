'use client'

import { motion } from 'framer-motion'
import { useScrollProgress, useActiveSection } from '@/hooks/useScrollProgress'
import { generateElementId } from '@/lib/utils'

interface ScrollProgressProps {
  id: string
}

export default function ScrollProgress({ id }: ScrollProgressProps) {
  const { scrollProgress, scrollDirection, isScrolling } = useScrollProgress()
  const activeSection = useActiveSection([
    'portfolio-hero-section',
    'portfolio-about-section', 
    'portfolio-projects-section',
    'portfolio-contact-section'
  ])

  const getSectionLabel = (sectionId: string) => {
    switch (sectionId) {
      case 'portfolio-hero-section': return 'Home'
      case 'portfolio-about-section': return 'About'
      case 'portfolio-projects-section': return 'Projects'
      case 'portfolio-contact-section': return 'Contact'
      default: return ''
    }
  }

  return (
    <div id={id} className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Progress bar */}
      <motion.div
        id={generateElementId('scroll', 'progress', 'bar')}
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
        initial={{ scaleX: 0 }}
        style={{ 
          scaleX: scrollProgress / 100,
          transformOrigin: '0%'
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Scroll indicator with section info */}
      <motion.div
        id={generateElementId('scroll', 'indicator', 'section')}
        className="absolute top-4 right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isScrolling ? 1 : 0.3,
          x: scrollDirection === 'down' ? 0 : 10
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {Math.round(scrollProgress)}%
            </div>
            {activeSection && (
              <>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="text-gray-900 dark:text-white font-medium">
                  {getSectionLabel(activeSection)}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mini navigation dots */}
      <motion.div
        id={generateElementId('scroll', 'nav', 'dots')}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex flex-col gap-3">
          {[
            'portfolio-hero-section',
            'portfolio-about-section',
            'portfolio-projects-section', 
            'portfolio-contact-section'
          ].map((sectionId, _) => {
            const label = getSectionLabel(sectionId)
            const isActive = activeSection === sectionId
            
            return (
              <motion.button
                key={sectionId}
                id={generateElementId('scroll', 'nav', `dot-${label.toLowerCase()}`)}
                className={`group relative w-3 h-3 rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg scale-125' 
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400'
                }`}
                onClick={() => {
                  const element = document.querySelector(`#${sectionId}`)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                    {label}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 dark:border-l-gray-100 border-y-2 border-y-transparent" />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}