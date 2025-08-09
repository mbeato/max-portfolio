'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  keyboardNavigation: boolean
  screenReaderMode: boolean
  focusVisible: boolean
}

interface AccessibilityContextType extends AccessibilitySettings {
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleLargeText: () => void
  enableKeyboardNavigation: () => void
  announceToScreenReader: (message: string) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  keyboardNavigation: false,
  screenReaderMode: false,
  focusVisible: true
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  ...defaultSettings,
  toggleHighContrast: () => {},
  toggleReducedMotion: () => {},
  toggleLargeText: () => {},
  enableKeyboardNavigation: () => {},
  announceToScreenReader: () => {},
  resetSettings: () => {}
})

export const useAccessibility = () => useContext(AccessibilityContext)

interface AccessibilityProviderProps {
  children: ReactNode
}

export default function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [announcementElement, setAnnouncementElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error)
      }
    }

    // Detect system preferences
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }))
    }

    setSettings(prev => ({ ...prev, reducedMotion: mediaQueryList.matches }))
    mediaQueryList.addEventListener('change', updateMotionPreference)

    // Detect high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const updateContrastPreference = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }))
    }

    setSettings(prev => ({ ...prev, highContrast: highContrastQuery.matches }))
    highContrastQuery.addEventListener('change', updateContrastPreference)

    // Create screen reader announcement element
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
    `
    document.body.appendChild(announcement)
    setAnnouncementElement(announcement)

    // Keyboard navigation detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardNavigation: true }))
        document.documentElement.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      document.documentElement.classList.remove('keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    // Screen reader detection (basic)
    const detectScreenReader = () => {
      const isScreenReader = !!(
        window.navigator.userAgent.match(/NVDA|JAWS|VoiceOver|WindowEyes|Dragon|ZoomText|MagicTorch/) ||
        window.speechSynthesis ||
        document.querySelector('[aria-hidden="false"]')
      )
      
      if (isScreenReader) {
        setSettings(prev => ({ ...prev, screenReaderMode: true }))
      }
    }

    detectScreenReader()

    return () => {
      mediaQueryList.removeEventListener('change', updateMotionPreference)
      highContrastQuery.removeEventListener('change', updateContrastPreference)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement)
      }
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))

    // Apply settings to document
    const root = document.documentElement

    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    if (settings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    if (settings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }

    // Add CSS for accessibility enhancements
    const styleId = 'accessibility-styles'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      /* High Contrast Mode */
      .high-contrast {
        --tw-bg-opacity: 1 !important;
        --tw-text-opacity: 1 !important;
      }
      
      .high-contrast * {
        color: #000000 !important;
        background-color: #ffffff !important;
        border-color: #000000 !important;
      }
      
      .high-contrast [data-theme="dark"] * {
        color: #ffffff !important;
        background-color: #000000 !important;
      }

      /* Reduced Motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Large Text */
      .large-text {
        font-size: 120% !important;
      }
      
      .large-text h1 { font-size: 2.5rem !important; }
      .large-text h2 { font-size: 2rem !important; }
      .large-text h3 { font-size: 1.5rem !important; }
      .large-text p, .large-text span, .large-text div { font-size: 1.25rem !important; }

      /* Focus Visible Enhancement */
      .focus-visible *:focus-visible {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }

      /* Keyboard Navigation */
      .keyboard-navigation *:focus {
        outline: 2px solid #0066cc !important;
        outline-offset: 1px !important;
      }
    `
  }, [settings])

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))
    announceToScreenReader(`High contrast ${settings.highContrast ? 'disabled' : 'enabled'}`)
  }

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))
    announceToScreenReader(`Reduced motion ${settings.reducedMotion ? 'disabled' : 'enabled'}`)
  }

  const toggleLargeText = () => {
    setSettings(prev => ({ ...prev, largeText: !prev.largeText }))
    announceToScreenReader(`Large text ${settings.largeText ? 'disabled' : 'enabled'}`)
  }

  const enableKeyboardNavigation = () => {
    if (!settings.keyboardNavigation) {
      setSettings(prev => ({ ...prev, keyboardNavigation: true }))
      announceToScreenReader('Keyboard navigation enabled')
    }
  }

  const announceToScreenReader = (message: string) => {
    if (announcementElement) {
      // Clear previous message
      announcementElement.textContent = ''
      
      // Add new message with a slight delay to ensure it's announced
      setTimeout(() => {
        if (announcementElement) {
          announcementElement.textContent = message
        }
      }, 100)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    announceToScreenReader('Accessibility settings reset to defaults')
  }

  const contextValue: AccessibilityContextType = {
    ...settings,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    enableKeyboardNavigation,
    announceToScreenReader,
    resetSettings
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}