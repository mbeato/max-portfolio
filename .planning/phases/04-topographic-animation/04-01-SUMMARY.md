---
phase: 04-topographic-animation
plan: 01
subsystem: animation
tags: [canvas, simplex-noise, d3-contour, topographic, hero]
dependency_graph:
  requires: []
  provides:
    - src/hooks/useTopoAnimation.ts
    - src/components/canvas/TopoCanvas.tsx
    - Hero section canvas background layer
  affects:
    - src/components/sections/Hero.tsx
tech_stack:
  added:
    - simplex-noise ^4.0.3
    - d3-contour ^4.0.2
    - d3-geo ^3.1.1
    - "@types/d3-contour ^4.0.2 (dev)"
    - "@types/d3-geo ^3.1.1 (dev)"
  patterns:
    - Float32Array pre-allocation for noise grid (no per-frame GC pressure)
    - ResizeObserver for DPI-aware canvas resize
    - useRef for mutable animation state (mouseX, mouseY, t, rafId) to avoid re-renders
    - Coral blend via linear interpolation between #1A1A1A and #E8523F
key_files:
  created:
    - src/hooks/useTopoAnimation.ts
    - src/components/canvas/TopoCanvas.tsx
  modified:
    - src/components/sections/Hero.tsx
    - package.json
    - package-lock.json
decisions:
  - "GeoJSON MultiPolygon centroid approximation: average first polygon's outer ring coordinates (coordinates[0][0]) for coral proximity blend"
  - "useTopoAnimation useEffect has empty dependency array — all mutable animation state in refs, no React state re-renders"
  - "DPI cap at 2 to prevent 3x retina from tripling pixel work on high-DPI mobile"
metrics:
  duration: 285
  completed_date: "2026-04-08"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 2
---

# Phase 04 Plan 01: Topographic Animation — Hero Canvas Summary

Simplex noise field driving d3-contour marching squares to animate organic contour lines in the hero viewport with mouse warp, coral color proximity shift, ambient drift, and mobile/reduced-motion fallbacks.

## What Was Built

### useTopoAnimation hook (`src/hooks/useTopoAnimation.ts`)

The core animation lifecycle hook (185 lines). Key behaviors:

- **Noise field:** `createNoise3D` from simplex-noise. For each grid cell: `noise3D(nx * 3 + warpOffset, ny * 3 + warpOffset, t * 0.15)`. Time `t` increments by 0.005 per frame for ambient drift.
- **Grid sizing:** Desktop 120x80, 15 thresholds. Mobile 60x40, 8 thresholds. Controlled via `isMobile` option.
- **Pre-allocated values:** `Float32Array(COLS * ROWS)` allocated once outside the rAF loop. Zero per-frame GC pressure.
- **Contour generation:** `contours().size([COLS, ROWS]).thresholds(thresholds)` from d3-contour. Non-linear threshold distribution for non-uniform density (TOPO-02).
- **Rendering:** `geoPath(null, ctx)` with null projection (identity). Scale transform `scaleX = canvasWidth / COLS` applied per-polygon for coordinate mapping. LineWidth compensated for scale.
- **Opacity/weight:** Elevation-indexed `0.15 + elevation * 0.45` opacity, `0.5 + elevation * 1.0` line weight (0.5-1.5px range).
- **Mouse warp:** `warpRadius = 200`. Warp offset added to noise input coords. Desktop only.
- **Coral blend:** Centroid of first outer ring compared to mouse distance. Smooth falloff blending from `rgba(26,26,26)` to `rgba(232,82,63)` with `coralMaxBlend = 0.7`. Desktop only.
- **Reduced motion:** Reads `prefersReducedMotion` from `usePerformance()`. If true, renders one static frame and exits — no rAF loop started.
- **DPI:** `Math.min(window.devicePixelRatio, 2)`. Canvas width/height in device pixels, style in CSS pixels. `ctx.scale(dpr, dpr)` once per resize.
- **Resize:** `ResizeObserver` on `document.documentElement`. On resize, recalculates canvas size and re-scales context.
- **Cleanup:** Cancels rAF, disconnects ResizeObserver, removes mousemove listener on unmount.

### TopoCanvas component (`src/components/canvas/TopoCanvas.tsx`)

Client component mounting the canvas element. SSR-safe mobile detection (default `false`, set in `useEffect` after mount). Canvas styled `position: absolute; inset: 0; z-index: 0; pointer-events: none`. `aria-hidden="true"` — purely decorative.

### Hero.tsx update

Section gains `relative overflow-hidden bg-[var(--color-map-white)]`. Placeholder `border border-gray-200` removed. `<TopoCanvas />` as first child. Text content div gets `relative z-10` for correct stacking.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed GeoJSON MultiPolygon centroid type error**
- **Found during:** Task 1 TypeScript compile
- **Issue:** `ContourMultiPolygon.coordinates` is `Position[][][]` (MultiPolygon: array of polygons, each an array of rings, each ring an array of Position). Iterating `coordinates[0]` gave `Position[][]` (rings), not `Position[]` (points). TypeScript correctly rejected `cx += pt[0]` because `pt` was `Position[]`.
- **Fix:** Access `coordinates[0][0]` (first polygon's first outer ring) and cast `pt` as `number[]` for index access.
- **Files modified:** src/hooks/useTopoAnimation.ts
- **Commit:** f8180de

## Known Stubs

None. The animation is fully wired: simplex noise drives d3-contour, geoPath renders to canvas, mouse events read real cursor position. No hardcoded empty values or placeholder data.

## Self-Check

**Files created:**
- src/hooks/useTopoAnimation.ts — exists
- src/components/canvas/TopoCanvas.tsx — exists
- .planning/phases/04-topographic-animation/04-01-SUMMARY.md — this file

**Commits:**
- f8180de — feat(04-01): install topo deps and create useTopoAnimation hook
- a70d6dc — feat(04-01): create TopoCanvas component and integrate into Hero section
