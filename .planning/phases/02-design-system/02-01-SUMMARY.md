---
phase: 02-design-system
plan: 01
subsystem: ui
tags: [tailwind-css-4, css-tokens, design-system, space-grotesk, jetbrains-mono, framer-motion, next-font]

# Dependency graph
requires: []
provides:
  - Complete CSS design token system in globals.css (@theme block with all DESIGN.md tokens)
  - Space Grotesk (400/500/600/700) and JetBrains Mono (400/500) loaded via next/font/google
  - MotionProvider client component wrapping app with MotionConfig reducedMotion="user"
  - Coral selection highlight and focus ring replacing default blue
  - Shadow-as-border CSS variables in :root
affects: [03-content, 04-hero-animation, 05-sections, 06-case-studies]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind CSS 4 @theme block as single source of design tokens (generates both CSS vars and utility classes)"
    - "next/font/google with distinct --font-space-grotesk and --font-jetbrains-mono variable names (avoids Tailwind --font-sans collision)"
    - "MotionProvider thin client component wrapping layout.tsx server component (required for MotionConfig context)"
    - "Shadow-as-border technique: compound box-shadow strings in :root, not @theme"

key-files:
  created:
    - src/components/ui/MotionProvider.tsx
  modified:
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Space Grotesk selected as primary font (in next/font/google registry; Satoshi and General Sans are not)"
  - "JetBrains Mono selected as monospace (broader language coverage than Fira Code at 12-15px)"
  - "Font CSS vars use distinct names (--font-space-grotesk) then @theme --font-sans points to them — avoids Tailwind namespace collision"
  - "MotionProvider is a separate file, not 'use client' on layout.tsx — maintains server component layout"

patterns-established:
  - "Pattern 1: All design tokens live in globals.css @theme — components use var(--color-coral-peak) or Tailwind utility bg-coral-peak"
  - "Pattern 2: Shadow-as-border for all card/container borders — never border: 1px solid"
  - "Pattern 3: Coral (#E8523F) is the single accent — no other accent colors anywhere"
  - "Pattern 4: MotionProvider wraps app globally; reducedMotion='user' handles OS preference"

requirements-completed: [DSGN-01, DSGN-02, DSGN-03, SLOP-01, SLOP-02, SLOP-07]

# Metrics
duration: 15min
completed: 2026-04-07
---

# Phase 2 Plan 1: Design Token System Summary

**Space Grotesk + JetBrains Mono fonts loaded via next/font/google, complete DESIGN.md token system in Tailwind CSS 4 @theme block, MotionConfig with reducedMotion="user" wrapping app**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-07T20:20:00Z
- **Completed:** 2026-04-07T20:35:00Z
- **Tasks:** 2
- **Files modified:** 3 (globals.css, layout.tsx, MotionProvider.tsx created)

## Accomplishments

- Replaced the minimal default token set (only --background/--foreground) with the full DESIGN.md color palette, spacing, border-radius, and animation timing tokens in a Tailwind CSS 4 @theme block
- Replaced Geist/Geist_Mono (Inter-adjacent, violates SLOP-01) with Space Grotesk (400-700) and JetBrains Mono (400-500) via next/font/google — zero layout shift guaranteed
- Created MotionProvider client component so layout.tsx remains a server component; app now has global reducedMotion="user" via MotionConfig
- Replaced blue ::selection and :focus-visible with coral (#E8523F at 15%/50% opacity) — single accent discipline enforced at the CSS level

## Task Commits

1. **Task 1: Rewrite globals.css with complete DESIGN.md token system** - `1aec3b2` (feat)
2. **Task 2: Replace Geist fonts with Space Grotesk + JetBrains Mono, add MotionProvider** - `48a0444` (feat)

## Files Created/Modified

- `src/app/globals.css` - Complete @theme token system: 13 color tokens, font stacks, 10 spacing steps, 3 radius values, 6 animation timing vars; :root shadow-as-border vars; coral selection/focus; stone scrollbar; reduced-motion media query
- `src/app/layout.tsx` - Space_Grotesk + JetBrains_Mono font loading, MotionProvider wrapper, removed bg-white text-gray-900, updated theme-color to #FAFAF9
- `src/components/ui/MotionProvider.tsx` - New thin client component wrapping MotionConfig with reducedMotion="user"

## Decisions Made

- Space Grotesk chosen over Satoshi/General Sans: both Satoshi and General Sans are Fontshare-only, not in next/font/google registry. Space Grotesk is confirmed available, has variable font weights 300-700, and has the editorial geometric character DESIGN.md specifies.
- JetBrains Mono chosen over Fira Code: both in registry, but JetBrains Mono has broader language subset coverage and slightly better readability at 12-15px (the sizes used for Mono Label in DESIGN.md).
- Font variables use distinct names (--font-space-grotesk, not --font-sans) to avoid collision with Tailwind's built-in --font-sans default; @theme then maps --font-sans to point at the loaded font.
- MotionProvider is a separate file rather than adding 'use client' to layout.tsx — this keeps layout.tsx as a Server Component per Next.js App Router best practices.

## Deviations from Plan

None - plan executed exactly as written. The only minor addition: updated theme-color meta tag from #ffffff to #FAFAF9 (Map White) in layout.tsx to match the design system background color — this is clearly correct and consistent with the token system, not a deviation in spirit.

## Issues Encountered

None. Build and lint both passed clean on first attempt.

## Known Stubs

None — this plan establishes CSS tokens and font loading only. No UI components or data rendering involved.

## Next Phase Readiness

- All downstream phases can now consume design tokens via `var(--color-coral-peak)`, `var(--font-sans)`, etc. or Tailwind utilities like `text-coral-peak`, `bg-stone-100`
- Shadow-as-border pattern established: components use `box-shadow: var(--shadow-border)` not `border: 1px solid`
- MotionProvider is in place; any Framer Motion component in the tree automatically respects OS reduced-motion preference
- No blockers for Phase 2 Plan 2 or Phase 3+

---
*Phase: 02-design-system*
*Completed: 2026-04-07*
