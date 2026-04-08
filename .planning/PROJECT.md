# Max Beato Portfolio — Redesign

## What This Is

A complete visual and content overhaul of Max's personal portfolio site. The current site reads as AI-generated template work — generic copy, overcooked animations, and no cohesive design direction. The redesign establishes a liquid physics / contour line visual identity with monochrome palette and coral/red-orange accent, hand-crafted animations, and original copy. The hero is an interactive puzzle gate — "Maximus Beato" letters scatter across the viewport, floating particles bob on a wave simulation surface, and visitors drag letters into place to unlock the portfolio. After solving, a wave burst radiates outward, particles scatter, and the rest of the site reveals. It showcases four real projects (Tonos, VTX, APIMesh, awesome-mpp) as dedicated case study pages, replaces all generic language with Max's actual voice, and delivers a site that recruiters, collaborators, and clients immediately recognize as built by someone with taste and engineering depth.

## Core Value

A portfolio that looks and reads like a real person made it — not an AI template. Every design decision, animation, and word should feel intentional, cohesive, and unmistakably Max's.

## Requirements

### Validated

- ✓ Next.js 15 App Router with React 19 — existing
- ✓ Tailwind CSS 4 — existing
- ✓ Framer Motion for animations — existing
- ✓ Vercel deployment — existing
- ✓ TypeScript throughout — existing
- ✓ Design system tokens (color, typography, spacing, shadows) codified in CSS @theme — Phase 2
- ✓ Coral Peak (#E8523F) as sole accent color — Phase 2
- ✓ Space Grotesk + JetBrains Mono typography — Phase 2
- ✓ Motion vocabulary with reduced-motion support — Phase 2
- ✓ Anti-slop checklist enforced (no glassmorphism, no Inter, no gradients) — Phase 2
- ✓ Case study page for Tonos (voice profile API — problem, approach, outcome, tradeoffs) — Phase 3
- ✓ Case study page for VTX Athlete (athlete scoring platform — problem, approach, outcome, tradeoffs) — Phase 3
- ✓ Case study page for APIMesh (autonomous API generation — problem, approach, outcome, tradeoffs) — Phase 3
- ✓ Case study page for awesome-mpp (MPP ecosystem registry — problem, approach, outcome, tradeoffs) — Phase 3
- ✓ All copy rewritten in Max's actual voice — no buzzwords, no template language — Phase 3
- ✓ Content accuracy: all project info pulled from actual repos, not fabricated — Phase 3

### Active

- [ ] Liquid physics visual identity carried through all sections (contour lines, wave interactions, particle accents — not repeated identically, but sections feel connected to the hero)
- [ ] About section with authentic personal content (climbing, lifting, cats, engineering taste)
- [ ] Projects section linking to dedicated case study pages with enough context to entice click-through
- [ ] Experience section (VertikalX, DocReserve, Data Mine) with real technical detail
- [ ] Contact section styled in the design language (currently functional but uses old generic copy)
- [ ] Hero post-solve state — subtitle/tagline appears after puzzle unlock
- [ ] All remaining section copy rewritten in Max's actual voice
- [ ] Section transitions that reference the wave/contour aesthetic (TopoSvgDivider ready but disabled)
- [ ] No component library styling for general layout/cards/text
- [ ] Mobile responsive
- [ ] Resume download

### Out of Scope

- 3D Three.js elements (Earth model, floating shapes) — over-engineered for the theme, removing
- GitHub API integration for project cards — replacing with curated case studies
- Star fields, binary matrix, constellation backgrounds — theme conflict
- Generic skill grids/bubbles — skills shown in context of real projects instead
- Dark mode toggle — monochrome white theme is the design direction
- Blog/writing section — not requested, adds scope
- CMS integration — content is static and curated

## Context

**Existing codebase:** Next.js 15.4.6, React 19, Tailwind CSS 4, Framer Motion, deployed on Vercel. Significant 3D/animation infrastructure (Three.js, React Three Fiber) that will be removed in favor of 2D topographic animations.

**Projects to showcase:**
- **Tonos** (/Users/vtx/tonos) — Voice profile API. Bun + Hono + Claude API + MCP server. Extracts writing patterns and generates text in someone's voice.
- **VTX** (/Users/vtx/vtx) — Athlete scoring & sponsorship marketplace. NestJS + GraphQL + Next.js. Composite scoring from training, social, and competition signals.
- **APIMesh/Conway** (/Users/vtx/conway) — 27 pay-per-call web analysis APIs with autonomous LLM-driven API generation. Bun + Hono + x402 micropayments.
- **awesome-mpp** (/Users/vtx/awesome-mpp) — Curated registry of 100+ Machine Payments Protocol projects, SDKs, and tools.

**Design system:** Fully specified in `DESIGN.md` at project root. All phases that touch UI must read DESIGN.md before implementation. Key specs: Map White (#FAFAF9), Contour Black (#1A1A1A), Coral Peak (#E8523F), shadow-as-border technique, non-Inter editorial typeface, 4-level depth system, 15-point anti-slop checklist. See DESIGN.md sections 2-4 for exact hex values, component styles, and typography scale.

**Anti-patterns to avoid (AI slop):** Generic hero copy ("innovative digital experiences"), overused gradient orbs, particle systems as filler, template card layouts, buzzword-heavy descriptions, cookie-cutter CTAs, predictable scroll animations, shadcn/MUI default aesthetics.

**Content voice:** Max writes lowercase, direct, practical. No corporate buzzwords. States what he built and why. See CLAUDE.md voice profile for full patterns.

## Constraints

- **Tech stack**: Keep Next.js 15, React 19, Tailwind CSS 4, Framer Motion. Remove Three.js/R3F.
- **No component libraries for general UI**: shadcn only through MCP for specific enhanced components, 21st.dev for select animated components. Cards, layout, text styling must be hand-crafted.
- **Anti-AI-slop**: Deep research required before design/implementation. Must explicitly avoid top 50 AI design trends.
- **Content accuracy**: All project info must be pulled from actual repos, not fabricated.
- **Voice**: All copy in Max's actual writing voice (lowercase, direct, no buzzwords).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Liquid physics + contour line identity | Wave equation driving d3-contour gives organic, interactive visual — far from template territory | Validated in Phase 4 |
| Interactive puzzle gate on hero | Forces engagement, demonstrates engineering depth, memorable first impression. Skip button for recruiters in a hurry | Validated in Phase 4 |
| Floating particles on wave surface | Reinforces liquid physics identity — particles bob, scatter from cursor, burst on letter pickup/drop | Validated in Phase 4 |
| Wave equation over simplex noise | Simplex gives static topographic look; wave equation gives live, interactive liquid feel that responds to user | Validated in Phase 4 |
| White + black + coral/red-orange palette | Monochrome base with bold accent avoids generic gradient territory | Validated in Phase 2 |
| Case study pages over project cards | Shows depth of thinking, avoids generic card grid pattern | Validated in Phase 3 |
| Remove Three.js/3D entirely | Theme is 2D topographic, 3D adds complexity without serving the concept | Validated in Phase 1 |
| No dark mode | Single cohesive white theme is the design statement | Validated in Phase 1 |
| No component library default styling | Avoids looking like every other shadcn portfolio | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-08 after Phase 4 hero implementation — puzzle gate, wave physics, floating particles, completion transition, skip button*
