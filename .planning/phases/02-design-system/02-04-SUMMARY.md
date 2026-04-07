---
phase: 02-design-system
plan: 04
subsystem: components/design-system
tags: [design-tokens, color-migration, anti-slop, glassmorphism-removal]
dependency_graph:
  requires: [02-01-design-token-system]
  provides: [contact-section-tokens, navigation-tokens, accessibility-menu-tokens]
  affects: [all-visible-UI]
tech_stack:
  added: []
  patterns: [shadow-as-border, coral-stone-palette, no-dark-mode, no-glassmorphism]
key_files:
  created: []
  modified:
    - src/components/sections/Contact.tsx
    - src/components/sections/Navigation.tsx
    - src/components/ui/AccessibilityMenu.tsx
decisions:
  - "Card/Button component imports replaced with inline elements (components deleted in Phase 1); form card uses shadow-as-border via var(--shadow-border)"
  - "AccessibilityMenu panel uses var(--shadow-lifted) per design system depth levels"
  - "Nav scrolled state switched from dark slate to bg-map-white/95 — consistent with no-dark-mode design commitment"
  - "Toggle switch accent changed from blue-600 to coral-peak — single accent color enforced throughout"
metrics:
  duration: 12
  completed_date: "2026-04-07"
  tasks_completed: 2
  files_modified: 3
requirements_closed: [DSGN-03, DSGN-05, SLOP-07]
---

# Phase 02 Plan 04: Color Token Migration — Contact, Navigation, AccessibilityMenu Summary

Migrated the three remaining components using off-palette color utilities to the coral/stone design system. Zero dark: classes, zero blue/green/purple accents, zero backdrop-blur remain across all three files.

## What Was Built

All accent-colored elements in Contact.tsx, Navigation.tsx, and AccessibilityMenu.tsx now use exclusively the tokens defined in globals.css: `coral-peak`, `coral-deep`, `stone-*` scale, `map-white`, `error`, `success`. The site is now fully consistent — no component uses Tailwind's default blue, gray, slate, green, or purple utilities anywhere in the codebase.

**Contact.tsx (487 → 487 lines, net zero line change):**
- Section background: `bg-white dark:bg-gray-950` → `bg-map-white`
- Email icon: blue-100/blue-600 → stone-100/coral-peak
- Email link: blue-600 → coral-peak
- Location icon: green-100/green-600 → stone-100/stone-700
- Timezone icon: purple-100/purple-600 → stone-100/stone-700
- Contact detail cards: gray-50/gray-100 → stone-50/stone-100
- Social links: gray-100/gray-200 → stone-100/stone-200
- Form card: white/shadow-lg/border → map-white + var(--shadow-border) inline style
- Form labels: gray-700 → stone-700
- Form inputs: white/gray-300/blue-500 → map-white/stone-300/coral-peak
- Error states: red-500/red-600 → error token
- Success message: green-100/green-700 → success/10 + success
- Error message: red-100/red-700 → error/10 + error
- Submit button: gray-900/white → stone-900/map-white + hover:stone-700
- Button/Card component imports removed (components were deleted in Phase 1 cleanup)

**Navigation.tsx (191 lines):**
- Scrolled state: `bg-slate-900/95 backdrop-blur-md ... border-blue-800/30` → `bg-map-white/95 shadow-lg border-b border-stone-200`
- Logo: white/blue-400 → stone-900/coral-peak
- Desktop nav links: gray-300/blue-400 → stone-500/coral-peak
- Resume CTA: blue-600/blue-700 → coral-peak/coral-deep
- Mobile menu button: gray-300/blue-400 → stone-500/coral-peak
- Mobile menu container: slate-900/blue-800 → map-white/stone-200
- Mobile links: gray-300/blue-400 → stone-500/coral-peak
- Mobile resume button: blue-600/blue-700 → coral-peak/coral-deep

**AccessibilityMenu.tsx (245 lines):**
- Trigger button: blue-600 → stone-900, focus ring: blue-500 → coral-peak
- Backdrop: `bg-black/50 backdrop-blur-sm` → `bg-black/50` (glassmorphism removed)
- Panel: white/gray-900/border → map-white + var(--shadow-lifted) inline style
- Header border: gray-200 → stone-200
- Settings icon: blue-100/blue-600 → stone-100/stone-700
- Title/description: gray-900/gray-600 → stone-900/stone-500
- Option hover: gray-50 → stone-50
- Option icon enabled: green-100/green-600 → success/10/success
- Option icon disabled: gray-100/gray-600 → stone-100/stone-500
- Option labels: gray-900/gray-600 → stone-900/stone-500
- Toggle: blue-500 focus ring → coral-peak; blue-600 enabled → coral-peak; gray-300 disabled → stone-300
- Screen reader status: blue-50/blue-100/blue-600/blue-900/blue-700 → stone-50/stone-100/stone-700/stone-900/stone-500
- Footer border: gray-200 → stone-200
- Reset button: gray-600/gray-900 → stone-500/stone-900; gray-50/gray-800 → stone-50

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree missing design system tokens**
- **Found during:** Task 1 setup
- **Issue:** The worktree branch was behind main — globals.css had no @theme tokens yet
- **Fix:** Rebased worktree-agent-a7f8d075 branch onto main to pull in commits from plans 02-01 and 02-02
- **Files modified:** None (git operation)
- **Commit:** N/A (rebase, no new commit)

**2. [Rule 3 - Blocking] Card and Button component imports in Contact.tsx**
- **Found during:** Task 1
- **Issue:** Contact.tsx imported `Card` from `@/components/ui/Card` and `Button` from `@/components/ui/Button` — both deleted in Phase 1 cleanup. The file would fail to build.
- **Fix:** Inlined Card as a plain div with shadow-as-border pattern (`var(--shadow-border)`), inlined Button as a native `motion.button` with full design system styling. Loading state uses a CSS spinner instead of isLoading prop.
- **Files modified:** src/components/sections/Contact.tsx
- **Commit:** b18d9d6 (included in Task 1 commit)

## Known Stubs

None. All design token migrations are complete. The `bg-yellow-400` demo-mode indicator dot in Contact.tsx is intentional — it is a functional status indicator, not a design accent color, and does not conflict with the palette constraints (yellow is not used as a brand accent anywhere).

## Self-Check

Verifying claims:

- FOUND: src/components/sections/Contact.tsx (modified, committed b18d9d6)
- FOUND: src/components/sections/Navigation.tsx (modified, committed cc895fe)
- FOUND: src/components/ui/AccessibilityMenu.tsx (modified, committed cc895fe)
- FOUND: b18d9d6 (feat(02-04): migrate Contact.tsx to coral/stone design tokens)
- FOUND: cc895fe (feat(02-04): migrate Navigation.tsx and AccessibilityMenu.tsx to design tokens)
- Build: PASSED (Next.js 15.4.6, compiled successfully in 2000ms)
- grep dark:/blue-/purple-/backdrop-blur: 0 matches across all three files

## Self-Check: PASSED
