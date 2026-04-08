'use client'

import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import { contours } from 'd3-contour'
import { geoPath } from 'd3-geo'
import { usePerformance } from '@/components/ui/PerformanceProvider'

// Desktop grid: 120x80, 15 thresholds
// Mobile grid: 60x40, 8 thresholds
const DESKTOP_COLS = 120
const DESKTOP_ROWS = 80
const DESKTOP_THRESHOLD_COUNT = 15
const MOBILE_COLS = 60
const MOBILE_ROWS = 40
const MOBILE_THRESHOLD_COUNT = 8

const WARP_RADIUS = 200
const WARP_STRENGTH = 0.15
const CORAL_COLOR = { r: 232, g: 82, b: 63 } // #E8523F
const CONTOUR_COLOR = { r: 26, g: 26, b: 26 } // #1A1A1A
const CORAL_MAX_BLEND = 0.7

// Non-linear threshold distribution to create non-uniform density (TOPO-02)
function buildThresholds(count: number): number[] {
  const thresholds: number[] = []
  for (let i = 0; i < count; i++) {
    // Use a curve to cluster thresholds slightly toward center
    const t = i / (count - 1)
    const curved = Math.sign(t - 0.5) * Math.pow(Math.abs(t - 0.5) * 2, 0.75) * 0.5 + 0.5
    thresholds.push(-0.8 + curved * 1.6)
  }
  return thresholds
}

export function useTopoAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: { isMobile: boolean }
): void {
  const { prefersReducedMotion } = usePerformance()

  // Use refs for mutable values that should not trigger re-renders
  const prefersReducedMotionRef = useRef(prefersReducedMotion)
  const isMobileRef = useRef(options.isMobile)

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion
  }, [prefersReducedMotion])

  useEffect(() => {
    isMobileRef.current = options.isMobile
  }, [options.isMobile])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const noise3D = createNoise3D()
    const isMobile = isMobileRef.current
    const isReducedMotion = prefersReducedMotionRef.current

    const COLS = isMobile ? MOBILE_COLS : DESKTOP_COLS
    const ROWS = isMobile ? MOBILE_ROWS : DESKTOP_ROWS
    const THRESHOLD_COUNT = isMobile ? MOBILE_THRESHOLD_COUNT : DESKTOP_THRESHOLD_COUNT

    // Pre-allocate values grid — reuse across frames (no per-frame allocation)
    const values = new Float32Array(COLS * ROWS)
    const thresholds = buildThresholds(THRESHOLD_COUNT)

    // Canvas dimensions in CSS pixels
    let canvasWidth = 0
    let canvasHeight = 0

    // Mouse position in CSS pixels (desktop only)
    let mouseX = -9999
    let mouseY = -9999

    // Animation time counter — increments per frame for ambient drift
    let t = 0
    let rafId = 0

    // Apply DPI-aware sizing to canvas
    function resizeCanvas(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas!.parentElement?.clientWidth || window.innerWidth
      const h = canvas!.parentElement?.clientHeight || window.innerHeight

      canvasWidth = w
      canvasHeight = h

      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`

      // Scale context once after resize — not per frame
      ctx!.scale(dpr, dpr)
    }

    // Build the noise field values grid for the current frame
    function buildValues(): void {
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const nx = i / COLS
          const ny = j / ROWS

          // Pixel position for mouse distance calculation
          const px = nx * canvasWidth
          const py = ny * canvasHeight

          let warpOffset = 0

          if (!isMobile) {
            // Mouse warp: smooth falloff within WARP_RADIUS
            const dx = px - mouseX
            const dy = py - mouseY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const warp = Math.max(0, 1 - dist / WARP_RADIUS) * WARP_STRENGTH
            warpOffset = warp
          }

          values[j * COLS + i] = noise3D(
            nx * 3 + warpOffset,
            ny * 3 + warpOffset,
            t * 0.15
          )
        }
      }
    }

    // Draw the contour lines for the current frame
    function drawContours(): void {
      const contourGen = contours().size([COLS, ROWS]).thresholds(thresholds)
      const polygons = contourGen(values as unknown as number[])

      // Scale transform: map from grid coords to canvas CSS pixels
      const scaleX = canvasWidth / COLS
      const scaleY = canvasHeight / ROWS

      for (let idx = 0; idx < polygons.length; idx++) {
        const polygon = polygons[idx]
        const elevation = idx / Math.max(polygons.length - 1, 1)

        // Opacity and line weight per DESIGN.md section 6
        const opacity = 0.15 + elevation * 0.45
        const lineWidth = (0.5 + elevation * 1.0) / scaleX // compensate for scale

        // Approximate centroid: average first ring coordinates for coral blend
        // MultiPolygon coordinates: Position[][][] — [polygon][ring][point]
        let coralBlend = 0
        if (!isMobile && polygon.coordinates.length > 0) {
          const outerRing = polygon.coordinates[0]?.[0] // first polygon's outer ring (Position[])
          if (outerRing && outerRing.length > 0) {
            let cx = 0
            let cy = 0
            for (const pt of outerRing) {
              cx += (pt as number[])[0]
              cy += (pt as number[])[1]
            }
            cx = (cx / outerRing.length) * scaleX
            cy = (cy / outerRing.length) * scaleY
            const dx = cx - mouseX
            const dy = cy - mouseY
            const centroidDist = Math.sqrt(dx * dx + dy * dy)
            coralBlend = Math.max(0, 1 - centroidDist / WARP_RADIUS) * CORAL_MAX_BLEND
          }
        }

        // Blend stroke color from contour black to coral
        const r = Math.round(CONTOUR_COLOR.r + (CORAL_COLOR.r - CONTOUR_COLOR.r) * coralBlend)
        const g = Math.round(CONTOUR_COLOR.g + (CORAL_COLOR.g - CONTOUR_COLOR.g) * coralBlend)
        const b = Math.round(CONTOUR_COLOR.b + (CORAL_COLOR.b - CONTOUR_COLOR.b) * coralBlend)

        ctx!.save()
        ctx!.scale(scaleX, scaleY)
        ctx!.beginPath()
        geoPath(null, ctx!)(polygon)
        ctx!.restore()

        ctx!.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        ctx!.lineWidth = lineWidth * scaleX // re-apply scale for final stroke
        ctx!.stroke()
      }
    }

    // Main render loop
    function tick(): void {
      ctx!.clearRect(0, 0, canvasWidth, canvasHeight)
      buildValues()
      drawContours()
      t += 0.005
      rafId = requestAnimationFrame(tick)
    }

    // Mouse tracking — desktop only, stored in mutable vars (no state, no re-renders)
    function handleMouseMove(e: MouseEvent): void {
      const rect = canvas!.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    // Initial resize and start
    resizeCanvas()

    if (isReducedMotion) {
      // Render exactly one static frame — topographic aesthetic preserved, no motion
      buildValues()
      drawContours()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    // ResizeObserver on documentElement to detect viewport changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
      if (isReducedMotion) {
        ctx!.clearRect(0, 0, canvasWidth, canvasHeight)
        buildValues()
        drawContours()
      }
    })
    resizeObserver.observe(document.documentElement)

    // Mouse listener — desktop only
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty — all mutable state held in refs, not React state
}
