# Phase 4: Topographic Animation - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the hero canvas animation (simplex noise + d3-contour generating contour lines with wave/pulse effects) and SVG section transition accents. The hero canvas fills the full viewport as a background layer behind hero content. SVG dividers draw on at major section transitions. All animations respect prefers-reduced-motion and hit 60fps / Lighthouse 90 on mobile.

This phase delivers the animation infrastructure only — hero text content, CTAs, and section copy are Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Canvas Rendering Approach
- **D-01:** Use `simplex-noise` npm package for noise field generation (~2KB gzipped, well-maintained)
- **D-02:** Use `d3-contour` for marching squares contour generation from the noise field
- **D-03:** Canvas 2D rendering on main thread with requestAnimationFrame — no Web Workers or OffscreenCanvas (computation is lightweight enough for the grid sizes needed)
- **D-04:** Canvas sits as a background layer behind hero content (position absolute, z-index below text). Phase 5 adds content on top — clean separation of concerns

### Visual Character & Motion
- **D-05:** Mouse-reactive contour lines — the noise field subtly warps in a radius around the cursor position. Subtle warp intensity (noticeable if you look, not screaming "interactive"). Feels cartographic, not like a tech demo
- **D-06:** Ambient drift when mouse is idle — slow z-axis noise evolution creates a gentle breathing/tidal motion. Mouse warp layers on top of the ambient drift. Canvas always feels alive
- **D-07:** Lines near the cursor subtly shift color toward Coral Peak (#E8523F). The warp + coral shift together make the cursor feel like a "peak marker" moving across the terrain. Lines away from cursor remain black at varying opacity
- **D-08:** Contour lines use non-uniform density, varying line weights (0.5px-1.5px), and varying opacity (0.15-0.6) per DESIGN.md section 6 — denser/darker lines feel "closer" like higher elevation

### Section Transition Accents
- **D-09:** SVG contour dividers appear only at major transitions (2-3 key moments, not between every section). Placement at Claude's discretion based on visual flow
- **D-10:** SVG paths draw on via Framer Motion `pathLength` animation triggered by scroll/viewport entry. Uses existing `drawPath` variant from `src/lib/motion.ts` (0.8s ease-out)
- **D-11:** After drawing on, SVG lines stay static — no continued pulse or breathing. The draw itself is the moment. Matches DESIGN.md "restraint signals taste"

### Performance & Mobile
- **D-12:** Mobile strategy: halve noise grid resolution, reduce contour thresholds from ~15 to ~8, disable mouse reactivity (no hover on touch devices). Ambient drift only on mobile
- **D-13:** prefers-reduced-motion fallback: render one static frame of contour lines (no animation). Still shows the topographic aesthetic, zero motion
- **D-14:** Target: 60fps on mid-range mobile, Lighthouse performance score >= 90

### Claude's Discretion
- Exact noise grid dimensions and contour threshold count (optimize during implementation)
- Specific SVG divider placement between sections (2-3 locations based on visual flow)
- Mouse warp radius and falloff curve
- Coral color shift gradient near cursor (how quickly it transitions from black to coral)
- Canvas resize/DPI handling strategy

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `DESIGN.md` section 1 — Visual theme & atmosphere (contour line metaphor, "calm, precise, deliberate")
- `DESIGN.md` section 2 — Color palette (Map White #FAFAF9, Contour Black #1A1A1A, Coral Peak #E8523F, opacity ranges)
- `DESIGN.md` section 6 — Depth & elevation, contour-specific depth (line opacity 0.15-0.6, weight 0.5px-1.5px)
- `DESIGN.md` section 7 — Do's and Don'ts (vary density, test 60fps on mobile, no uniform animation)
- `DESIGN.md` section 8 — Responsive behavior (mobile canvas simplification, reduced-motion rules)
- `DESIGN.md` section 9 — Anti-slop checklist (item 15: every animation ties back to topographic concept)

### Requirements
- `.planning/REQUIREMENTS.md` — TOPO-01 through TOPO-06 are this phase's requirements

### Existing Code
- `src/lib/motion.ts` — `drawPath` variant for SVG section dividers (already defined)
- `src/lib/design-constraints.ts` — Anti-slop checklist as importable constant
- `src/components/ui/MotionProvider.tsx` — Global reduced-motion detection
- `src/components/sections/Hero.tsx` — Skeleton shell (19 lines) ready for canvas integration

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `drawPath` variant in `src/lib/motion.ts` — ready for SVG section divider pathLength animation
- `MotionProvider` in `src/components/ui/MotionProvider.tsx` — provides `useReducedMotion` context for conditional animation
- `useIntersectionObserver` in `src/hooks/useIntersectionObserver.ts` — can trigger SVG draw-on when dividers enter viewport
- `transitions.draw` (0.8s ease-out) — pre-defined timing for path drawing

### Established Patterns
- Client components use `'use client'` directive
- All imports use `@/` alias
- Motion variants defined as typed objects in `src/lib/motion.ts`
- Design tokens available as CSS custom properties via `@theme` in `globals.css`

### Integration Points
- `src/components/sections/Hero.tsx` — canvas component will be added here or as a child component
- `src/app/page.tsx` — section divider components will be placed between section imports
- `package.json` — needs `simplex-noise` and `d3-contour` added as dependencies

### New Dependencies Required
- `simplex-noise` — 2D/3D noise field generation
- `d3-contour` — marching squares contour generation (may need `d3-geo` for path rendering)

</code_context>

<specifics>
## Specific Ideas

- Cursor as "peak marker" — the combination of subtle warp + coral color shift near mouse position creates the feeling of moving a peak marker across a topographic map
- Ambient drift should be slow enough to feel tidal/breathing, not jittery or fast
- On mobile, the animation should still feel alive (ambient drift) even without mouse interaction
- SVG dividers at 2-3 key transition points only — restraint over repetition

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-topographic-animation*
*Context gathered: 2026-04-07*
