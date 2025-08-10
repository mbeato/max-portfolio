'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface Lazy3DComponentProps {
  componentName: 'FloatingShapes' | 'SkillBubbles' | 'EarthModel'
  fallback?: React.ReactNode
  id: string
  [key: string]: unknown
}

// Lazy load 3D components
const FloatingShapes = lazy(() => import('@/components/3d/FloatingShapes'))
const SkillBubbles = lazy(() => import('@/components/3d/SkillBubbles'))
const EarthModel = lazy(() => import('@/components/3d/EarthModel'))

// Loading placeholder component
function Loading3D({ id }: { id: string }) {
  return (
    <div 
      id={`${id}-loading`}
      className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading 3D component...</p>
      </div>
    </div>
  )
}

// Error boundary for 3D components
function ErrorFallback({ id }: { id: string }) {
  return (
    <div 
      id={`${id}-error`}
      className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 text-red-500 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">3D Component Unavailable</p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-1">Your device may not support WebGL</p>
        </div>
      </div>
    </div>
  )
}

export default function Lazy3DComponent({ 
  componentName, 
  fallback, 
  id, 
  ...props 
}: Lazy3DComponentProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px 0px' // Start loading when component is 100px away from viewport
  })

  const [hasWebGL, setHasWebGL] = useState(true)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      setHasWebGL(false)
    }
    
    // Cleanup
    return () => {
      if (gl && gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }
  }, [])

  // Load component when in view and WebGL is supported
  useEffect(() => {
    if (inView && hasWebGL) {
      setShouldLoad(true)
    }
  }, [inView, hasWebGL])

  // If no WebGL support, show error fallback
  if (!hasWebGL) {
    return <ErrorFallback id={id} />
  }

  const getComponent = () => {
    if (!shouldLoad) {
      return fallback || <Loading3D id={id} />
    }

    switch (componentName) {
      case 'FloatingShapes':
        return <FloatingShapes id={id} {...props} />
      case 'SkillBubbles':
        return <SkillBubbles id={id} {...props} />
      case 'EarthModel':
        return <EarthModel id={id} {...props} />
      default:
        return fallback || <Loading3D id={id} />
    }
  }

  return (
    <div ref={ref}>
      <Suspense fallback={fallback || <Loading3D id={id} />}>
        {getComponent()}
      </Suspense>
    </div>
  )
}