---
phase: 03-content-case-studies
plan: 01
subsystem: case-study-infrastructure
tags: [case-studies, routing, content, ssg, framer-motion]
dependency_graph:
  requires: [02-design-system]
  provides: [case-study-pages, case-study-data, case-study-components]
  affects: [src/lib/case-studies.ts, src/app/work/[slug]/page.tsx, src/components/case-study/]
tech_stack:
  added: []
  patterns: [generateStaticParams, async-params-next15, stagger-container-motion]
key_files:
  created:
    - src/lib/case-studies.ts
    - src/app/work/[slug]/page.tsx
    - src/components/case-study/CaseStudyHero.tsx
    - src/components/case-study/CaseStudySection.tsx
    - src/components/case-study/TechTag.tsx
  modified: []
decisions:
  - "async params (Next.js 15): params typed as Promise<{ slug: string }> and awaited — required pattern for Next.js 15 App Router"
  - "no JSX.Element return type on components — React 19 + Next.js 15 setup uses implicit return types, explicit JSX.Element causes TS errors in strict mode"
  - "Link from next/link for back navigation — ESLint next/no-html-link-for-pages rejects <a> for internal routes"
  - "vtx has no github link per research (private repo), awesome-mpp has no live url (repo is the product)"
metrics:
  duration: 209
  completed: "2026-04-07T23:51:24Z"
  tasks: 2
  files: 5
---

# Phase 03 Plan 01: Case Study Infrastructure and Content Summary

case study route, components, and all 4 project pages with real codebase content — statically generated via generateStaticParams, animated with Framer Motion stagger, designed with Phase 2 tokens.

## What Was Built

**Infrastructure:**
- `/work/[slug]` dynamic route using `generateStaticParams` — 4 pages pre-rendered at build time
- `CaseStudy` TypeScript type covering slug, hook, problem/approach/outcome/tradeoffs sections, tech tags, links, year, status
- `getCaseStudy(slug)` and `getAllSlugs()` lookup functions
- `CaseStudyHero` client component with `staggerContainer` + `fadeInUp` Framer Motion variants
- `CaseStudySection` server component renders heading, paragraph body (split on `\n\n`), optional bullet list
- `TechTag` mono-label spans — text only, no SVG logos (SLOP-09 compliant)

**Content (all sourced from actual codebases — no fabricated claims):**
- **tonos** — voice profile API, 7 MCP tools, RAG pipeline with Voyage AI embeddings, Bun/Hono/pgvector/Stripe
- **vtx** — athlete scoring platform, 3-signal composite algorithm (Strava + Instagram + competition), NestJS/GraphQL/TypeORM/Redis
- **apimesh** — 27 pay-per-call APIs with x402/USDC micropayments, autonomous brain loop, Bun/Hono/Coinbase CDP
- **awesome-mpp** — curated MPP registry, 100+ projects, autonomously maintained by APIMesh brain loop

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1: Infrastructure | fde5e0a | feat(03-01): create case study route, components, and data types |
| Task 2: Content | 1ec69aa | feat(03-01): populate all 4 case studies with real codebase content |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed explicit JSX.Element return types**
- **Found during:** Task 1 build verification
- **Issue:** `JSX.Element` return type caused TypeScript error "Cannot find namespace 'JSX'" in strict React 19 + Next.js 15 setup
- **Fix:** Removed explicit return types from all component functions — TypeScript infers them correctly
- **Files modified:** All 3 component files + page.tsx
- **Commit:** fde5e0a

**2. [Rule 1 - Bug] Replaced `<a>` with `<Link>` for back navigation**
- **Found during:** Task 1 build verification
- **Issue:** ESLint rule `@next/next/no-html-link-for-pages` rejected `<a href="/">` on an internal route
- **Fix:** Imported `Link` from `next/link` and replaced the anchor element
- **Files modified:** src/app/work/[slug]/page.tsx
- **Commit:** fde5e0a

## Verification Results

- `npm run build` — passed, 9 static pages generated including /work/tonos, /work/vtx, /work/apimesh, /work/awesome-mpp
- `npm run lint` — no ESLint warnings or errors
- Slop check — no "innovative", "passionate", "cutting-edge", "robust solution" in case study content
- Tradeoffs check — 9 tradeoffs occurrences (4+ per spec, one heading + bullets per study)
- VTX github link absent (private repo confirmed)
- awesome-mpp live URL absent (repo is the product)

## Known Stubs

None. All 4 case studies contain real content wired end-to-end from data file through route to rendered page.

## Self-Check: PASSED

Files exist:
- FOUND: src/lib/case-studies.ts
- FOUND: src/app/work/[slug]/page.tsx
- FOUND: src/components/case-study/CaseStudyHero.tsx
- FOUND: src/components/case-study/CaseStudySection.tsx
- FOUND: src/components/case-study/TechTag.tsx

Commits exist:
- FOUND: fde5e0a
- FOUND: 1ec69aa
