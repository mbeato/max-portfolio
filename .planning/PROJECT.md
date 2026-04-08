# Max Beato Portfolio — Redesign

## What This Is

A complete visual and content overhaul of Max's personal portfolio site. The current site reads as AI-generated template work — generic copy, overcooked animations, and no cohesive design direction. The redesign establishes a topographic contour line theme with monochrome palette and coral/red-orange accent, hand-crafted animations, and original copy. It showcases four real projects (Tonos, VTX, APIMesh, awesome-mpp) as dedicated case study pages, replaces all generic "innovative digital experiences" language with Max's actual voice, and delivers a site that recruiters, collaborators, and clients immediately recognize as built by someone with taste and engineering depth.

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

- [ ] Topographic contour line theme across entire site (white background, black lines, wave/pulse animations)
- [ ] Coral/red-orange accent color used sparingly but boldly throughout
- [ ] Hero section with full-page topographic line animation (waves, pulses — no spinning objects or linear paths)
- [ ] About section with authentic personal content (climbing, lifting, cats, engineering taste)
- [ ] Projects section linking to dedicated case study pages
- [ ] Experience section (VertikalX, DocReserve, Data Mine) with real technical detail
- [ ] Contact section with form and links
- [ ] All copy rewritten in Max's actual voice — no buzzwords, no template language
- [ ] No component library styling for general layout/cards/text (shadcn only via MCP for specific enhanced components, 21st.dev for select animated components)
- [ ] Deep research on AI slop patterns and top 50 AI design trends to explicitly avoid
- [ ] Original animations with depth — no simple spinning, no straight-path movement, no particle systems for decoration
- [ ] Cohesive theme: every animation/visual element ties back to the topographic concept
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
| Topographic contour line theme | Provides cohesive visual direction vs random one-off animations | — Pending |
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
*Last updated: 2026-04-07 after Phase 3 (Content & Case Studies) completion — 4 case study pages with real codebase content, anti-slop verified, human-approved*
