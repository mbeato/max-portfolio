---
phase: 05-home-page-assembly
plan: 03
subsystem: ui
tags: [contact-form, navigation, shadow-as-border, copy-rewrite, resume-download, emailjs]

# Dependency graph
requires:
  - phase: 02-design-system
    provides: design tokens (shadow-border, radius-standard, coral-peak, typography tokens)
  - phase: 01-foundation-cleanup
    provides: Contact.tsx form logic (EmailJS, validation, state management)
provides:
  - Contact section with Max's voice copy, shadow-as-border inputs, coral focus state, resume download
  - Navigation resume button corrected to secondary outlined style
affects: [05-home-page-assembly, 06-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [shadow-as-border for form inputs with focus/error state via getInputShadow helper]

key-files:
  created: []
  modified:
    - src/components/sections/Contact.tsx
    - src/components/sections/Navigation.tsx

key-decisions:
  - "Contact form inputs use inline boxShadow with getInputShadow helper for focus/error/idle states instead of Tailwind border/ring utilities"
  - "Resume download available from both Navigation and Contact section left info column"
  - "Social icon buttons use p-3 for 44px touch target minimum, no background pill"

patterns-established:
  - "Shadow-as-border input pattern: getInputShadow(fieldName, hasError) returns inline boxShadow string with coral focus, red error, stone idle states"
  - "Typography tokens applied via inline style for heading elements, Tailwind utilities for body text"

requirements-completed: [HOME-05, HOME-06, PERF-04, SLOP-10, SLOP-11]

# Metrics
duration: 3min
completed: 2026-04-08
---

# Phase 5 Plan 3: Contact & Navigation Cleanup Summary

**Contact section rewritten in Max's voice with shadow-as-border inputs and coral focus state; Navigation resume button corrected to secondary outlined style**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-08T20:33:02Z
- **Completed:** 2026-04-08T20:35:59Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Contact section copy fully rewritten: "say hi", "reach me", "find me" replace all generic AI-slop copy
- Form inputs migrated from Tailwind border/focus:ring to shadow-as-border pattern with coral focus and red error states
- Resume download link added to Contact left info column (now available from both nav and contact)
- Navigation resume button changed from coral-filled primary to secondary outlined style on both desktop and mobile
- Timezone row, demo mode notice, and scale-on-hover animations removed from Contact

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite Contact section copy and migrate to shadow-as-border** - `d6f3a7a` (feat)
2. **Task 2: Fix Navigation resume button to secondary outlined style** - `d28bee5` (feat)

## Files Created/Modified
- `src/components/sections/Contact.tsx` - Full copy rewrite, shadow-as-border inputs, resume download link, removed slop elements
- `src/components/sections/Navigation.tsx` - Resume button changed from coral-filled to secondary outlined on desktop and mobile

## Decisions Made
- Contact form inputs use a `getInputShadow` helper function returning inline boxShadow strings for three states (idle: stone, focus: coral, error: red) instead of Tailwind focus:ring utilities -- avoids ring/border conflicts documented in Pitfall 2
- Social icon buttons stripped of bg-stone-100 rounded-lg pill -- now plain icon buttons with p-3 padding for 44px touch target
- Resume download link placed after email and location rows in left info column, using underline with stone-300 decoration matching ghost link pattern

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all data sources are wired (EmailJS, SITE_CONFIG, SOCIAL_LINKS).

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Contact section and Navigation are complete and aligned with design system
- Form submission works (EmailJS configured via env vars, demo mode fallback still functions)
- Resume download works from both navigation and contact section

---
*Phase: 05-home-page-assembly*
*Completed: 2026-04-08*
