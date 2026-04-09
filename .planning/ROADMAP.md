# Roadmap: Max Beato Portfolio Redesign

## Overview

Six phases transform the existing AI-template portfolio into a topographic-themed site that reads and looks like a real person made it. Phase 1 clears the technical debt and removes all conflicting visual infrastructure. Phase 2 establishes the design system that every subsequent phase draws from. Phase 3 produces the real content — four case studies extracted from actual codebases. Phase 4 builds the signature topographic canvas animation. Phase 5 assembles the home page with all sections wired together. Phase 6 validates performance, mobile behavior, and anti-slop compliance across the whole site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation Cleanup** - Remove 3D/legacy tech and establish clean baseline (completed 2026-04-07)
- [x] **Phase 2: Design System** - Implement topographic tokens, typography, and motion vocabulary (completed 2026-04-07)
- [ ] **Phase 3: Content & Case Studies** - Extract real content from codebases, build case study pages
- [ ] **Phase 4: Topographic Animation** - Build the hero canvas animation and SVG section accents
- [x] **Phase 5: Home Page Assembly** - Wire all home sections together with final copy and navigation (completed 2026-04-08)
- [ ] **Phase 6: Polish & Performance** - Validate performance, mobile, and anti-slop compliance

## Phase Details

### Phase 1: Foundation Cleanup
**Goal**: Codebase is stripped of all legacy 3D infrastructure, dark mode, and GitHub API integration — a clean, buildable baseline with no conflicting visual systems
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, SLOP-06
**Success Criteria** (what must be TRUE):
  1. Site builds with zero TypeScript errors (ignoreBuildErrors removed, strict checking enabled)
  2. No Three.js, React Three Fiber, StarField, BinaryMatrix, or any 3D/particle component exists in the codebase
  3. No dark mode toggle or dark mode CSS is present anywhere in the project
  4. No GitHub API calls exist — project data is ready to be served statically
  5. Lighthouse performance baseline score is recorded before animation work begins
**Plans:** 3/3 plans complete

Plans:
- [x] 01-01-PLAN.md — Delete 3D infrastructure, decorative backgrounds, removed UI/hooks/lib files, uninstall Three.js packages
- [x] 01-02-PLAN.md — Migrate useReducedMotion, rewrite sections to skeletons, strip dark mode from CSS/layout, clean up constants/types
- [x] 01-03-PLAN.md — Remove build error suppression, fix remaining errors, record Lighthouse baseline

