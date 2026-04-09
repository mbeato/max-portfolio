# Phase 6: Polish & Performance - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Validate and fix the complete site for mobile responsiveness, Lighthouse performance targets, and anti-slop compliance. This is the final quality gate before sharing the portfolio with recruiters and collaborators. No new features — only measurement, fixes, and verification across all existing pages (home + 4 case studies).

</domain>

<decisions>
## Implementation Decisions

### Mobile Responsive Audit
- **D-01:** Test at three breakpoints: 375px (iPhone SE — smallest common), 390px (iPhone 14/15 — most common), 768px (iPad — tablet threshold). All sections must be usable at each.
- **D-02:** Priority sections for mobile testing: Hero canvas (fullscreen viewport, puzzle interaction on touch), Experience (was a horizontal carousel — verify it works on narrow screens), Contact form (input sizing, keyboard behavior), Navigation (mobile menu).
- **D-03:** Case study pages tested at 375px — hook visible above fold, text readable without horizontal scroll, code blocks don't overflow.
- **D-04:** No horizontal scroll allowed on any page at any tested breakpoint.

### Performance Optimization Strategy
- **D-05:** Measure-first approach: run Lighthouse mobile audit on home page and one case study page before making any changes. The Phase 1 baseline was 98 (before canvas animation was added).
- **D-06:** If Lighthouse performance < 90, prioritize fixes by LCP impact: (1) font loading — preload Space Grotesk, (2) canvas animation — verify deferred/lazy initialization doesn't block LCP, (3) image optimization — verify next/image is properly configured with sizes/priority, (4) JS bundle — check for unnecessary dependencies.
- **D-07:** Canvas animation already has adaptive performance (Phase 4: renderSkip 1-3, halved mobile grid, disable mouse on touch). If canvas is still a bottleneck, reduce initial threshold count further rather than removing animation.
- **D-08:** Target: Lighthouse performance >= 90 on both home page and at least one case study page (PERF-03). LCP < 2.5s on mobile (PERF-02).

### Anti-Slop Verification
- **D-09:** Run automated grep scan using the 8 pattern-based items from `ANTI_SLOP_CHECKLIST` in `design-constraints.ts` (items 1-4, 6-9 with grep patterns). Zero matches required.
- **D-10:** Manual visual review for the 7 subjective items: (5) no uniform fade-in-on-scroll, (11) no shadcn default styling on layout, (13) copy in Max's voice, (14) coral at emphasis points only, (15) every animation ties to topographic concept. Plus (10) no generic CTA copy and (12) no cursor trail.
- **D-11:** Full anti-slop pass across ALL pages — home page sections + all 4 case study pages. Not just the home page.
- **D-12:** If anti-slop violations found, fix them in this phase. Copy violations (COPY-10) get rewritten in Max's voice. Visual violations get restyled per DESIGN.md.

### Case Study Scannability
- **D-13:** Verify each case study meets the 90-second scan requirement (CASE-03): hook visible above fold without scrolling, technical approach section reachable within 2 scrolls, outcome/result visible within 3 scrolls.
- **D-14:** If a case study fails scannability, restructure its layout (reorder sections, tighten spacing) — don't rewrite content unless copy itself is the problem.

### Claude's Discretion
- Specific Lighthouse fix prioritization beyond the general order in D-06
- Whether to add `<link rel="preload">` for fonts or rely on next/font optimization
- Bundle analysis tooling choice (next/bundle-analyzer vs manual inspection)
- Exact responsive CSS fixes needed (will be discovered during audit)
- Whether any section needs structural changes for mobile vs just CSS tweaks

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `DESIGN.md` section 8 — Responsive behavior rules (mobile canvas simplification, reduced-motion)
- `DESIGN.md` section 9 — Anti-slop checklist (all 15 items, line 285+)
- `DESIGN.md` section 7 — Do's and Don'ts (vary density, test 60fps on mobile)

### Requirements
- `.planning/REQUIREMENTS.md` — COPY-10, PERF-01, PERF-02, PERF-03 are this phase's requirements (CASE-03 already complete)

### Anti-Slop Implementation
- `src/lib/design-constraints.ts` — `ANTI_SLOP_CHECKLIST` constant with grep patterns for automated verification

### Prior Performance Decisions
- `.planning/phases/04-topographic-animation/04-CONTEXT.md` — D-12 through D-14: mobile canvas strategy, reduced-motion fallback, performance targets

### Codebase Analysis
- `.planning/codebase/CONCERNS.md` — Known performance bottlenecks, fragile areas, accessibility gaps
- `.planning/codebase/ARCHITECTURE.md` — Component architecture, data flow, entry points

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ANTI_SLOP_CHECKLIST` in `src/lib/design-constraints.ts` — 8 items have grep patterns for automated scanning
- `PerformanceProvider` in `src/components/ui/PerformanceProvider.tsx` — already measures Core Web Vitals (FCP, LCP, FID, CLS, TTFB)
- `MotionProvider` in `src/components/ui/MotionProvider.tsx` — reduced-motion detection and global context
- `useTopoAnimation` in `src/hooks/useTopoAnimation.ts` — adaptive performance (renderSkip, mobile grid halving)

### Established Patterns
- Responsive breakpoints already used across 7 files (sm:, md:, lg:, xl: Tailwind utilities)
- next/image with fill + object-cover for CLS-free photo rendering (About section)
- Canvas animation has built-in adaptive performance monitoring (40-frame window average)
- Motion variants consume MotionProvider context for reduced-motion compliance

### Integration Points
- `src/app/page.tsx` — home page entry point, renders all sections
- `src/app/work/[slug]/page.tsx` — case study page route
- `src/app/layout.tsx` — root layout with font loading, metadata
- `next.config.ts` — build configuration (ignoreBuildErrors was removed in Phase 1)

### Known Performance Considerations
- Canvas animation is the heaviest component — already has adaptive tier system
- Space Grotesk + JetBrains Mono loaded via next/font (should be optimized by default)
- d3-contour and simplex-noise are runtime dependencies for hero canvas
- Case study pages are statically generated (generateStaticParams)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for audit methodology and fix ordering. The success criteria from ROADMAP.md are well-defined and measurable.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-polish-performance*
*Context gathered: 2026-04-08*
