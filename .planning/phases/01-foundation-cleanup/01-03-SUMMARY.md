---
phase: 01-foundation-cleanup
plan: 03
subsystem: infra
tags: [build, typescript, eslint, lighthouse, next.config]
dependency_graph:
  requires:
    - phase: 01-02
      provides: clean skeleton components, no dark mode, no 3D imports
  provides:
    - clean-next-config-no-error-suppression
    - zero-typescript-errors-in-retained-code
    - zero-eslint-errors
    - lighthouse-performance-baseline
  affects: [phase-02-design-system, all-future-phases]
tech-stack:
  added: []
  patterns:
    - "next.config.ts with empty NextConfig — no error suppression allowed going forward"
key-files:
  created:
    - .planning/phases/01-foundation-cleanup/lighthouse-baseline.json
  modified:
    - next.config.ts
    - src/components/sections/Contact.tsx
    - src/components/ui/AccessibilityMenu.tsx
    - src/components/ui/PerformanceProvider.tsx
key-decisions:
  - "Contact.tsx Card/Button imports replaced with inline equivalents — deleted components cannot be restored; inline HTML/motion.button/div preserves all functionality"
  - "PerformanceProvider LCP entry uses nullish coalescing (?? null) rather than logical OR (|| ) to handle undefined correctly in TypeScript strict mode"
  - "AccessibilityMenu id prop: replaced id:_ destructure with void id pattern to satisfy @typescript-eslint/no-unused-vars without removing the required interface field"
patterns-established:
  - "No @ts-ignore in retained files — all TS errors fixed at the type level per D-07"
requirements-completed: [FOUND-05, FOUND-06]
duration: 15min
completed: 2026-04-07
---

# Phase 01 Plan 03: Remove Build Error Suppression and Record Lighthouse Baseline Summary

**next.config.ts stripped to empty NextConfig, three TypeScript/ESLint errors fixed across retained files, build and lint pass clean, Lighthouse baseline: Performance 98 / Accessibility 94 / Best Practices 100 / SEO 100**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-07T19:35:00Z
- **Completed:** 2026-04-07T19:50:00Z
- **Tasks:** 2
- **Files modified:** 4 + 1 created (lighthouse-baseline.json)

## Accomplishments
- Removed `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` from next.config.ts
- Fixed all TypeScript errors in retained files (PerformanceProvider, AccessibilityMenu) and blocking import errors in Contact.tsx
- `npm run build` exits 0 with zero errors; `npm run lint` exits 0 with zero warnings
- Lighthouse baseline recorded: Performance 98, Accessibility 94, Best Practices 100, SEO 100

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove build error suppression and fix remaining errors** - `aef66e2` (feat)
2. **Task 2: Record Lighthouse performance baseline** - artifact only (lighthouse-baseline.json on disk, gitignored)

**Plan metadata:** committed via gsd-tools in final commit

## Files Created/Modified
- `next.config.ts` - Stripped to `const nextConfig: NextConfig = {}` — no error suppression
- `src/components/sections/Contact.tsx` - Replaced `Card`/`Button` imports with inline div + motion.button
- `src/components/ui/PerformanceProvider.tsx` - Fixed LCP `?? null` type, fixed FID `processingStart` guard
- `src/components/ui/AccessibilityMenu.tsx` - Fixed unused `id:_` to `void id` pattern
- `.planning/phases/01-foundation-cleanup/lighthouse-baseline.json` - Lighthouse run against production build

## Decisions Made
- Contact.tsx Card and Button were deleted in Plan 01 but Contact.tsx was retained per D-06. Resolution: inline the necessary HTML structure directly rather than recreating the components. The inline card is a `<div>` with equivalent Tailwind classes; the inline button is a `motion.button` preserving the same whileHover/whileTap behavior.
- Lighthouse run against `npm run start` (production build on port 3099) not dev server, giving accurate production scores.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Contact.tsx imported deleted Card and Button components**
- **Found during:** Task 1 (build run after removing error suppression)
- **Issue:** `npm run build` failed with two "Module not found" errors: `@/components/ui/Card` and `@/components/ui/Button` were imported by Contact.tsx but deleted in Plan 01. Plan 02 D-06 said "leave Contact.tsx unchanged" but did not account for the deleted imports.
- **Fix:** Removed both imports; replaced `<Card>` wrapper with inline `<div>` using equivalent Tailwind shadow/border/padding classes; replaced `<Button>` with `<motion.button>` preserving loading states, icon slots, disabled logic, and whileHover/whileTap props.
- **Files modified:** `src/components/sections/Contact.tsx`
- **Verification:** `npm run build` exits 0 after fix
- **Committed in:** `aef66e2` (Task 1 commit)

