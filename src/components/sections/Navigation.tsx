'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import { NAVIGATION, SITE_CONFIG } from '@/lib/constants'
import { cn, generateElementId } from '@/lib/utils'
import { useScrollProgress } from '@/hooks/useScrollProgress'

interface NavigationProps {
  id: string
}

export default function Navigation({ id }: NavigationProps) {
  const { scrollY } = useScrollProgress()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isScrolled = scrollY > 50

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href.replace('#', '#portfolio-') + '-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      id={id}
      className={cn(
        'fixed top-1 left-0 right-0 z-40 transition-all duration-500 ease-out',
        isScrolled 
          ? 'bg-map-white/95 shadow-lg border-b border-stone-200'
          : 'bg-transparent'
      )}
    >
      <nav 
        id={generateElementId('navigation', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4"
      >
        <div 
          id={generateElementId('navigation', 'content', 'wrapper')}
          className="flex items-center justify-between h-16"
        >
          {/* Logo */}
          <motion.div
            id={generateElementId('navigation', 'logo', 'container')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              id={generateElementId('navigation', 'logo', 'button')}
              onClick={() => handleNavClick('#hero')}
              className="text-2xl font-bold text-stone-900 hover:text-coral-peak transition-colors"
            >
              {SITE_CONFIG.name.split(' ').map((word, index) => (
                <span key={index}>
                  {index === 0 ? word[0] : word[0]}
                </span>
              ))}
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div 
            id={generateElementId('navigation', 'desktop', 'menu')}
            className="hidden md:flex items-center space-x-4"
          >
            {NAVIGATION.map((item, index) => (
              <motion.button
                key={item.id}
                id={item.id}
                onClick={() => handleNavClick(item.href)}
                className="text-stone-500 hover:text-coral-peak font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* Resume Download Button */}
            <motion.button
              id={generateElementId('navigation', 'resume', 'download')}
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/resume.pdf'
                link.download = 'Maximus_Beato_Resume.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-stone-100 text-stone-900 font-medium transition-colors"
              style={{ boxShadow: 'var(--shadow-border-dark)', borderRadius: 'var(--radius-standard)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Download className="w-4 h-4" />
              resume
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div 
            id={generateElementId('navigation', 'mobile', 'controls')}
            className="flex items-center md:hidden"
          >
            <motion.button
              id={generateElementId('navigation', 'mobile', 'menu-button')}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-500 hover:text-coral-peak"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id={generateElementId('navigation', 'mobile', 'menu')}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-map-white border-t border-stone-200"
            >
              <div 
                id={generateElementId('navigation', 'mobile', 'menu-content')}
                className="px-4 py-6 space-y-4"
              >
                {NAVIGATION.map((item, index) => (
                  <motion.button
                    key={`mobile-${item.id}`}
                    id={`mobile-${item.id}`}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-stone-500 hover:text-coral-peak font-medium py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                {/* Mobile Resume Download Button */}
                <motion.button
                  id={generateElementId('navigation', 'mobile', 'resume-download')}
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = '/resume.pdf'
                    link.download = 'Maximus_Beato_Resume.pdf'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-transparent hover:bg-stone-100 text-stone-900 font-medium transition-colors mt-4"
                  style={{ boxShadow: 'var(--shadow-border-dark)', borderRadius: 'var(--radius-standard)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAVIGATION.length * 0.1 }}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  resume
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}