### Phase 2: Design System
**Goal**: The complete topographic design language is codified as CSS tokens, typography, and motion primitives — every subsequent phase has a single source of truth to reference
**Depends on**: Phase 1
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, SLOP-01, SLOP-02, SLOP-07
**Success Criteria** (what must be TRUE):
  1. CSS custom properties exist for all color tokens, contour line weights, spacing, and animation timing — matching DESIGN.md section 2 exactly
  2. A non-Inter editorial typeface (Space Grotesk, Satoshi, or General Sans) is loaded and applied at the full scale defined in DESIGN.md section 3 — display (64px) through label (12px)
  3. Coral Peak (#E8523F) is the sole accent token and appears in code only where DESIGN.md designates it
  4. Motion variants are defined for full-motion and prefers-reduced-motion states — components consume these, not inline values
  5. The anti-slop checklist from DESIGN.md section 9 is applied as a phase gate — no Inter, no gradients, no glassmorphism present
**Plans:** 4/4 plans complete

Plans:
- [x] 02-01-PLAN.md — CSS design tokens (@theme block), typography (Space Grotesk + JetBrains Mono), MotionProvider
- [x] 02-02-PLAN.md — Motion vocabulary (motion.ts), anti-slop checklist, import migration
- [x] 02-03-PLAN.md — Type scale tokens (DESIGN.md section 3 font-size/line-height/letter-spacing in @theme)
- [x] 02-04-PLAN.md — Component color migration (Contact, Navigation, AccessibilityMenu to coral/stone, remove dark:/glassmorphism)

**UI hint**: yes

### Phase 3: Content & Case Studies
**Goal**: All four case study pages are live with real content extracted from actual project codebases — a recruiter can read Tonos, VTX, APIMesh, and awesome-mpp and understand what was actually built and why
**Depends on**: Phase 2
**Requirements**: COPY-01, COPY-04, COPY-05, COPY-06, COPY-07, COPY-08, CASE-01, CASE-02, CASE-03, CASE-04, CASE-05
**Success Criteria** (what must be TRUE):
  1. Routes at /work/tonos, /work/vtx, /work/apimesh, /work/awesome-mpp are statically generated and accessible
  2. Each case study includes: specific problem statement, technical approach with real library names, concrete outcome, and at least one rejected alternative or explicit tradeoff
  3. Tech stack on each page shows actual library names (e.g., "Bun + Hono + x402" not "modern backend stack")
  4. All copy is in Max's voice — lowercase, direct, no buzzwords, no "innovative" or "passionate developer" anywhere
  5. Links to live demos and/or GitHub repos are present where available for each project
**Plans:** 1/2 plans executed

Plans:
- [x] 03-01-PLAN.md — Route infrastructure, UI components, and all 4 case study data objects with real codebase content
- [x] 03-02-PLAN.md — Anti-slop gate verification and visual/content checkpoint

**UI hint**: yes

### Phase 4: Hero Animation & Puzzle Gate
**Goal**: The hero is an interactive liquid physics playground — wave equation driving d3-contour visualization, floating particles on the surface, and a drag-to-place letter puzzle that gates the portfolio. Puzzle completion triggers a dramatic wave burst and unlocks scrolling/navigation.
**Depends on**: Phase 2
**Requirements**: TOPO-01, TOPO-02, TOPO-03, TOPO-04, TOPO-05, TOPO-06, HERO-01, HERO-02, HERO-03, HERO-04
**Success Criteria** (what must be TRUE):
  1. Hero canvas fills the full viewport with contour lines driven by a wave equation simulation — cursor movement creates ripples, letter interactions create bursts
  2. "Maximus Beato" letters scatter on load; dragging each to its stroke-outline target snaps it into place. Identical characters (two "a"s) are interchangeable. Skip button available after 4s.
  3. Floating particles bob on the wave surface, get repelled by cursor (cubic falloff + speed-scaled), burst from letter pickup/drop, and deflect around letter boundaries
  4. Puzzle completion fires wave burst from all letters + central radial pulse + particle scatter, coral flash on name, then scroll/nav unlock after 1.3s, "explore" arrow at 1.8s
  5. Adaptive performance: physics always runs, rendering throttles on slower devices. DPR capped by tier. Particle count scales with device capability.
  6. SVG section dividers (TopoSvgDivider) built and available — currently disabled in page.tsx, ready for Phase 5 integration
**Plans:** 2/3 plans executed (04-01, 04-02 done; 04-03 Lighthouse audit deferred to Phase 6)

Plans:
- [x] 04-01-PLAN.md — Hero canvas animation (wave equation + d3-contour + mouse interaction + coral shift + mobile/reduced-motion)
- [x] 04-02-PLAN.md — SVG section dividers (TopoSvgDivider + pathLength draw-on at 2-3 transitions)
- [ ] 04-03-PLAN.md — Lighthouse performance audit (deferred to Phase 6 — still adding features)
- [x] Unplanned: Puzzle gate, floating particles, completion transition, skip button (implemented in iterative sessions)

**UI hint**: yes

### Phase 5: Home Page Assembly
**Goal**: All sections below the hero are built, styled in the liquid physics design language, and connected — the page reads as one cohesive experience from puzzle gate through contact form. Sections feel connected to the hero's interactive identity without repeating it.
**Depends on**: Phases 3 and 4
**Requirements**: COPY-02, COPY-03, COPY-09, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, SECT-01, SECT-02, SLOP-03, SLOP-05, SLOP-08, SLOP-09, SLOP-10, SLOP-11, PERF-04
**Success Criteria** (what must be TRUE):
  1. Hero post-solve state shows a subtitle/tagline below "Maximus Beato" that appears after puzzle unlock — specific, in Max's voice, not generic
  2. A recruiter can reach a case study page within 2 scrolls + 1 click from the hero (HOME-07)
  3. About section contains authentic personal content (climbing, lifting, cats, engineering philosophy) with real photos — not a generic bio
  4. Experience section lists VertikalX, DocReserve, and Data Mine with specific dates and technical detail — no vague role descriptions
  5. Projects section has cards linking to /work/[slug] with enough context (hook + tech + outcome hint) to entice click-through
  6. Contact section copy rewritten in Max's voice, form styled in design language
  7. Section transitions use TopoSvgDivider or other contour-line accents to visually connect sections
  8. Each section has its own scroll animation treatment — NOT uniform fade-in-on-scroll across all sections
  9. Resume PDF downloadable from both navigation and contact section
  10. Anti-slop gate: no bento grid, no uniform scroll animations, no skill bars, no tech logo grid, no generic CTAs, no shadcn default styling
**Plans:** 4/4 plans complete

Plans:
- [x] 05-01-PLAN.md — Hero post-solve subtitle + About section (bio, photos, scroll animations)
- [x] 05-02-PLAN.md — Experience section (3 work entries) + Projects section (4 case study cards)
- [x] 05-03-PLAN.md — Contact copy/style rewrite + Navigation resume button fix
- [x] 05-04-PLAN.md — TopoSvgDivider wiring in page.tsx + full page visual checkpoint

**UI hint**: yes

### Phase 6: Polish & Performance
**Goal**: The site is fully responsive, meets performance targets, and passes the complete anti-slop checklist — ready to share with recruiters and collaborators
**Depends on**: Phase 5
**Requirements**: COPY-10, CASE-03, PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. Every page is usable on a phone — no horizontal scroll, no obscured content, no broken layouts at < 640px
  2. LCP < 2.5s on mobile (Lighthouse mobile audit)
  3. Lighthouse performance score >= 90 on both home page and at least one case study page
  4. Zero instances of any copy pattern from the anti-slop list — all 15 checklist items from DESIGN.md section 9 pass
  5. Each case study is scannable in 90 seconds — hook visible above the fold, approach and outcome reachable without searching
**Plans:** 2 plans

Plans:
- [ ] 06-01-PLAN.md — Anti-slop copy fix (metadata rewrite), image sizes optimization, About photo grid mobile fix
- [ ] 06-02-PLAN.md — Lighthouse performance audit + mobile responsive checkpoint + case study scannability + visual anti-slop review

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
Note: Phase 4 depends on Phase 2, Phase 5 depends on both Phase 3 and Phase 4.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Cleanup | 3/3 | Complete   | 2026-04-07 |
| 2. Design System | 4/4 | Complete   | 2026-04-07 |
| 3. Content & Case Studies | 2/2 | Complete   | 2026-04-07 |
| 4. Hero Animation & Puzzle Gate | 2/3 + unplanned | Complete (04-03 audit deferred to P6) | 2026-04-08 |
| 5. Home Page Assembly | 4/4 | Complete | 2026-04-08 |
| 6. Polish & Performance | 0/2 | Not started | - |
