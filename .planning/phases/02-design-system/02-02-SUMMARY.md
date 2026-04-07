---
phase: 02-design-system
plan: 02
subsystem: lib
tags: [framer-motion, motion-vocabulary, design-constraints, anti-slop, animation-tokens]

# Dependency graph
requires:
  - 02-01 (globals.css animation timing tokens already in place)
provides:
  - src/lib/motion.ts with all Framer Motion variants: transitions, fadeInUp, fadeIn, staggerContainer, slideInLeft, drawPath
  - src/lib/design-constraints.ts with ANTI_SLOP_CHECKLIST (15 items from DESIGN.md section 9)
  - utils.ts cleaned of animation exports (pure utility functions only)
  - Contact.tsx imports redirected to @/lib/motion
affects: [03-content, 04-hero-animation, 05-sections, 06-case-studies]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single source of truth for Framer Motion variants: src/lib/motion.ts exports typed Variants with explicit transitions"
    - "Base transitions object (fast/base/slow/draw) referenced by all variants — changing one value propagates everywhere"
    - "fadeInUp y:24 (topographic elevation metaphor), staggerChildren:0.08 with delayChildren:0.1"
    - "Anti-slop checklist as importable TypeScript constant — phases 3-6 can reference and acknowledge it"

key-files:
  created:
    - src/lib/motion.ts
    - src/lib/design-constraints.ts
  modified:
    - src/lib/utils.ts
    - src/components/sections/Contact.tsx

key-decisions:
  - "fadeInUp.initial.y changed from 20 to 24 — per research recommendation matching topographic elevation metaphor"
  - "fadeInUp.exit.y changed from -20 to -12 — subtler exit per motion vocabulary design"
  - "staggerChildren changed from 0.1 to 0.08 with added delayChildren:0.1 — tighter stagger with initial pause"
  - "All variants now have explicit transition objects pointing to shared transitions constants"
  - "ANTI_SLOP_CHECKLIST uses 'as const' for full literal type inference + AntiSlopItem export type"

# Metrics
duration: 5min
completed: 2026-04-07
---

# Phase 2 Plan 2: Motion Vocabulary and Anti-Slop Constraints Summary

**Framer Motion variants centralized in src/lib/motion.ts with typed transitions; 15-item anti-slop checklist codified as importable TypeScript constant; Contact.tsx import paths redirected; utils.ts is now a pure utility file**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-07T20:20:12Z
- **Completed:** 2026-04-07T20:25:00Z
- **Tasks:** 2
- **Files modified/created:** 4

## Accomplishments

- Created `src/lib/motion.ts` as the single source of truth for all Framer Motion animation variants — transitions (fast/base/slow/draw), fadeInUp, fadeIn, staggerContainer, slideInLeft, drawPath all typed with `Variants` and `Transition` from framer-motion
- Refined variant values per research: fadeInUp y:24 (was 20), exit y:-12 (was -20, subtler), staggerContainer now has staggerChildren:0.08 and delayChildren:0.1 (was 0.1/none), all variants have explicit transition objects
- Created `src/lib/design-constraints.ts` with ANTI_SLOP_CHECKLIST constant — all 15 items from DESIGN.md section 9 with structured `id`, `rule`, and `grep` fields. Phases 3-6 reference this rather than re-reading DESIGN.md section 9 each time
- Removed fadeInUp and staggerContainer from `src/lib/utils.ts` — utils.ts is now a pure utility file (cn, generateElementId, debounce, throttle)
- Updated Contact.tsx to import animation variants from `@/lib/motion` and generateElementId from `@/lib/utils` — animation behavior identical, only import source changed

## Task Commits

1. **Task 1: Create motion vocabulary and anti-slop checklist** — `8628a17` (feat)
2. **Task 2: Migrate Contact.tsx imports and clean utils.ts** — `6946a3d` (feat)

## Files Created/Modified

- `src/lib/motion.ts` — New: transitions object + 5 typed Variants exports (fadeInUp, fadeIn, staggerContainer, slideInLeft, drawPath)
- `src/lib/design-constraints.ts` — New: ANTI_SLOP_CHECKLIST (15 items as const) + AntiSlopItem type export
- `src/lib/utils.ts` — Removed fadeInUp and staggerContainer; now exports only cn, generateElementId, debounce, throttle
- `src/components/sections/Contact.tsx` — Import line split: animation variants from @/lib/motion, generateElementId from @/lib/utils

## Decisions Made

- fadeInUp y value increased from 20px to 24px — the research recommendation for the topographic elevation metaphor (content "rises" from below like elevation contours appearing)
- staggerChildren reduced from 0.1 to 0.08 with added delayChildren:0.1 — tighter per-child spacing with a brief initial pause before stagger begins
- All variants now embed explicit transition objects referencing the shared `transitions` constants — this means changing `transitions.slow` updates every variant that uses it
- ANTI_SLOP_CHECKLIST uses `as const` for full TypeScript literal inference — each item's type is exact, not widened to string

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria met on first pass. Build and lint clean.

## Known Stubs

None — this plan is purely TypeScript constants and import reorganization. No UI rendering involved.

## Next Phase Readiness

- Phases 3-6 import Framer Motion variants from `@/lib/motion` — never define inline animation values
- `ANTI_SLOP_CHECKLIST` in `@/lib/design-constraints` is the phase gate reference for all subsequent phases
- `drawPath` variant is pre-defined for Phase 4 SVG contour dividers — no new animation constants needed in that phase
- Contact.tsx renders identically with redirected imports — no visual regression

---
*Phase: 02-design-system*
*Completed: 2026-04-07*
