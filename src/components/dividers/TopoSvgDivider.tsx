'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { drawPath, transitions } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'
import { DIVIDER_PATHS } from '@/lib/topo-paths'

export { DIVIDER_PATHS }

interface TopoSvgDividerProps {
  id: string
  paths: string[]
  width?: number
  height?: number
  className?: string
}

export default function TopoSvgDivider({
  id,
  paths,
  width = 1200,
  height = 60,
  className,
}: TopoSvgDividerProps) {
  const { ref, isIntersecting } = useScrollAnimation({ threshold: 0.3 })

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      aria-hidden="true"
    >
      <svg
        id={id}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        fill="none"
        className="block"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="var(--color-contour-black)"
            strokeOpacity={0.15 + (i / paths.length) * 0.15}
            strokeWidth={0.5 + (i / paths.length) * 0.5}
            fill="none"
            variants={drawPath}
            initial="initial"
            animate={isIntersecting ? 'animate' : 'initial'}
            transition={{ ...transitions.draw, delay: i * 0.15 }}
          />
        ))}
      </svg>
    </div>
  )
}
