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

### Topographic Animation

- [ ] **TOPO-01**: Hero canvas animation — simplex noise + d3-contour generating contour lines with wave/pulse effects
- [ ] **TOPO-02**: Contour lines have varying density, non-uniform spacing, and non-uniform animation phases (not generated-looking)
- [ ] **TOPO-03**: Animation fills full hero viewport, not constrained to a box
- [ ] **TOPO-04**: SVG contour line accents for section transitions using Framer Motion pathLength
- [ ] **TOPO-05**: All animations respect prefers-reduced-motion
- [ ] **TOPO-06**: Canvas animation performs at 60fps on mid-range mobile (Lighthouse performance score >= 90)

### Content & Copy

- [x] **COPY-01**: All copy written in Max's actual voice (lowercase, direct, no buzzwords)
- [ ] **COPY-02**: Hero text — specific, direct, not "innovative digital experiences"
- [ ] **COPY-03**: About section with authentic personal content (climbing, lifting, cats, engineering philosophy)
- [x] **COPY-04**: Case study content for Tonos pulled from actual /Users/vtx/tonos codebase
- [x] **COPY-05**: Case study content for VTX pulled from actual /Users/vtx/vtx codebase
- [x] **COPY-06**: Case study content for APIMesh/Conway pulled from actual /Users/vtx/conway codebase
- [x] **COPY-07**: Case study content for awesome-mpp pulled from actual /Users/vtx/awesome-mpp repo
- [x] **COPY-08**: Each case study follows problem/approach/outcome structure with real technical specifics and at least one tradeoff or rejected alternative
- [ ] **COPY-09**: Experience descriptions for VertikalX, DocReserve, Data Mine with specific technical detail
- [ ] **COPY-10**: Zero instances of any copy pattern from the top 50 AI slop list

### Case Study Pages

- [x] **CASE-01**: Route structure at /work/[slug] with generateStaticParams for 4 projects
- [x] **CASE-02**: Case study data stored as TypeScript objects (no MDX, no CMS)
- [x] **CASE-03**: Each case study page is scannable in 90 seconds — hook, approach, result
- [x] **CASE-04**: Links to live demos and/or GitHub repos where available
- [x] **CASE-05**: Tech stack specifics visible per project (actual library names, not "modern stack")

### Home Page Sections

- [ ] **HOME-01**: Hero — name, role, topographic animation, CTA to projects
- [ ] **HOME-02**: About — personal bio, real photos, engineering philosophy
- [ ] **HOME-03**: Projects — links to 4 case study pages with enough context to entice click-through
- [ ] **HOME-04**: Experience — VertikalX, DocReserve, Data Mine with dates and technical specifics
- [ ] **HOME-05**: Contact — form or email link, social links, resume download
- [ ] **HOME-06**: Navigation — clean, functional, resume download accessible
- [ ] **HOME-07**: Recruiter can reach case studies within 2 scrolls + 1 click from hero

### Anti-Slop Compliance

- [x] **SLOP-01**: No Inter typeface
- [x] **SLOP-02**: No purple-to-blue gradients, gradient orbs, or gradient mesh backgrounds
- [ ] **SLOP-03**: No bento grid layout
- [ ] **SLOP-04**: No typewriter animation on hero
- [ ] **SLOP-05**: No uniform fade-in-on-scroll on every section
- [x] **SLOP-06**: No particle systems, star fields, or floating 3D objects
- [x] **SLOP-07**: No glassmorphism or frosted glass effects
- [ ] **SLOP-08**: No skill bars, progress bars, or percentage indicators
- [ ] **SLOP-09**: No technology badge/logo grid
- [ ] **SLOP-10**: No generic CTAs ("let's build something amazing", "available for opportunities")
- [ ] **SLOP-11**: No shadcn/MUI default styling on general layout elements (cards, sections, text)
- [ ] **SLOP-12**: No cursor trail effects

### Responsive & Performance

- [ ] **PERF-01**: Mobile responsive — all sections usable on phone
- [ ] **PERF-02**: LCP < 2.5s on mobile
- [ ] **PERF-03**: Lighthouse performance score >= 90
- [ ] **PERF-04**: Resume download as PDF from nav or contact section

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
| TOPO-01 | Phase 4 | Pending |
| TOPO-02 | Phase 4 | Pending |
| TOPO-03 | Phase 4 | Pending |
| TOPO-04 | Phase 4 | Pending |
| TOPO-05 | Phase 4 | Pending |
| TOPO-06 | Phase 4 | Pending |
| COPY-01 | Phase 3 | Complete |
| COPY-02 | Phase 5 | Pending |
| COPY-03 | Phase 5 | Pending |
| COPY-04 | Phase 3 | Complete |
| COPY-05 | Phase 3 | Complete |
| COPY-06 | Phase 3 | Complete |
| COPY-07 | Phase 3 | Complete |
| COPY-08 | Phase 3 | Complete |
| COPY-09 | Phase 5 | Pending |
| COPY-10 | Phase 6 | Pending |
| CASE-01 | Phase 3 | Complete |
| CASE-02 | Phase 3 | Complete |
| CASE-03 | Phase 6 | Complete |
| CASE-04 | Phase 3 | Complete |
| CASE-05 | Phase 3 | Complete |
| HOME-01 | Phase 5 | Pending |
| HOME-02 | Phase 5 | Pending |
| HOME-03 | Phase 5 | Pending |
| HOME-04 | Phase 5 | Pending |
| HOME-05 | Phase 5 | Pending |
| HOME-06 | Phase 5 | Pending |
| HOME-07 | Phase 5 | Pending |
| SLOP-01 | Phase 2 | Complete |
| SLOP-02 | Phase 2 | Complete |
| SLOP-03 | Phase 5 | Pending |
| SLOP-04 | Phase 5 | Pending |
| SLOP-05 | Phase 5 | Pending |
| SLOP-06 | Phase 1 | Complete |
| SLOP-07 | Phase 2 | Complete |
| SLOP-08 | Phase 5 | Pending |
| SLOP-09 | Phase 5 | Pending |
| SLOP-10 | Phase 5 | Pending |
| SLOP-11 | Phase 5 | Pending |
| SLOP-12 | Phase 5 | Pending |
| PERF-01 | Phase 6 | Pending |
| PERF-02 | Phase 6 | Pending |
| PERF-03 | Phase 6 | Pending |
| PERF-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 55 total
- Mapped to phases: 55
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after initial definition*
