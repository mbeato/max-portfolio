---
phase: 05-home-page-assembly
plan: 02
subsystem: ui
tags: [react, framer-motion, scroll-animation, case-studies, experience]

requires:
  - phase: 02-design-system
    provides: design tokens (CSS vars), motion.ts animation variants, typography scale
  - phase: 03-content-case-studies
    provides: CASE_STUDIES data array in case-studies.ts with all 4 projects
provides:
  - Experience section with 3 work entries (VertikalX, DocReserve, Data Mine) and slideInLeft animation
  - Projects section with 4 case study cards linking to /work/[slug] and fadeInUp animation
affects: [05-home-page-assembly, 06-polish-deploy]

tech-stack:
  added: []
  patterns: [experience-entry-left-border-hover, project-card-shadow-as-border, motion-a-semantic-link]

key-files:
  created: []
  modified:
    - src/components/sections/Experience.tsx
    - src/components/sections/Projects.tsx

key-decisions:
  - "DocReserve/Data Mine dates marked with TODO comments pending Max's confirmation (COPY-09 content accuracy)"
  - "Experience entries stagger with slideInLeft; Project cards stagger with fadeInUp (SECT-02 distinct animations)"
  - "ref applied to section element not motion.div to avoid TypeScript RefObject type mismatch (Pitfall 4)"

patterns-established:
  - "ExperienceCard: inline component with useState hover for CSS border-left-color transition"
  - "ProjectCard: motion.a wrapping entire card for semantic link + onHoverStart/onHoverEnd for border animation"
  - "Tech tags: mono font, stone-100 bg, stone-700 text, radius-subtle 3px, 4px 8px padding"

requirements-completed: [COPY-09, HOME-03, HOME-04, HOME-07, SECT-02, SLOP-03, SLOP-05, SLOP-08, SLOP-09]

duration: 3min
completed: 2026-04-08
---

# Phase 5 Plan 2: Experience & Projects Sections Summary

**Experience section with 3 staggered slideInLeft entries and Projects section with 4 case study cards in single-column stack linking to /work/[slug] via motion.a**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-08T20:32:58Z
- **Completed:** 2026-04-08T20:35:31Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Experience section with VertikalX, DocReserve, Data Mine entries showing role, company, dates, description, and tech tags
- Left border on experience entries transitions to coral on hover (structural decoration exception to shadow-as-border rule)
- Projects section with 4 case study cards consuming CASE_STUDIES data, single-column stack at 720px max-width
- Each project card is a semantic motion.a link to /work/[slug] with shadow-as-border and coral left border hover
- Distinct scroll animations per SECT-02: Experience uses slideInLeft, Projects uses fadeInUp
- All copy in Max's voice (lowercase section titles, no buzzwords, no generic CTAs)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Experience section with 3 work entries** - `fc39377` (feat)
2. **Task 2: Build Projects section with 4 case study cards** - `d70f7ec` (feat)

## Files Created/Modified
- `src/components/sections/Experience.tsx` - Complete rebuild from stub: 3 work entries with role, dates, description, tech tags, slideInLeft + stagger animation, left border hover
- `src/components/sections/Projects.tsx` - Complete rebuild from stub: 4 case study cards from CASE_STUDIES, fadeInUp + stagger, motion.a links, shadow-as-border cards

## Decisions Made
- DocReserve dates ("2023") and Data Mine dates ("2022 - 2023") included with TODO comments for Max's confirmation per COPY-09 content accuracy requirement
- ref applied to section element (not motion.div) to satisfy TypeScript strict mode RefObject type -- Pitfall 4 from RESEARCH.md
- Experience uses slideInLeft + staggerContainer; Projects uses fadeInUp + staggerContainer -- distinct per SECT-02
- Projects threshold set to 0.15 (vs 0.2 for other sections) per UI-SPEC Animation Matrix

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ref type mismatch on Experience section**
- **Found during:** Task 1 (Experience section build)
- **Issue:** TypeScript error: RefObject<HTMLElement> not assignable to Ref<HTMLDivElement> when ref applied to motion.div
- **Fix:** Moved ref to the section element instead of motion.div, matching the established pattern from Contact.tsx (Pitfall 4)
- **Files modified:** src/components/sections/Experience.tsx
- **Verification:** npm run build exits 0
- **Committed in:** fc39377 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor structural fix already anticipated in RESEARCH.md Pitfall 4. No scope creep.

## Known Stubs

- `src/components/sections/Experience.tsx` line 18: TODO comment on DocReserve/Data Mine dates pending Max's confirmation
- `src/components/sections/Experience.tsx` line 33: TODO on DocReserve date "2023"
- `src/components/sections/Experience.tsx` line 42: TODO on Data Mine date "2022 - 2023"

These are content-accuracy TODOs per the plan's explicit instruction, not functional stubs. The section renders fully with the provided date values.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Experience and Projects sections are complete and ready for page assembly
- Both sections consume existing design tokens and motion variants correctly
- TopoSvgDivider placement between Experience and Projects can proceed (Plan 01/04 scope)
- About, Contact, Hero, and Navigation sections remain for Plans 01, 03, 04

## Self-Check: PASSED

- All created/modified files exist on disk
- All task commit hashes verified in git log
- Build passes with zero errors

---
*Phase: 05-home-page-assembly*
*Completed: 2026-04-08*
