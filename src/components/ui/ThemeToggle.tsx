'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  id: string
  className?: string
  showLabel?: boolean
  variant?: 'button' | 'menu'
}

export default function ThemeToggle({ 
  id, 
  className,
  showLabel = false,
  variant = 'button'
}: ThemeToggleProps) {
  const { theme, resolvedTheme, mounted, cycleTheme } = useTheme()

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        id={`${id}-placeholder`}
        className={cn(
          'w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse',
          className
        )}
      />
    )
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />
      case 'dark':
        return <Moon className="w-5 h-5" />
      case 'system':
        return <Monitor className="w-5 h-5" />
      default:
        return <Sun className="w-5 h-5" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return 'System theme'
      default:
        return 'Theme'
    }
  }

  if (variant === 'menu') {
    return (
      <motion.button
        id={id}
        onClick={cycleTheme}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Switch to next theme (currently ${getLabel()})`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
        {showLabel && (
          <span className="text-sm font-medium">{getLabel()}</span>
        )}
      </motion.button>
    )
  }

  return (
    <motion.button
      id={id}
      onClick={cycleTheme}
      className={cn(
        'relative inline-flex items-center justify-center w-10 h-10 rounded-lg',
        'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
        'border border-gray-200 dark:border-gray-700',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to next theme (currently ${getLabel()})`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {getIcon()}
      </motion.div>
      
      {/* Subtle background indicator for current resolved theme */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-lg opacity-20',
          resolvedTheme === 'light' ? 'bg-yellow-400' : 'bg-blue-600'
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      />
    </motion.button>
  )
}