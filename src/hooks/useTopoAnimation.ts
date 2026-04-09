'use client'

import { useEffect, useRef } from 'react'
import { contours } from 'd3-contour'
import { geoPath } from 'd3-geo'
import { usePerformance } from '@/components/ui/PerformanceProvider'

// Tier configs — wave simulation grid sizes
const TIER = {
  high:   { cols: 200, rows: 120, thresholds: 5, particles: 140 },
  medium: { cols: 150, rows: 90,  thresholds: 4, particles: 100 },
  low:    { cols: 100, rows: 60,  thresholds: 3, particles: 55 },
  mobile: { cols: 80,  rows: 50,  thresholds: 3, particles: 35 },
} as const

const CORAL_COLOR = { r: 232, g: 82, b: 63 }
const CONTOUR_COLOR = { r: 26, g: 26, b: 26 }
const CORAL_RADIUS = 150

// Wave equation constants
const WAVE_SPEED = 0.18          // moderate propagation
const WAVE_DAMPING = 0.945       // ~0.5s fade — brief flash then gone
const MOUSE_DROP_RADIUS = 5      // broad radius for smooth rounded ripples
const MOUSE_DROP_STRENGTH = 0.018 // light touch — capped per cell, decays fast
const LETTER_PICKUP_STRENGTH = 0.025
const LETTER_DROP_STRENGTH = 0.025
const AMBIENT_STRENGTH = 0.001   // subtle ambient perturbation (halved from original)
const AMBIENT_INTERVAL = 20      // less frequent ambient drops

const CUTOUT_PAD = 3

// Floating particle system
const PARTICLE_WAVE_FORCE = 2.5
const PARTICLE_MOUSE_RADIUS = 160
const PARTICLE_MOUSE_FORCE = 0.35
const PARTICLE_SPEED_MULTIPLIER = 0.12
const PARTICLE_FRICTION = 0.985
const PARTICLE_DRIFT = 0.03
const PARTICLE_MIN_SIZE = 2.5
const PARTICLE_MAX_SIZE = 5.0
const PARTICLE_MIN_OPACITY = 0.15
const PARTICLE_MAX_OPACITY = 0.4
const PARTICLE_LETTER_BURST = 3.0
const PARTICLE_LETTER_REPEL = 0.8
const PARTICLE_LETTER_PAD = 15

// Per-character boundary shapes — better letter fidelity
const CHAR_BOUNDARY: Record<string, { shape: 'ellipse' | 'rect'; heightScale?: number }> = {
  'a': { shape: 'ellipse', heightScale: 0.72 },
  's': { shape: 'ellipse', heightScale: 0.72 },
  'e': { shape: 'ellipse', heightScale: 0.72 },
  'o': { shape: 'ellipse', heightScale: 0.72 },
  'u': { shape: 'ellipse', heightScale: 0.72 },
  'm': { shape: 'rect', heightScale: 0.72 },
}

// Letter position type — shared between hook and component
export interface LetterBody {
  x: number       // CSS px relative to canvas parent
  y: number       // CSS px relative to canvas parent
  width: number
  height: number
  fontSize: number    // resolved CSS font-size in px
  prevX: number
  prevY: number
  dragging: boolean
  snapped: boolean
  char: string
}

// Hot/cold drag feedback — DraggableLetters writes, animation hook reads
export interface DragFeedback {
  active: boolean
  targetX: number  // canvas-relative px of best matching target
  targetY: number
  letterX: number  // current dragged letter position
  letterY: number
  proximity: number // 0→far, 1→at target
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseOpacity: number
}

function buildThresholds(count: number): number[] {
  // Positive-only thresholds — each wave crest produces a single contour ring,
  // not doubled pairs from ±threshold crossings
  const step = 0.10 / (count + 1)
  const thresholds: number[] = []
  for (let i = 1; i <= count; i++) {
    thresholds.push(i * step)
  }
  return thresholds
}

function detectTier(isMobile: boolean, isLowEnd: boolean): keyof typeof TIER {
  if (isMobile) return 'mobile'
  if (isLowEnd) return 'low'
  const cores = navigator.hardwareConcurrency || 4
  if (cores <= 4) return 'medium'
  return 'high'
}