**2. [Rule 1 - Bug] PerformanceProvider LCP type error: `number | undefined` not assignable to `number | null`**
- **Found during:** Task 1 (TypeScript strict check after removing ignoreBuildErrors)
- **Issue:** `lastEntry.renderTime || lastEntry.loadTime` evaluates to `undefined` when both fields are undefined, but `lcp` state is typed `number | null`. TypeScript strict mode rejects the assignment.
- **Fix:** Changed `||` to `?? null` so the expression always resolves to `number | null`.
- **Files modified:** `src/components/ui/PerformanceProvider.tsx` line 113
- **Verification:** No TS error after fix
- **Committed in:** `aef66e2` (Task 1 commit)

**3. [Rule 1 - Bug] PerformanceProvider FID type error: `processingStart` possibly undefined**
- **Found during:** Task 1 (second build run)
- **Issue:** `entry.processingStart - entry.startTime` uses `processingStart?: number` (optional) directly in arithmetic. TypeScript strict mode rejects subtracting a potentially-undefined value.
- **Fix:** Added `&& entry.processingStart !== undefined` guard in the `if` condition, then used non-null assertion inside the guarded block.
- **Files modified:** `src/components/ui/PerformanceProvider.tsx` line 126-127
- **Verification:** No TS error after fix
- **Committed in:** `aef66e2` (Task 1 commit)

**4. [Rule 1 - Bug] AccessibilityMenu.tsx ESLint error: `_` is defined but never used**
- **Found during:** Task 1 (lint check)
- **Issue:** The component destructured `{ id: _ }` to satisfy the required interface while suppressing an "unused" warning, but `@typescript-eslint/no-unused-vars` flags `_` as well.
- **Fix:** Changed to `{ id }` with `void id;` on the next line with an explanatory comment.
- **Files modified:** `src/components/ui/AccessibilityMenu.tsx` line 23
- **Verification:** `npm run lint` exits 0 with zero warnings after fix
- **Committed in:** `aef66e2` (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (1 Rule 3 blocking, 3 Rule 1 bugs)
**Impact on plan:** All fixes were necessary direct consequences of removing error suppression. No scope creep. Contact.tsx remains functionally identical — only the deleted component dependencies were replaced inline.

## Issues Encountered
- Worktree branch was behind main — required `git merge main` before any work could begin (documented in Plan 02 SUMMARY as well; the new worktree for Plan 03 had the same pattern). Merge was clean fast-forward.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 complete: zero TypeScript errors, zero ESLint errors, no error suppression, no Three.js, no dark mode, no GitHub API, Lighthouse baseline recorded
- Phase 2 (design-system) can begin immediately
- Lighthouse baseline (Performance 98) sets a high bar — Phase 2 animations must not regress below ~85 performance
- Contact.tsx retains `dark:` Tailwind classes — these are dead styles until Phase 5 decides the final design; not a blocker

## Known Stubs

- `src/components/sections/Hero.tsx` — skeleton only, no actual content (Phase 5)
- `src/components/sections/About.tsx` — skeleton with commented-out bio (Phase 5)
- `src/components/sections/Experience.tsx` — skeleton only (Phase 5)
- `src/components/sections/Projects.tsx` — hardcoded project names, no links (Phase 3)
- `src/components/sections/Contact.tsx` — retains `dark:` Tailwind classes that are dead in the current white-only design (Phase 5 will address)

These stubs are intentional Phase 1 outcomes — the plan goal was a compilable skeleton, not final content.

---
*Phase: 01-foundation-cleanup*
*Completed: 2026-04-07*
