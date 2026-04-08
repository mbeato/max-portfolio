'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { drawPath, transitions } from '@/lib/motion'
import { useScrollAnimation } from '@/hooks/useIntersectionObserver'

interface TopoSvgDividerProps {
  id: string
  paths: string[]
  width?: number
  height?: number
  className?: string
}

// Hand-crafted contour-like path sets — organic curves, not regular sine waves
export const DIVIDER_PATHS = {
  heroToAbout: [
    'M 0 25 C 80 18, 160 34, 280 24 C 400 14, 520 32, 640 22 C 760 12, 880 30, 1000 20 C 1060 15, 1130 26, 1200 18',
    'M 0 38 C 90 28, 200 46, 340 34 C 480 22, 580 42, 720 30 C 840 18, 960 40, 1080 28 C 1140 22, 1170 34, 1200 28',
    'M 0 50 C 120 40, 240 58, 380 46 C 520 34, 620 56, 760 44 C 880 32, 1000 52, 1100 40 C 1150 34, 1175 46, 1200 40',
  ],
  aboutToExperience: [
    'M 0 20 C 110 30, 240 12, 380 26 C 520 40, 640 18, 780 32 C 900 46, 1020 22, 1140 36 C 1170 40, 1190 30, 1200 34',
    'M 0 36 C 100 48, 220 26, 360 40 C 500 54, 620 30, 760 46 C 880 62, 1000 36, 1120 50 C 1165 56, 1185 44, 1200 50',
  ],
  experienceToProjects: [
    'M 0 22 C 100 34, 220 14, 360 28 C 480 42, 580 18, 720 34 C 840 50, 960 26, 1080 38 C 1140 44, 1170 32, 1200 36',
    'M 0 36 C 140 22, 280 46, 420 30 C 560 14, 680 42, 820 26 C 940 10, 1040 38, 1160 24 C 1180 20, 1192 28, 1200 24',
    'M 0 50 C 120 38, 260 62, 400 46 C 540 30, 660 58, 800 42 C 920 26, 1040 54, 1160 38 C 1180 34, 1192 44, 1200 40',
  ],
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
