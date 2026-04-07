'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Eye, 
  Move3D, 
  Type, 
  Keyboard, 
  Volume2, 
  RotateCcw,
  X,
  Accessibility
} from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'
import { generateElementId } from '@/lib/utils'

interface AccessibilityMenuProps {
  id: string
}

export default function AccessibilityMenu({ id }: AccessibilityMenuProps) {
  void id; // id is required by interface for accessibility element targeting
  const [isOpen, setIsOpen] = useState(false)
  const {
    highContrast,
    reducedMotion,
    largeText,
    keyboardNavigation,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    enableKeyboardNavigation,
    announceToScreenReader,
    resetSettings
  } = useAccessibility()

  const handleToggleMenu = () => {
    const newState = !isOpen
    setIsOpen(newState)
    announceToScreenReader(`Accessibility menu ${newState ? 'opened' : 'closed'}`)
  }

  const accessibilityOptions = [
    {
      id: 'high-contrast',
      label: 'High Contrast',
      description: 'Increases contrast for better visibility',
      icon: Eye,
      enabled: highContrast,
      toggle: toggleHighContrast
    },
    {
      id: 'reduced-motion',
      label: 'Reduce Motion',
      description: 'Minimizes animations and transitions',
      icon: Move3D,
      enabled: reducedMotion,
      toggle: toggleReducedMotion
    },
    {
      id: 'large-text',
      label: 'Large Text',
      description: 'Increases text size for better readability',
      icon: Type,
      enabled: largeText,
      toggle: toggleLargeText
    },
    {
      id: 'keyboard-nav',
      label: 'Keyboard Navigation',
      description: 'Enhanced keyboard navigation support',
      icon: Keyboard,
      enabled: keyboardNavigation,
      toggle: enableKeyboardNavigation,
      readOnly: true
    }
  ]

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.button
        id={generateElementId('accessibility', 'menu', 'trigger')}
        onClick={handleToggleMenu}
        className="fixed bottom-4 left-4 z-50 p-3 bg-stone-900 hover:bg-stone-700 text-map-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-coral-peak focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${isOpen ? 'Close' : 'Open'} accessibility menu`}
        aria-expanded={isOpen}
        aria-controls={generateElementId('accessibility', 'menu', 'panel')}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Accessibility className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Accessibility Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={generateElementId('accessibility', 'menu', 'backdrop')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              id={generateElementId('accessibility', 'menu', 'panel')}
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute left-4 bottom-20 w-80 bg-map-white rounded-lg overflow-hidden"
              style={{ boxShadow: 'var(--shadow-lifted)' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby={generateElementId('accessibility', 'menu', 'title')}
              aria-describedby={generateElementId('accessibility', 'menu', 'description')}
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-stone-100 rounded-lg">
                    <Settings className="w-5 h-5 text-stone-700" />
                  </div>
                  <h2
                    id={generateElementId('accessibility', 'menu', 'title')}
                    className="text-lg font-semibold text-stone-900"
                  >
                    Accessibility Settings
                  </h2>
                </div>
                <p
                  id={generateElementId('accessibility', 'menu', 'description')}
                  className="text-sm text-stone-500"
                >
                  Customize your viewing experience for better accessibility
                </p>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {accessibilityOptions.map((option, index) => {
                  const IconComponent = option.icon
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          option.enabled
                            ? 'bg-success/10 text-success'
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900">
                            {option.label}
                          </h3>
                          <p className="text-xs text-stone-500">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={option.toggle}
                        disabled={option.readOnly && option.enabled}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-coral-peak focus:ring-offset-2 ${
                          option.enabled
                            ? 'bg-coral-peak'
                            : 'bg-stone-300'
                        } ${
                          option.readOnly && option.enabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Toggle ${option.label}`}
                        aria-checked={option.enabled}
                        role="switch"
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{
                            x: option.enabled ? 24 : 0
                          }}
                          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        />
                      </motion.button>
                    </motion.div>
                  )
                })}

                {/* Screen Reader Status */}
                {screenReaderMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
                  >
                    <div className="p-2 bg-stone-100 rounded-lg">
                      <Volume2 className="w-4 h-4 text-stone-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900">
                        Screen Reader Detected
                      </h3>
                      <p className="text-xs text-stone-500">
                        Enhanced screen reader support is active
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-200">
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 w-full p-2 text-sm text-stone-500 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}