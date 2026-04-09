# Requirements: Max Beato Portfolio Redesign

**Defined:** 2026-04-07
**Core Value:** A portfolio that looks and reads like a real person made it — not an AI template.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Remove Three.js, React Three Fiber, and all 3D components from codebase
- [x] **FOUND-02**: Remove StarField, BinaryMatrix, and all decorative background animation components
- [x] **FOUND-03**: Remove dark mode toggle and dark mode CSS/provider
- [x] **FOUND-04**: Remove GitHub API integration for project cards
- [x] **FOUND-05**: Fix `ignoreBuildErrors: true` — enable TypeScript strict checking on build
- [x] **FOUND-06**: Establish performance baseline before new animation work begins

### Design System

- [x] **DSGN-01**: CSS custom properties for topographic theme tokens (line color, weight, spacing, accent, animation timing)
- [x] **DSGN-02**: Non-Inter typeface selected and implemented with intentional editorial type scale (display, heading, body, caption)
- [x] **DSGN-03**: Coral/red-orange accent color (#F05E3B range) defined as CSS token, used only where it earns its place
- [x] **DSGN-04**: Motion vocabulary defined — full motion and reduced motion variants
- [x] **DSGN-05**: Anti-slop checklist derived from research, applied as constraint at every phase

### Hero Animation & Physics

- [x] **TOPO-01**: Hero canvas animation — wave equation physics driving d3-contour visualization with cursor-reactive ripples and coral accent near cursor
- [x] **TOPO-02**: Contour lines have varying density, non-uniform spacing, and organic wave behavior — not algorithmically generated-looking
- [x] **TOPO-03**: Animation fills full hero viewport, not constrained to a box
- [x] **TOPO-04**: SVG contour line accents for section transitions (TopoSvgDivider built, ready for Phase 5 integration)
- [x] **TOPO-05**: All animations respect prefers-reduced-motion
- [x] **TOPO-06**: Adaptive performance — physics always runs, rendering throttles. DPR capped by tier. Particle count scales.
- [x] **HERO-01**: Letter puzzle gate — "Maximus Beato" scatters on load, drag-to-snap mechanic, interchangeable identical characters
- [x] **HERO-02**: Floating particles — bob on wave surface, cursor repulsion (cubic falloff + speed-scaled), letter boundary deflection, burst on pickup/drop
- [x] **HERO-03**: Puzzle completion transition — wave burst from all letters + central pulse + particle scatter + coral flash + nav/scroll unlock
- [x] **HERO-04**: Skip button (4s delay) and hint text for accessibility. Scroll lock + nav hidden until puzzle solved or skipped.

### Content & Copy

- [x] **COPY-01**: All copy written in Max's actual voice (lowercase, direct, no buzzwords)
- [x] **COPY-02**: Hero post-solve subtitle — specific, in Max's voice, appears after puzzle unlock. Not "innovative digital experiences"
- [x] **COPY-03**: About section with authentic personal content (climbing, lifting, cats, engineering philosophy)
- [x] **COPY-04**: Case study content for Tonos pulled from actual /Users/vtx/tonos codebase
- [x] **COPY-05**: Case study content for VTX pulled from actual /Users/vtx/vtx codebase
- [x] **COPY-06**: Case study content for APIMesh/Conway pulled from actual /Users/vtx/conway codebase
- [x] **COPY-07**: Case study content for awesome-mpp pulled from actual /Users/vtx/awesome-mpp repo
- [x] **COPY-08**: Each case study follows problem/approach/outcome structure with real technical specifics and at least one tradeoff or rejected alternative
- [x] **COPY-09**: Experience descriptions for VertikalX, DocReserve, Data Mine with specific technical detail
- [x] **COPY-10**: Zero instances of any copy pattern from the top 50 AI slop list

### Case Study Pages

- [x] **CASE-01**: Route structure at /work/[slug] with generateStaticParams for 4 projects
- [x] **CASE-02**: Case study data stored as TypeScript objects (no MDX, no CMS)
- [x] **CASE-03**: Each case study page is scannable in 90 seconds — hook, approach, result
- [x] **CASE-04**: Links to live demos and/or GitHub repos where available
- [x] **CASE-05**: Tech stack specifics visible per project (actual library names, not "modern stack")

### Home Page Sections

- [x] **HOME-01**: Hero — puzzle gate with wave physics, post-solve unlock with "explore" arrow. Subtitle/tagline needed (Phase 5)
- [x] **HOME-02**: About — personal bio, real photos (Me.jpg, Climbing.jpg, Lifting.jpg, Cats.jpg), engineering philosophy
- [x] **HOME-03**: Projects — cards linking to /work/[slug] with hook + tech stack + outcome hint
- [x] **HOME-04**: Experience — VertikalX, DocReserve, Data Mine with dates and technical specifics
- [x] **HOME-05**: Contact — form functional, needs voice/style pass to match design language
- [x] **HOME-06**: Navigation — functional with resume download, needs style refinement
- [x] **HOME-07**: Recruiter can reach case studies within 2 scrolls + 1 click from hero

### Section Design Continuity

- [ ] **SECT-01**: Section transitions use contour-line accents (TopoSvgDivider or similar) — sections don't feel disconnected from the hero
- [x] **SECT-02**: Each section has distinct scroll animation treatment — NOT uniform fade-in-on-scroll on every section

### Anti-Slop Compliance

- [x] **SLOP-01**: No Inter typeface
- [x] **SLOP-02**: No purple-to-blue gradients, gradient orbs, or gradient mesh backgrounds
- [x] **SLOP-03**: No bento grid layout
- [x] **SLOP-04**: No typewriter animation on hero (hero is puzzle gate — no typewriter needed)
- [x] **SLOP-05**: No uniform fade-in-on-scroll on every section
- [x] **SLOP-06**: No decorative particle systems or star fields (floating particles serve physics simulation purpose, not decoration)
- [x] **SLOP-07**: No glassmorphism or frosted glass effects
- [x] **SLOP-08**: No skill bars, progress bars, or percentage indicators
- [x] **SLOP-09**: No technology badge/logo grid
- [x] **SLOP-10**: No generic CTAs ("let's build something amazing", "available for opportunities")
- [x] **SLOP-11**: No shadcn/MUI default styling on general layout elements (cards, sections, text)
- [x] **SLOP-12**: No cursor trail effects (cursor creates wave ripples, not a visual trail — physics-driven, not decorative)

### Responsive & Performance

- [ ] **PERF-01**: Mobile responsive — all sections usable on phone
- [x] **PERF-02**: LCP < 2.5s on mobile
- [x] **PERF-03**: Lighthouse performance score >= 90
- [x] **PERF-04**: Resume download as PDF from nav or contact section

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish

- **PLSH-01**: OG image metadata for social sharing
- **PLSH-02**: Custom 404 page in topographic theme
- **PLSH-03**: Page transition animations between home and case studies

### Future

- **FUTR-01**: Dark mode (deliberately excluded for v1 — white theme is the design statement)
- **FUTR-02**: Blog/writing section
- **FUTR-03**: Analytics dashboard (visitor tracking)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Three.js / 3D elements | Theme is 2D topographic; 3D adds complexity without serving concept |
| GitHub API project fetching | Replacing with curated case studies; API adds latency and rate limit risk |
| Dark mode | White monochrome is the design direction; dark mode dilutes the concept |
| CMS / MDX | 4 case studies don't justify content infrastructure |
| Blog | Not requested, adds scope |
| Testimonials section | Template pattern; case studies carry credibility instead |
| Skills section with progress bars | Anti-pattern from research; skills shown in project context |
| Newsletter/email signup | Not a content platform |
| Stock photography | AI slop indicator; use real photos and screenshots |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| DSGN-01 | Phase 2 | Complete |
| DSGN-02 | Phase 2 | Complete |
| DSGN-03 | Phase 2 | Complete |
| DSGN-04 | Phase 2 | Complete |
| DSGN-05 | Phase 2 | Complete |
| TOPO-01 | Phase 4 | Complete |
| TOPO-02 | Phase 4 | Complete |
| TOPO-03 | Phase 4 | Complete |
| TOPO-04 | Phase 4 | Complete |
| TOPO-05 | Phase 4 | Complete |
| TOPO-06 | Phase 4 | Complete |
| HERO-01 | Phase 4 | Complete |
| HERO-02 | Phase 4 | Complete |
| HERO-03 | Phase 4 | Complete |
| HERO-04 | Phase 4 | Complete |
| COPY-01 | Phase 3 | Complete |
| COPY-02 | Phase 5 | Complete |
| COPY-03 | Phase 5 | Complete |
| COPY-04 | Phase 3 | Complete |
| COPY-05 | Phase 3 | Complete |
| COPY-06 | Phase 3 | Complete |
| COPY-07 | Phase 3 | Complete |
| COPY-08 | Phase 3 | Complete |
| COPY-09 | Phase 5 | Complete |
| COPY-10 | Phase 6 | Complete |
| CASE-01 | Phase 3 | Complete |
| CASE-02 | Phase 3 | Complete |
| CASE-03 | Phase 6 | Complete |
| CASE-04 | Phase 3 | Complete |
| CASE-05 | Phase 3 | Complete |
| HOME-01 | Phase 5 | Complete |
| HOME-02 | Phase 5 | Complete |
| HOME-03 | Phase 5 | Complete |
| HOME-04 | Phase 5 | Complete |
| HOME-05 | Phase 5 | Complete |
| HOME-06 | Phase 5 | Complete |
| HOME-07 | Phase 5 | Complete |
| SECT-01 | Phase 5 | Pending |
| SECT-02 | Phase 5 | Complete |
| SLOP-01 | Phase 2 | Complete |
| SLOP-02 | Phase 2 | Complete |
| SLOP-03 | Phase 5 | Complete |
| SLOP-04 | Phase 4 | Complete |
| SLOP-05 | Phase 5 | Complete |
| SLOP-06 | Phase 1 | Complete |
| SLOP-07 | Phase 2 | Complete |
| SLOP-08 | Phase 5 | Complete |
| SLOP-09 | Phase 5 | Complete |
| SLOP-10 | Phase 5 | Complete |
| SLOP-11 | Phase 5 | Complete |
| SLOP-12 | Phase 4 | Complete |
| PERF-01 | Phase 6 | Pending |
| PERF-02 | Phase 6 | Complete |
| PERF-03 | Phase 6 | Complete |
| PERF-04 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 61 total (added HERO-01–04, SECT-01–02)
- Mapped to phases: 61
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-08 — added hero puzzle/physics requirements, section design continuity, updated SLOP items*
