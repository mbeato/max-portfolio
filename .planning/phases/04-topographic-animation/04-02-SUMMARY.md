---
phase: 04-topographic-animation
plan: 02
subsystem: animation
tags: [svg, framer-motion, scroll-animation, topographic, dividers]
dependency_graph:
  requires: [src/lib/motion.ts, src/hooks/useIntersectionObserver.ts]
  provides: [src/components/dividers/TopoSvgDivider.tsx, src/lib/topo-paths.ts]
  affects: [src/app/page.tsx]
tech_stack:
  added: [src/lib/topo-paths.ts]
  patterns: [drawPath variant, useScrollAnimation trigger, client/server boundary separation]
key_files:
  created:
    - src/components/dividers/TopoSvgDivider.tsx
    - src/lib/topo-paths.ts
  modified:
    - src/app/page.tsx
decisions:
  - DIVIDER_PATHS extracted to @/lib/topo-paths.ts to avoid client boundary import issue in server component page.tsx
  - 3 divider placements chosen (Hero/About, About/Experience, Experience/Projects) — restraint before Contact
metrics:
  duration: ~8 minutes
  completed: "2026-04-08T00:51:24Z"
  tasks: 2
  files: 3
---

# Phase 04 Plan 02: SVG Contour Line Dividers Summary

SVG contour line dividers with Framer Motion pathLength draw-on animation, triggered by intersection observer at 3 section transitions.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create TopoSvgDivider component | 2b959c9 | src/components/dividers/TopoSvgDivider.tsx |
| 2 | Place SVG dividers between sections | f6d284a | src/app/page.tsx, src/lib/topo-paths.ts |

## What Was Built

**TopoSvgDivider** (`src/components/dividers/TopoSvgDivider.tsx`):
- Client component with `motion.path` elements using `drawPath` variant from `@/lib/motion`
- `useScrollAnimation({ threshold: 0.3 })` triggers draw-on when scrolled into view
- `triggerOnce: true` (default) ensures paths stay drawn after first trigger — no continued animation
- `aria-hidden="true"` wrapper, `preserveAspectRatio="none"` SVG for responsive stretch
- Per-path staggered delay (`i * 0.15s`) with `transitions.draw` (0.8s ease-out)
- Stroke opacity/width increases with path index for layered depth effect

**DIVIDER_PATHS** (`src/lib/topo-paths.ts`):
- 3 sets of hand-crafted organic cubic bezier paths (NOT regular sine waves)
- `heroToAbout`: 3 paths spanning full viewBox width (0-1200) at 25/38/50% height
- `aboutToExperience`: 2 paths with counter-phase undulation at 20/36% height
- `experienceToProjects`: 3 paths with varied amplitude at 22/36/50% height

**Page placement** (`src/app/page.tsx`):
- Dividers at Hero→About, About→Experience, Experience→Projects
- NOT between Projects→Contact (restraint per D-09)
- `className="w-full -my-1"` for seamless section blending

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] DIVIDER_PATHS extracted to separate server-safe file**
- **Found during:** Task 2 build verification
- **Issue:** Importing `DIVIDER_PATHS` from a `'use client'` file in a Server Component (`page.tsx`) caused prerender failure: `TypeError: Cannot read properties of undefined (reading 'map')` at static generation time
- **Fix:** Moved `DIVIDER_PATHS` constant to `src/lib/topo-paths.ts` (no `'use client'` directive, pure data). `TopoSvgDivider.tsx` imports and re-exports it for backward compatibility. `page.tsx` imports directly from `@/lib/topo-paths`
- **Files modified:** `src/lib/topo-paths.ts` (created), `src/components/dividers/TopoSvgDivider.tsx` (updated), `src/app/page.tsx` (updated import)
- **Commit:** f6d284a

**2. [Rule 3 - Blocking] Merged main into worktree before implementation**
- **Found during:** Task 1 setup
- **Issue:** Worktree `worktree-agent-a7a46abb` was 34 commits behind `main` — missing `src/lib/motion.ts`, `src/hooks/useIntersectionObserver.ts`, and all Phase 2 design system files
- **Fix:** `git merge main --no-verify` fast-forwarded to HEAD; no conflicts
- **Commit:** Merge commit (fast-forward, no separate commit)

## prefers-reduced-motion behavior

Handled globally by `MotionProvider.tsx` with `reducedMotion="user"`. Under reduced-motion, Framer Motion skips animation and renders paths in their `animate` state (pathLength: 1, opacity: 1) immediately — fully drawn, no animation.

## Known Stubs

None — all path data is real, component is fully wired with live intersection triggers.

## Self-Check: PASSED

- `src/components/dividers/TopoSvgDivider.tsx`: exists, starts with `'use client'`, contains `motion.path`, `drawPath`, `useScrollAnimation`, `aria-hidden`, `preserveAspectRatio="none"`
- `src/lib/topo-paths.ts`: exists, exports `DIVIDER_PATHS` with 3 path sets
- `src/app/page.tsx`: contains `import TopoSvgDivider`, 3 `<TopoSvgDivider` elements, `id="divider-hero-about"`
- Commits 2b959c9 and f6d284a: confirmed in git log
- `npm run build`: passes, "/" route renders at 14.5 kB, 9 static pages generated
