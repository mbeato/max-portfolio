'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { NAVIGATION, SITE_CONFIG } from '@/lib/constants'
import { cn, generateElementId } from '@/lib/utils'
import { useScrollProgress } from '@/hooks/useScrollProgress'

interface NavigationProps {
  id: string
}

export default function Navigation({ id }: NavigationProps) {
  const { scrollDirection, scrollY } = useScrollProgress()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isScrolled = scrollY > 50
  const shouldHideNav = scrollDirection === 'down' && scrollY > 200 && !isMobileMenuOpen

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
    <motion.header
      id={id}
      initial={{ y: -100 }}
      animate={{ 
        y: shouldHideNav ? -100 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <nav 
        id={generateElementId('navigation', 'container', 'main')}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
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
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
            className="hidden md:flex items-center space-x-8"
          >
            {NAVIGATION.map((item, index) => (
              <motion.button
                key={item.id}
                id={item.id}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
            
            <ThemeToggle 
              id={generateElementId('navigation', 'theme', 'toggle')}
              className="ml-4"
            />
          </div>

          {/* Mobile Menu Button */}
          <div 
            id={generateElementId('navigation', 'mobile', 'controls')}
            className="flex items-center space-x-4 md:hidden"
          >
            <ThemeToggle 
              id={generateElementId('navigation', 'theme', 'toggle-mobile')}
            />
            <motion.button
              id={generateElementId('navigation', 'mobile', 'menu-button')}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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
              className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700"
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
                    className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}