'use client'

import { useEffect, useState } from 'react'
import { THEME_CONFIG } from '@/lib/constants'
import type { Theme } from '@/lib/types'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Get the actual theme being used (resolving 'system' to actual theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    setMounted(true)

    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey) as Theme
    if (savedTheme && THEME_CONFIG.themes.includes(savedTheme)) {
      setTheme(savedTheme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body

    // Remove all theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Add the resolved theme class
    root.classList.add(resolvedTheme)
    body.classList.add(resolvedTheme)

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      )
    }
  }, [resolvedTheme, mounted])

  const setThemeWithPersist = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_CONFIG.storageKey, newTheme)
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setThemeWithPersist('dark')
    } else if (theme === 'dark') {
      setThemeWithPersist('system')
    } else {
      setThemeWithPersist('light')
    }
  }

  // Cycle through themes: light -> dark -> system
  const cycleTheme = () => {
    const currentIndex = THEME_CONFIG.themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % THEME_CONFIG.themes.length
    setThemeWithPersist(THEME_CONFIG.themes[nextIndex])
  }

  return {
    theme,
    resolvedTheme,
    systemTheme,
    mounted,
    setTheme: setThemeWithPersist,
    toggleTheme,
    cycleTheme
  }
}

// Hook to check if user prefers reduced motion
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}