export function useTopoAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: { isMobile: boolean },
  lettersRef: React.RefObject<LetterBody[]>,
  completionBurstRef: React.RefObject<boolean>,
  dragFeedbackRef: React.RefObject<DragFeedback>
): void {
  const { prefersReducedMotion, isLowEndDevice } = usePerformance()

  const prefersReducedMotionRef = useRef(prefersReducedMotion)
  const isMobileRef = useRef(options.isMobile)
  const isLowEndRef = useRef(isLowEndDevice)

  useEffect(() => { prefersReducedMotionRef.current = prefersReducedMotion }, [prefersReducedMotion])
  useEffect(() => { isMobileRef.current = options.isMobile }, [options.isMobile])
  useEffect(() => { isLowEndRef.current = isLowEndDevice }, [isLowEndDevice])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = isMobileRef.current
    const isReducedMotion = prefersReducedMotionRef.current

    const tier = detectTier(isMobile, isLowEndRef.current)
    const config = TIER[tier]
    const COLS = config.cols
    const ROWS = config.rows
    const SIZE = COLS * ROWS

    // Single unified wave field
    const height = new Float32Array(SIZE)
    const velocity = new Float32Array(SIZE)
    const boundary = new Uint8Array(SIZE)
    const particles: Particle[] = []

    const thresholds = buildThresholds(config.thresholds)

    // Pre-bake base color strings
    const baseColorStrings: string[] = []
    for (let idx = 0; idx < config.thresholds; idx++) {
      const elevation = idx / Math.max(config.thresholds - 1, 1)
      const opacity = 0.15 + elevation * 0.4
      baseColorStrings.push(`rgba(${CONTOUR_COLOR.r},${CONTOUR_COLOR.g},${CONTOUR_COLOR.b},${opacity})`)
    }

    let canvasWidth = 0
    let canvasHeight = 0
    let dpr = 1
    // DPR caps by tier — lower-end devices save fill rate
    const maxDpr = tier === 'mobile' || tier === 'low' ? 1 : tier === 'medium' ? 1.5 : 2

    // Manual letter ripples — expanding rings rendered directly on canvas,
    // independent of wave equation speed. Each ripple has its own center, radius, and lifetime.
    interface LetterRipple { cx: number; cy: number; age: number; maxAge: number; maxRadius: number }
    const letterRipples: LetterRipple[] = []
    const LETTER_RIPPLE_INTERVAL = 180  // frames between new ripple cycles
    const LETTER_RIPPLE_MAX_AGE = 220   // frames to fully expand and fade (~3.7s at 60fps)
    const LETTER_RIPPLE_MAX_RADIUS = 42 // px — how far the ring expands

    // Completion shockwave — full-screen expanding rings on puzzle solve
    const SHOCKWAVE_MAX_AGE = 180       // ~3s at 60fps
    const SHOCKWAVE_MAX_RADIUS_MULT = 0.8 // fraction of canvas diagonal
    const SHOCKWAVE_RINGS = 5
    const SHOCKWAVE_RING_GAP = 25       // px between rings
    const completionShockwave = { active: false, age: 0 }

    // Mouse state
    let rawMouseX = -9999
    let rawMouseY = -9999
    let prevRawMouseX = -9999
    let prevRawMouseY = -9999
    let mouseX = -9999
    let mouseY = -9999
    let prevMouseX = -9999
    let prevMouseY = -9999
    let mouseSpeed = 0
    const MOUSE_SMOOTHING = 0.18  // tracks cursor closely — less phantom trailing

    let rafId = 0
    let frameCount = 0
    let paused = false        // true when tab hidden or hero off-screen
    let tabHidden = false
    let offScreen = false
    const prevDragging = new Uint8Array(20)

    // Adaptive performance — physics always runs, rendering throttles if behind
    let lastTickTime = performance.now()
    let renderSkip = 1            // 1 = every frame, 2+ = skip rendering
    const frameTimeBuf: number[] = []
    const FT_WINDOW = 40
    const TARGET_MS = 20          // degrade if avg frame > 20ms (~50fps)
    const RECOVER_MS = 13         // recover if avg frame < 13ms (~77fps)

    function adaptPerformance(now: number): void {
      const dt = now - lastTickTime
      lastTickTime = now
      if (dt > 0 && dt < 200) {   // ignore tab-switch spikes
        frameTimeBuf.push(dt)
        if (frameTimeBuf.length > FT_WINDOW) frameTimeBuf.shift()
      }
      if (frameCount % FT_WINDOW === 0 && frameTimeBuf.length >= FT_WINDOW) {
        const avg = frameTimeBuf.reduce((a, b) => a + b) / frameTimeBuf.length
        if (avg > TARGET_MS && renderSkip < 3) renderSkip++
        else if (avg < RECOVER_MS && renderSkip > 1) renderSkip--
      }
    }

    function resizeCanvas(): void {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const parent = canvas!.parentElement

      const w = parent?.clientWidth || window.innerWidth
      const h = parent?.clientHeight || window.innerHeight

      // Rescale particle positions on resize
      if (canvasWidth > 0 && canvasHeight > 0 && particles.length > 0) {
        const sx = w / canvasWidth
        const sy = h / canvasHeight
        for (let i = 0; i < particles.length; i++) {
          particles[i].x *= sx
          particles[i].y *= sy
        }
      }

      canvasWidth = w
      canvasHeight = h

      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function toGridX(cpx: number): number {
      return (cpx / canvasWidth) * COLS
    }
    function toGridY(cpy: number): number {
      return (cpy / canvasHeight) * ROWS
    }

    // Boundary grid for wave physics — letters reflect waves
    function updateBoundary(): void {
      boundary.fill(0)
      const letters = lettersRef.current
      if (!letters || letters.length === 0) return

      for (let li = 0; li < letters.length; li++) {
        const letter = letters[li]
        if (letter.char === ' ' || letter.char === '\u00A0') continue
        if (!letter.snapped) continue  // unsnapped letters don't absorb waves

        const halfLeading = (letter.height - letter.fontSize) * 0.5
        let inkTop = letter.y + halfLeading
        const inkBottom = letter.y + letter.height - halfLeading
        const inkLeft = letter.x + letter.width * 0.05
        const inkRight = letter.x + letter.width * 0.95

        const config = CHAR_BOUNDARY[letter.char]
        if (config?.heightScale) {
          inkTop = inkBottom - (inkBottom - inkTop) * config.heightScale
        }

        const gxMin = Math.max(0, Math.round(toGridX(inkLeft)))
        const gxMax = Math.min(COLS - 1, Math.round(toGridX(inkRight)))
        const gyMin = Math.max(0, Math.round(toGridY(inkTop)))
        const gyMax = Math.min(ROWS - 1, Math.round(toGridY(inkBottom)))

        // Dragged letters: mark boundary only (no zero trail behind moving letter)
        // Stationary letters: zero height/velocity for clean contour edges
        const zeroCells = !letter.dragging

        if (config?.shape === 'ellipse') {
          const ecx = (gxMin + gxMax) / 2
          const ecy = (gyMin + gyMax) / 2
          const rx = (gxMax - gxMin) / 2
          const ry = (gyMax - gyMin) / 2
          if (rx <= 0 || ry <= 0) continue

          for (let y = gyMin; y <= gyMax; y++) {
            for (let x = gxMin; x <= gxMax; x++) {
              const nx = (x - ecx) / rx
              const ny = (y - ecy) / ry
              if (nx * nx + ny * ny <= 1) {
                const idx = y * COLS + x
                boundary[idx] = 1
                if (zeroCells) { height[idx] = 0; velocity[idx] = 0 }
              }
            }
          }
        } else {
          for (let y = gyMin; y <= gyMax; y++) {
            for (let x = gxMin; x <= gxMax; x++) {
              const idx = y * COLS + x
              boundary[idx] = 1
              if (zeroCells) { height[idx] = 0; velocity[idx] = 0 }
            }
          }
        }
      }
    }

    function dropWave(gx: number, gy: number, strength: number, radius: number, saturate = false): void {
      const cx = gx | 0
      const cy = gy | 0
      const r = radius | 0

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const x = cx + dx
          const y = cy + dy
          if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > r) continue
          const idx = y * COLS + x
          if (boundary[idx]) continue
          const impulse = strength * (0.5 * (1 + Math.cos(Math.PI * dist / r)))
          if (saturate) {
            // Cap — overlapping drops don't stack (prevents trail center buildup)
            if (Math.abs(impulse) > Math.abs(velocity[idx])) {
              velocity[idx] = impulse
            }
          } else {
            velocity[idx] += impulse
          }
        }
      }
    }

    // Inject ripple around a letter's perimeter — follows actual boundary shape
    function dropWaveAroundLetter(letter: LetterBody, strength: number): void {
      const halfLeading = (letter.height - letter.fontSize) * 0.5
      let inkTop = letter.y + halfLeading
      const inkBottom = letter.y + letter.height - halfLeading
      const inkLeft = letter.x + letter.width * 0.05
      const inkRight = letter.x + letter.width * 0.95

      const config = CHAR_BOUNDARY[letter.char]
      if (config?.heightScale) {
        inkTop = inkBottom - (inkBottom - inkTop) * config.heightScale
      }

      const gxMin = Math.max(0, Math.round(toGridX(inkLeft)))
      const gxMax = Math.min(COLS - 1, Math.round(toGridX(inkRight)))
      const gyMin = Math.max(0, Math.round(toGridY(inkTop)))
      const gyMax = Math.min(ROWS - 1, Math.round(toGridY(inkBottom)))

      const ring = 4
      for (let y = gyMin - ring; y <= gyMax + ring; y++) {
        for (let x = gxMin - ring; x <= gxMax + ring; x++) {
          if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue
          const idx = y * COLS + x
          if (boundary[idx]) continue

          // Find min distance to any boundary cell in neighborhood
          let minDist = ring + 1
          for (let dy = -ring; dy <= ring; dy++) {
            for (let dx = -ring; dx <= ring; dx++) {
              const nx = x + dx, ny = y + dy
              if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && boundary[ny * COLS + nx]) {
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < minDist) minDist = d
              }
            }
          }

          if (minDist <= ring) {
            const falloff = 1 - minDist / (ring + 1)
            velocity[idx] += strength * falloff
          }
        }
      }
    }

    // Wave equation — single step, boundary cells reflect (Neumann mirror)
    function stepWave(): void {
      const c2 = WAVE_SPEED * WAVE_SPEED

      for (let y = 1; y < ROWS - 1; y++) {
        for (let x = 1; x < COLS - 1; x++) {
          const idx = y * COLS + x
          if (boundary[idx]) continue

          const left  = boundary[idx - 1] ? 0 : height[idx - 1]
          const right = boundary[idx + 1] ? 0 : height[idx + 1]
          const up    = boundary[idx - COLS] ? 0 : height[idx - COLS]
          const down  = boundary[idx + COLS] ? 0 : height[idx + COLS]

          const laplacian = left + right + up + down - 4 * height[idx]

          velocity[idx] += c2 * laplacian
          velocity[idx] *= WAVE_DAMPING
        }
      }

      // Update heights + hard clamp to prevent runaway energy
      for (let i = 0; i < SIZE; i++) {
        height[i] += velocity[i]
        if (height[i] > 0.3) height[i] = 0.3
        else if (height[i] < -0.3) height[i] = -0.3
        if (velocity[i] > 0.05) velocity[i] = 0.05
        else if (velocity[i] < -0.05) velocity[i] = -0.05
      }

      // Absorbing edges — only iterate border strips
      const EDGE = 10
      for (let y = 0; y < ROWS; y++) {
        const yDist = Math.min(y, ROWS - 1 - y)
        if (yDist >= EDGE) {
          for (let x = 0; x < EDGE; x++) {
            const damp = x / EDGE
            const idx = y * COLS + x
            height[idx] *= damp
            velocity[idx] *= damp
            const idx2 = y * COLS + (COLS - 1 - x)
            height[idx2] *= damp
            velocity[idx2] *= damp
          }
        } else {
          const yDamp = yDist / EDGE
          for (let x = 0; x < COLS; x++) {
            const xDist = Math.min(x, COLS - 1 - x)
            const damp = xDist >= EDGE ? yDamp : Math.min(xDist / EDGE, yDamp)
            const idx = y * COLS + x
            height[idx] *= damp
            velocity[idx] *= damp
          }
        }
      }
    }

    function ambientDrop(): void {
      const x = 10 + Math.random() * (COLS - 20)
      const y = 10 + Math.random() * (ROWS - 20)
      const strength = (Math.random() - 0.5) * AMBIENT_STRENGTH * 2
      dropWave(x, y, strength, 3 + Math.random() * 3)
    }

    function initParticles(): void {
      particles.length = 0
      const count = config.particles
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: 0,
          vy: 0,
          size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
          baseOpacity: PARTICLE_MIN_OPACITY + Math.random() * (PARTICLE_MAX_OPACITY - PARTICLE_MIN_OPACITY),
        })
      }
    }

    function updateParticles(): void {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Distance to cursor — reused for repulsion + wave force damping
        let mouseDist = 9999
        let mouseDx = 0
        let mouseDy = 0
        if (mouseX > -999) {
          mouseDx = p.x - mouseX
          mouseDy = p.y - mouseY
          mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
        }

        // Wave gradient pushes particles along the surface
        const ix = Math.floor(toGridX(p.x))
        const iy = Math.floor(toGridY(p.y))

        if (ix > 0 && ix < COLS - 1 && iy > 0 && iy < ROWS - 1) {
          const idx = iy * COLS + ix
          const gradX = (height[idx + 1] - height[idx - 1]) * 0.5
          const gradY = (height[idx + COLS] - height[idx - COLS]) * 0.5
          // Suppress wave force near cursor so repulsion dominates (prevents gathering)
          const waveMul = mouseDist < PARTICLE_MOUSE_RADIUS
            ? mouseDist / PARTICLE_MOUSE_RADIUS
            : 1.0
          p.vx += gradX * PARTICLE_WAVE_FORCE * waveMul
          p.vy += gradY * PARTICLE_WAVE_FORCE * waveMul
        }

        // Mouse repulsion — cubic falloff (gentle at edge, strong up close)
        // scaled by cursor speed so stationary cursor barely disturbs
        if (mouseDist < PARTICLE_MOUSE_RADIUS && mouseDist > 1) {
          const t = 1 - mouseDist / PARTICLE_MOUSE_RADIUS   // 0 at edge → 1 at center
          const falloff = t * t * t                           // cubic — very soft edges
          const speedBoost = 1 + mouseSpeed * PARTICLE_SPEED_MULTIPLIER
          const force = falloff * PARTICLE_MOUSE_FORCE * speedBoost
          p.vx += (mouseDx / mouseDist) * force
          p.vy += (mouseDy / mouseDist) * force
        }

        // Letter-particle interaction: snapped letters repel, unsnapped attract
        const pLetters = lettersRef.current
        if (pLetters) {
          for (let li = 0; li < pLetters.length; li++) {
            const letter = pLetters[li]
            if (letter.char === ' ' || letter.char === '\u00A0') continue

            const halfLead = (letter.height - letter.fontSize) * 0.5
            let lTop = letter.y + halfLead
            const lBot = letter.y + letter.height - halfLead
            const lLeft = letter.x + letter.width * 0.05
            const lRight = letter.x + letter.width * 0.95

            const cc = CHAR_BOUNDARY[letter.char]
            if (cc?.heightScale) {
              lTop = lBot - (lBot - lTop) * cc.heightScale
            }

            const lcx = (lLeft + lRight) / 2
            const lcy = (lTop + lBot) / 2
            const lhw = (lRight - lLeft) / 2 + PARTICLE_LETTER_PAD
            const lhh = (lBot - lTop) / 2 + PARTICLE_LETTER_PAD

            // Normalized elliptical distance (1.0 = padded edge)
            const lnx = (p.x - lcx) / lhw
            const lny = (p.y - lcy) / lhh
            const lnd = lnx * lnx + lny * lny

            if (letter.snapped) {
              // Snapped: repel particles away from letter boundary
              if (lnd < 1 && lnd > 0.01) {
                const sqrtNd = Math.sqrt(lnd)
                const penetration = 1 - sqrtNd
                const force = penetration * penetration * PARTICLE_LETTER_REPEL
                p.vx += (lnx / sqrtNd) * force
                p.vy += (lny / sqrtNd) * force
              }
            } else {
              // Unsnapped: tight orbit — particles hug close to scattered letters
              const attractRadius = 1.3

              if (lnd < attractRadius * attractRadius && lnd > 0.01) {
                const sqrtNd = Math.sqrt(lnd)
                // Strong pull keeps particles in a tight ring
                const pull = (1 - sqrtNd / attractRadius) * 0.07
                p.vx -= (lnx / sqrtNd) * pull
                p.vy -= (lny / sqrtNd) * pull
                // Tangential drift so particles orbit rather than clump
                p.vx += (lny / sqrtNd) * 0.08
                p.vy -= (lnx / sqrtNd) * 0.08
              }
              // Repel if overlapping the letter
              if (lnd < 1 && lnd > 0.01) {
                const sqrtNd = Math.sqrt(lnd)
                const push = (1 - sqrtNd) * 0.5
                p.vx += (lnx / sqrtNd) * push
                p.vy += (lny / sqrtNd) * push
              }
            }
          }
        }

        // Inter-particle repulsion — prevents clumping
        const REPEL_DIST = 30
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const rdx = p.x - q.x
          const rdy = p.y - q.y
          const rd2 = rdx * rdx + rdy * rdy
          if (rd2 < REPEL_DIST * REPEL_DIST && rd2 > 1) {
            const rd = Math.sqrt(rd2)
            const repel = (1 - rd / REPEL_DIST) * 0.08
            const rx = (rdx / rd) * repel
            const ry = (rdy / rd) * repel
            p.vx += rx; p.vy += ry
            q.vx -= rx; q.vy -= ry
          }
        }

        // Random drift
        p.vx += (Math.random() - 0.5) * PARTICLE_DRIFT
        p.vy += (Math.random() - 0.5) * PARTICLE_DRIFT

        // Friction
        p.vx *= PARTICLE_FRICTION
        p.vy *= PARTICLE_FRICTION

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = canvasWidth + 10
        else if (p.x > canvasWidth + 10) p.x = -10
        if (p.y < -10) p.y = canvasHeight + 10
        else if (p.y > canvasHeight + 10) p.y = -10
      }
    }

    function drawParticles(): void {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Drop shadow — set once, applies to all particle draws
      ctx!.shadowColor = 'rgba(0,0,0,0.14)'
      ctx!.shadowBlur = 8
      ctx!.shadowOffsetX = 2
      ctx!.shadowOffsetY = 3

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const gx = Math.floor(toGridX(p.x))
        const gy = Math.floor(toGridY(p.y))
        let opacity = p.baseOpacity
        let waveH = 0
        if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
          waveH = height[gy * COLS + gx]
          opacity += Math.abs(waveH) * 1.5
        }
        opacity = Math.min(opacity, 0.55)
        // Bob on the surface: wave crest → larger/brighter, trough → smaller/dimmer
        const bobScale = 1 + waveH * 3
        const size = p.size * Math.max(0.5, Math.min(1.5, bobScale))
        ctx!.fillStyle = `rgba(${CONTOUR_COLOR.r},${CONTOUR_COLOR.g},${CONTOUR_COLOR.b},${opacity})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Reset shadow so it doesn't bleed into coral accent or letter cutouts
      ctx!.shadowColor = 'transparent'
      ctx!.shadowBlur = 0
      ctx!.shadowOffsetX = 0
      ctx!.shadowOffsetY = 0
    }

    function burstParticlesFromLetter(letter: LetterBody, strength: number): void {
      const cx = letter.x + letter.width / 2
      const cy = letter.y + letter.height / 2
      const radius = Math.max(letter.width, letter.height) * 0.8

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < radius && dist > 1) {
          const force = (1 - dist / radius) * strength
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }

    const pathGen = geoPath(null, ctx!)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    function drawContours(): void {
      const contourGen = contours().size([COLS, ROWS]).thresholds(thresholds)
      const polygons = contourGen(height as unknown as number[])

      const scaleX = canvasWidth / COLS
      const scaleY = canvasHeight / ROWS
      const numPolygons = polygons.length
      const maxIdx = Math.max(numPolygons - 1, 1)
      const dprScaleX = dpr * scaleX
      const dprScaleY = dpr * scaleY

      // Single pass: draw contour lines
      for (let idx = 0; idx < numPolygons; idx++) {
        const elevation = idx / maxIdx
        const lineWidth = 0.4 + elevation * 0.8

        ctx!.setTransform(dprScaleX, 0, 0, dprScaleY, 0, 0)
        ctx!.beginPath()
        pathGen(polygons[idx])

        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.strokeStyle = baseColorStrings[idx] || baseColorStrings[baseColorStrings.length - 1]
        ctx!.lineWidth = lineWidth
        ctx!.stroke()
      }

      // Floating particles — drawn before coral so they pick up the tint
      drawParticles()

      // Coral accent: tint existing ink near cursor (+ target when dragging)
      if (!isMobile && mouseX > -999) {
        ctx!.globalCompositeOperation = 'source-atop'
        // Primary coral: always follows cursor
        const grad = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, CORAL_RADIUS)
        grad.addColorStop(0, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},0.85)`)
        grad.addColorStop(0.4, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},0.5)`)
        grad.addColorStop(1, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},0)`)
        ctx!.fillStyle = grad
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.fillRect(mouseX - CORAL_RADIUS, mouseY - CORAL_RADIUS, CORAL_RADIUS * 2, CORAL_RADIUS * 2)

        // Secondary coral: beacon at target position (faint even when far, strong when close)
        const fb = dragFeedbackRef.current
        if (fb && fb.active) {
          const p = fb.proximity
          const beaconAlpha = 0.08 + p * p * 0.65  // always-visible base + quadratic ramp
          const beaconRadius = CORAL_RADIUS * (0.4 + p * 0.9)
          const tGrad = ctx!.createRadialGradient(fb.targetX, fb.targetY, 0, fb.targetX, fb.targetY, beaconRadius)
          tGrad.addColorStop(0, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},${beaconAlpha})`)
          tGrad.addColorStop(0.5, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},${beaconAlpha * 0.4})`)
          tGrad.addColorStop(1, `rgba(${CORAL_COLOR.r},${CORAL_COLOR.g},${CORAL_COLOR.b},0)`)
          ctx!.fillStyle = tGrad
          ctx!.fillRect(fb.targetX - beaconRadius, fb.targetY - beaconRadius, beaconRadius * 2, beaconRadius * 2)
        }
        ctx!.globalCompositeOperation = 'source-over'
      }
    }

    // Erase letter ink bounds — shape-matched cutouts
    function drawLetterRipples(): void {
      if (letterRipples.length === 0) return
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const RING_COUNT = 3       // concentric rings trailing the leading edge
      const RING_SPACING = 12    // px between rings

      for (let ri = 0; ri < letterRipples.length; ri++) {
        const ripple = letterRipples[ri]
        if (ripple.age < 0) continue // staggered delay — not started yet

        // Suppress when cursor is within the ripple radius
        if (mouseX > -999) {
          const mdx = mouseX - ripple.cx
          const mdy = mouseY - ripple.cy
          if (mdx * mdx + mdy * mdy < ripple.maxRadius * ripple.maxRadius) continue
        }

        const t = ripple.age / ripple.maxAge // 0→1 over lifetime

        // Ease-out radius for leading edge — slower curve for gentle expansion
        const easedT = 1 - Math.pow(1 - t, 3)
        const leadRadius = easedT * ripple.maxRadius

        // Draw multiple rings trailing behind the leading edge
        for (let ring = 0; ring < RING_COUNT; ring++) {
          const radius = leadRadius - ring * RING_SPACING
          if (radius < 2) continue

          // Each trailing ring is fainter
          const ringFade = 1 - ring * 0.3

          // Global fade: in briefly, hold, out
          let opacity: number
          if (t < 0.08) {
            opacity = t / 0.08
          } else if (t < 0.5) {
            opacity = 1
          } else {
            opacity = 1 - (t - 0.5) / 0.5
          }
          opacity *= 0.14 * ringFade

          // Thinner strokes for inner rings
          const weight = ring === 0 ? 0.9 : 0.6

          if (opacity < 0.01) continue

          ctx!.beginPath()
          ctx!.arc(ripple.cx, ripple.cy, radius, 0, Math.PI * 2)
          ctx!.strokeStyle = `rgba(${CONTOUR_COLOR.r},${CONTOUR_COLOR.g},${CONTOUR_COLOR.b},${opacity})`
          ctx!.lineWidth = weight
          ctx!.stroke()
        }
      }
    }

    function drawCompletionShockwave(): void {
      if (!completionShockwave.active) return
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cx = canvasWidth / 2
      const cy = canvasHeight * 0.45 // centered on name area
      const maxR = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) * SHOCKWAVE_MAX_RADIUS_MULT
      const t = completionShockwave.age / SHOCKWAVE_MAX_AGE

      // Ease-out expansion
      const easedT = 1 - Math.pow(1 - t, 2.5)
      const leadRadius = easedT * maxR

      for (let ring = 0; ring < SHOCKWAVE_RINGS; ring++) {
        const radius = leadRadius - ring * SHOCKWAVE_RING_GAP
        if (radius < 3) continue

        const ringFade = 1 - ring * 0.2

        // Fade: quick in, long hold, gradual out
        let opacity: number
        if (t < 0.05) {
          opacity = t / 0.05
        } else if (t < 0.4) {
          opacity = 1
        } else {
          opacity = 1 - (t - 0.4) / 0.6
        }
        // Coral tint on first ring, contour color on trailing
        const isCoral = ring === 0 && t < 0.3
        const r = isCoral ? 232 : CONTOUR_COLOR.r
        const g = isCoral ? 82 : CONTOUR_COLOR.g
        const b = isCoral ? 63 : CONTOUR_COLOR.b
        opacity *= (isCoral ? 0.3 : 0.18) * ringFade

        if (opacity < 0.01) continue

        ctx!.beginPath()
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        ctx!.lineWidth = ring === 0 ? 1.2 : 0.7
        ctx!.stroke()
      }
    }

    function eraseLetterShapes(): void {
      const letters = lettersRef.current
      if (!letters || letters.length === 0) return

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.globalCompositeOperation = 'destination-out'

      for (let li = 0; li < letters.length; li++) {
        const letter = letters[li]
        if (letter.char === ' ' || letter.char === '\u00A0') continue
        if (!letter.snapped) continue  // only cut out snapped letters

        const halfLeading = (letter.height - letter.fontSize) * 0.5
        let inkTop = letter.y + halfLeading
        const inkBottom = letter.y + letter.height - halfLeading
        const inkLeft = letter.x + letter.width * 0.05
        const inkWidth = letter.width * 0.9

        const config = CHAR_BOUNDARY[letter.char]
        if (config?.heightScale) {
          inkTop = inkBottom - (inkBottom - inkTop) * config.heightScale
        }
        const inkHeight = inkBottom - inkTop

        if (config?.shape === 'ellipse') {
          const ecx = inkLeft + inkWidth / 2
          const ecy = inkTop + inkHeight / 2
          ctx!.beginPath()
          ctx!.ellipse(ecx, ecy, inkWidth / 2 + CUTOUT_PAD, inkHeight / 2 + CUTOUT_PAD, 0, 0, Math.PI * 2)
          ctx!.fill()
        } else {
          ctx!.fillRect(
            inkLeft - CUTOUT_PAD,
            inkTop - CUTOUT_PAD,
            inkWidth + CUTOUT_PAD * 2,
            inkHeight + CUTOUT_PAD * 2
          )
        }
      }

      ctx!.globalCompositeOperation = 'source-over'
    }

    function tick(): void {
      if (paused) return // safety — rAF shouldn't fire when paused, but guard anyway

      const now = performance.now()
      adaptPerformance(now)
      frameCount++

      // === Physics: always runs at full rate ===

      // Smooth mouse — detect raw position jumps (pointer capture release)
      let mouseJumped = false
      if (!isMobile && rawMouseX > -999) {
        if (mouseX < -999) {
          mouseX = rawMouseX
          mouseY = rawMouseY
          mouseJumped = true
        } else {
          const rawDx = rawMouseX - prevRawMouseX
          const rawDy = rawMouseY - prevRawMouseY
          const rawJump = Math.sqrt(rawDx * rawDx + rawDy * rawDy)
          if (prevRawMouseX > -999 && rawJump > 150) {
            mouseX = rawMouseX
            mouseY = rawMouseY
            mouseJumped = true
          } else {
            mouseX += (rawMouseX - mouseX) * MOUSE_SMOOTHING
            mouseY += (rawMouseY - mouseY) * MOUSE_SMOOTHING
          }
        }
      }
      prevRawMouseX = rawMouseX
      prevRawMouseY = rawMouseY

      // Mouse → wave drops interpolated along path (skip on jumps)
      if (!mouseJumped && !isMobile && mouseX > -999 && prevMouseX > -999) {
        const vx = mouseX - prevMouseX
        const vy = mouseY - prevMouseY
        const speed = Math.sqrt(vx * vx + vy * vy)
        if (speed > 0.8) {
          const stepPx = (canvasWidth / COLS) * 3
          const steps = Math.max(1, Math.ceil(speed / stepPx))
          // Floor ensures slow movement still creates visible ripples
          const totalStrength = Math.min(Math.max(speed * 0.0015, 0.004), MOUSE_DROP_STRENGTH)
          const strength = totalStrength / steps
          for (let s = 0; s < steps; s++) {
            const frac = (s + 1) / steps
            const ix = prevMouseX + vx * frac
            const iy = prevMouseY + vy * frac
            dropWave(toGridX(ix), toGridY(iy), strength, MOUSE_DROP_RADIUS, true)
          }
        }
      }
      // Capture cursor speed before overwriting prev (used by particle repulsion)
      if (mouseX > -999 && prevMouseX > -999) {
        const sdx = mouseX - prevMouseX
        const sdy = mouseY - prevMouseY
        mouseSpeed = Math.sqrt(sdx * sdx + sdy * sdy)
      } else {
        mouseSpeed = 0
      }
      prevMouseX = mouseX
      prevMouseY = mouseY

      // Hot/cold drag feedback — inject waves at letter AND target positions
      const feedback = dragFeedbackRef.current
      if (feedback && feedback.active) {
        const p = feedback.proximity  // 0→far, 1→at target

        // --- Directional ripple beam toward target ---
        // Narrow, low-energy drops extending from the letter toward the target.
        // Creates a subtle "pointer" that fades quickly, not a broad splash.
        if (frameCount % 3 === 0) {
          const lgx = toGridX(feedback.letterX)
          const lgy = toGridY(feedback.letterY)
          const dx = feedback.targetX - feedback.letterX
          const dy = feedback.targetY - feedback.letterY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 1) {
            const nx = dx / dist
            const ny = dy / dist
            // Tight ripple on the letter — saturate prevents stacking on slow drags
            dropWave(lgx, lgy, 0.005, 3, true)
            // Jittered accent — one small drop at a random offset along the target direction
            const jitterDist = 6 + Math.random() * 14  // 6–20 grid cells out
            const perpJitter = (Math.random() - 0.5) * 3 // slight sideways wobble
            const jx = lgx + nx * jitterDist + ny * perpJitter
            const jy = lgy + ny * jitterDist - nx * perpJitter
            dropWave(jx, jy, 0.004, 2)
          } else {
            dropWave(lgx, lgy, 0.006, 3)
          }
        }

        // Scatter particles away from dragged letter
        for (let i = 0; i < particles.length; i++) {
          const part = particles[i]
          const dx = part.x - feedback.letterX
          const dy = part.y - feedback.letterY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160 && dist > 5) {
            const force = (1 - dist / 160) * 0.15
            part.vx += (dx / dist) * force
            part.vy += (dy / dist) * force
          }
        }

        // --- Beacon at TARGET position (always present, intensifies with proximity) ---
        // Even far away, a faint pulse hints at the correct position
        const pulseInterval = Math.max(1, Math.round(8 - p * 6))
        if (frameCount % pulseInterval === 0) {
          const tgx = toGridX(feedback.targetX)
          const tgy = toGridY(feedback.targetY)
          const str = 0.003 + p * p * 0.025  // base pulse even at p≈0
          const rad = 3 + p * 4
          dropWave(tgx, tgy, str, rad)
        }

        // Attract nearby particles toward the target when getting warm
        if (p > 0.2) {
          const attractStr = (p - 0.2) * 0.18
          for (let i = 0; i < particles.length; i++) {
            const part = particles[i]
            const dx = feedback.targetX - part.x
            const dy = feedback.targetY - part.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 200 && dist > 5) {
              const pull = attractStr * (1 - dist / 200)
              part.vx += (dx / dist) * pull
              part.vy += (dy / dist) * pull
            }
          }
        }
      }

      // Letter pick-up / drop ripples
      const letters = lettersRef.current
      if (letters) {
        for (let li = 0; li < letters.length; li++) {
          const letter = letters[li]
          const isDragging = letter.dragging ? 1 : 0

          if (isDragging && !prevDragging[li]) {
            dropWaveAroundLetter(letter, LETTER_PICKUP_STRENGTH)
            burstParticlesFromLetter(letter, PARTICLE_LETTER_BURST)
          }
          if (!isDragging && prevDragging[li]) {
            dropWaveAroundLetter(letter, LETTER_DROP_STRENGTH)
            burstParticlesFromLetter(letter, PARTICLE_LETTER_BURST * 0.7)
          }

          prevDragging[li] = isDragging
        }
      }

      // Puzzle completion burst — wave from every letter + central pulse + particle scatter + shockwave
      if (completionBurstRef.current) {
        completionBurstRef.current = false
        const burstLetters = lettersRef.current
        if (burstLetters) {
          for (let li = 0; li < burstLetters.length; li++) {
            const letter = burstLetters[li]
            if (letter.char === ' ' || letter.char === '\u00A0') continue
            dropWaveAroundLetter(letter, 0.06)
          }
        }
        // Big central radial pulse
        dropWave(COLS / 2, ROWS / 2, 0.05, Math.floor(COLS * 0.15))
        // Scatter all particles outward from center
        const burstCx = canvasWidth / 2
        const burstCy = canvasHeight / 2
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.x - burstCx
          const dy = p.y - burstCy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 1) {
            p.vx += (dx / dist) * 5
            p.vy += (dy / dist) * 5
          }
        }
        // Full-screen shockwave — expanding rings from center
        completionShockwave.active = true
        completionShockwave.age = 0
      }
      // Render completion shockwave — multiple rings expanding from center
      if (completionShockwave.active) {
        completionShockwave.age++
        if (completionShockwave.age > SHOCKWAVE_MAX_AGE) {
          completionShockwave.active = false
        }
      }

      updateBoundary()
      stepWave()
      updateParticles()

      if (frameCount % AMBIENT_INTERVAL === 0) {
        ambientDrop()
      }

      // Sustained point-source ripples from unsnapped letters.
      // A single impulse dies too fast (damping 0.945 kills it in ~10 frames).
      // Instead: pick a letter every ~2s, then feed it energy over 30 frames so
      // the ring has time to visibly expand outward before fading.
      // Spawn ripples on all unsnapped letters — staggered start so they don't pulse in unison
      if (frameCount % LETTER_RIPPLE_INTERVAL === 0) {
        const pLetters = lettersRef.current
        if (pLetters) {
          for (let li = 0; li < pLetters.length; li++) {
            const letter = pLetters[li]
            if (letter.char === ' ' || letter.char === '\u00A0' || letter.snapped || letter.dragging) continue
            // Random stagger so letters never sync up — spread across half the interval
            const delay = Math.floor(Math.random() * (LETTER_RIPPLE_INTERVAL * 0.5))
            letterRipples.push({
              cx: letter.x + letter.width / 2,
              cy: letter.y + letter.height / 2,
              age: -delay,
              maxAge: LETTER_RIPPLE_MAX_AGE,
              maxRadius: LETTER_RIPPLE_MAX_RADIUS,
            })
          }
        }
      }
      // Age all active ripples, remove expired
      for (let ri = letterRipples.length - 1; ri >= 0; ri--) {
        letterRipples[ri].age++
        if (letterRipples[ri].age >= letterRipples[ri].maxAge) {
          letterRipples.splice(ri, 1)
        }
      }

      // === Rendering: throttled when behind frame budget ===
      if (frameCount % renderSkip === 0) {
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.clearRect(0, 0, canvasWidth, canvasHeight)
        drawContours()
        drawLetterRipples()
        drawCompletionShockwave()
        eraseLetterShapes()
      }

      rafId = requestAnimationFrame(tick)
    }

    function resume(): void {
      if (!paused) return
      paused = false
      lastTickTime = performance.now() // reset so adaptPerformance ignores the gap
      frameTimeBuf.length = 0
      rafId = requestAnimationFrame(tick)
    }

    function pause(): void {
      if (paused) return
      paused = true
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    function updatePauseState(): void {
      if (tabHidden || offScreen) pause()
      else resume()
    }

    function handleVisibilityChange(): void {
      tabHidden = document.hidden
      updatePauseState()
    }

    function handleMouseMove(e: MouseEvent): void {
      const rect = canvas!.getBoundingClientRect()
      rawMouseX = e.clientX - rect.left
      rawMouseY = e.clientY - rect.top
    }

    resizeCanvas()
    initParticles()

    if (isReducedMotion) {
      for (let i = 0; i < 20; i++) ambientDrop()
      for (let i = 0; i < 60; i++) stepWave()
      updateBoundary()
      drawContours()
      eraseLetterShapes()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
      if (isReducedMotion) {
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.clearRect(0, 0, canvasWidth, canvasHeight)
        updateBoundary()
        drawContours()
        drawLetterRipples()
        drawCompletionShockwave()
        eraseLetterShapes()
      }
    })
    resizeObserver.observe(document.documentElement)

    // Pause animation when hero section scrolls out of view
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        offScreen = !entry.isIntersecting
        updatePauseState()
      },
      { threshold: 0 } // any pixel visible = keep running
    )
    const canvasParent = canvas!.parentElement
    if (canvasParent) intersectionObserver.observe(canvasParent)

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
