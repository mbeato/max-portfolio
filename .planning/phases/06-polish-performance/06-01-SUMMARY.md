---
phase: 06-polish-performance
plan: 01
subsystem: copy, images, layout
tags: [anti-slop, metadata, performance, mobile]
requirements: [COPY-10, PERF-02, PERF-03]

dependency_graph:
  requires: []
  provides: [clean-metadata, optimized-images, mobile-safe-about]
  affects: [src/app/layout.tsx, src/lib/constants.ts, src/components/sections/About.tsx, src/components/sections/Hero.tsx]

tech_stack:
  added: []
  patterns: [next/image sizes prop, CSS clamp() for responsive minHeight, anti-slop metadata voice]

key_files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/lib/constants.ts
    - src/components/sections/About.tsx
    - src/components/sections/Hero.tsx

decisions:
  - Gradient hits in DraggableLetters.tsx and TopoCanvas.tsx are all mask-image techniques — approved, no decorative backgrounds remain
  - Particle hits confirmed as physics-driven simulation in useTopoAnimation.ts — approved per SLOP-06
  - cursor-follow comment in DraggableLetters.tsx is a JSX description of the spotlight technique, not a cursor trail effect

metrics:
  duration: 96
  completed_date: "2026-04-09"
  tasks_completed: 2
  files_modified: 4
---

# Phase 06 Plan 01: Copy + Image Performance Fixes Summary

**One-liner:** Rewrote all AI-template metadata in Max's voice and added `sizes` props with `clamp()` responsive heights to all four About images, eliminating srcset gaps and mobile overflow.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite slop metadata and run anti-slop grep audit | 5b2497f | src/app/layout.tsx, src/lib/constants.ts, src/components/sections/Hero.tsx |
| 2 | Add image sizes props and fix About photo grid for mobile | 63fd59c | src/components/sections/About.tsx |

## What Was Built

### Task 1: Metadata rewrite + anti-slop audit

Four AI-template description strings replaced with Max's voice copy:

- `layout.tsx` line 26 (metadata.description): "max beato — purdue cs. i build fast systems: tonos (voice profiling api), vtx (athlete composite scoring), apimesh (mcp tool orchestration)."
- `layout.tsx` line 46 (openGraph.description): same full description
- `layout.tsx` line 60 (twitter.description): shortened form — "max beato — purdue cs. i build fast systems: tonos, vtx, apimesh."
- `constants.ts` line 7 (SITE_CONFIG.description): same full description as metadata

Hero dot-grid backdrop removed: deleted `backgroundImage: 'radial-gradient(...)'` and `backgroundSize: '40px 40px'` style props from the `<section>` element. Canvas covers it entirely so it was invisible — removing it eliminates ambiguity in the gradient grep audit.

Full anti-slop grep audit passes:
- "innovative|cutting-edge|modern portfolio|showcasing": 0 matches
- "bento": only in design-constraints.ts (the rule definition)
- "typewriter": only in design-constraints.ts
- "glassmorphism|frosted": only in design-constraints.ts
- "skill-bar|progress-bar": only in design-constraints.ts
- "logo-grid|tech-grid": only in design-constraints.ts
- "build something amazing|available for opportunities": only in design-constraints.ts
- "cursor-trail|cursor-follow": one JSX comment in DraggableLetters.tsx describing the spotlight technique
- gradient: all mask-image usage (DraggableLetters, TopoCanvas canvas fade) — no decorative backgrounds
- particle: all in useTopoAnimation.ts physics loop — approved per SLOP-06

### Task 2: Image sizes props + responsive clamp() heights

All four `<Image fill>` components in About.tsx now have `sizes` props for proper Next.js srcset generation:

- Me.jpg (portrait): `sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"`
- Climbing.jpg: `sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"`
- Lifting.jpg: `sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 100px"`
- Cats.jpg: `sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 100px"`

All four containers use `clamp()` for responsive minHeight instead of fixed pixel values:

- Portrait: `clamp(250px, 55vw, 400px)` — at 375px ~206px, at 768px+ caps at 400px
- Climbing: `clamp(120px, 27vw, 195px)` — at 375px ~101px, caps at 195px
- Lifting/Cats: `clamp(56px, 12vw, 93px)` — at 375px ~45px each, caps at 93px

## Verification

1. `grep -rn "innovative|cutting-edge|modern portfolio|showcasing" src/` — **0 matches**
2. `grep -c 'sizes=' src/components/sections/About.tsx` — **4**
3. `grep -c "backgroundImage" src/components/sections/Hero.tsx` — **0**
4. `npm run build` — **clean, no errors**

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

Files verified:
- FOUND: src/app/layout.tsx (3 descriptions updated)
- FOUND: src/lib/constants.ts (SITE_CONFIG.description updated)
- FOUND: src/components/sections/About.tsx (4 sizes props, 4 clamp() values)
- FOUND: src/components/sections/Hero.tsx (backgroundImage removed)

Commits verified:
- FOUND: 5b2497f (fix(06-01): rewrite slop metadata...)
- FOUND: 63fd59c (feat(06-01): add sizes props to About images...)
