# Phase 6: Polish & Performance - Research

**Researched:** 2026-04-08
**Domain:** Web performance (Lighthouse/LCP), mobile responsive CSS, anti-slop copy audit
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Test at 375px (iPhone SE), 390px (iPhone 14/15), and 768px (iPad). All sections usable at each.
- **D-02:** Priority mobile sections: Hero canvas (touch), Experience (verify no horizontal carousel), Contact form (input sizing, keyboard), Navigation (mobile menu).
- **D-03:** Case study pages tested at 375px — hook above fold, no horizontal scroll, code blocks don't overflow.
- **D-04:** No horizontal scroll allowed at any tested breakpoint.
- **D-05:** Measure-first: run Lighthouse mobile audit on home and one case study before making any changes.
- **D-06:** If score < 90, fix in order: (1) font loading, (2) canvas deferred init, (3) image optimization, (4) JS bundle.
- **D-07:** Canvas already has adaptive performance (renderSkip 1-3, halved mobile grid). If still bottleneck, reduce mobile thresholds further — do NOT remove animation.
- **D-08:** Target: Lighthouse >= 90 on home + one case study. LCP < 2.5s on mobile.
- **D-09:** Automated grep scan for the 8 pattern-based anti-slop items (IDs 1-4, 6-9, 10, 12). Zero matches required.
- **D-10:** Manual visual review for 7 subjective items: (5) no uniform fade-in, (11) no shadcn default styling, (13) Max's voice copy, (14) coral at emphasis only, (15) animation tied to topo concept. Plus (10) generic CTA and (12) cursor trail.
- **D-11:** Full anti-slop pass across ALL pages — home + all 4 case studies.
- **D-12:** Fix violations found. Copy violations (COPY-10) get rewritten in Max's voice. Visual violations restyled per DESIGN.md.
- **D-13:** Each case study: hook above fold, technical approach within 2 scrolls, outcome within 3 scrolls.
- **D-14:** Failed scannability → restructure layout (reorder sections, tighten spacing). Don't rewrite content unless copy itself is the problem.

### Claude's Discretion

- Specific Lighthouse fix prioritization beyond D-06 order
- Whether to add `<link rel="preload">` for fonts or rely on next/font
- Bundle analysis tooling (next/bundle-analyzer vs manual)
- Exact responsive CSS fixes (discovered during audit)
- Whether sections need structural changes vs CSS tweaks for mobile

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COPY-10 | Zero instances of any copy pattern from the anti-slop list | Grep audit protocol documented below; known violations pre-identified in layout.tsx metadata |
| PERF-01 | Mobile responsive — all sections usable on phone | Mobile audit checklist + specific per-section findings documented below |
| PERF-02 | LCP < 2.5s on mobile | LCP optimization strategy + known bottlenecks documented; Space Grotesk + canvas identified as LCP candidates |
| PERF-03 | Lighthouse performance score >= 90 on home + one case study | Optimization prioritization informed by Phase 1 baseline (98) and known regressions from canvas addition |
| CASE-03 | Each case study scannable in 90s — hook, approach, outcome | Scannability audit methodology documented; case study structure already problem/approach/outcome/tradeoffs |
</phase_requirements>

---

## Summary

Phase 6 is a pure verification-and-fix phase. The codebase enters it in a structurally complete state — all pages exist, all content is written, and foundational performance work (adaptive canvas tiers, next/image fill, next/font) is already in place. The work is: measure, find the gaps, close them.

The Phase 1 Lighthouse baseline was 98 before the canvas animation was added. The canvas is the primary regression risk. The adaptive tier system (mobile: 80x50 grid, 20 particles) should contain performance impact, but this needs to be measured before assuming it passes. The LCP element is most likely the Space Grotesk font render or the hero canvas initial paint — both have known mitigation strategies that need to be applied if Lighthouse flags them.

Mobile responsiveness is largely in place (14 responsive breakpoints already used across sections), but several specific areas carry risk: the About photo grid uses fixed `minHeight` values that may not collapse cleanly at 375px, the Contact grid switches to single-column via `lg:grid-cols-2` (correct), and the hero canvas puzzle interaction on touch needs validation. The case study pages use a clean `max-w-[720px] px-6` layout that should be fine at 375px.

The most concrete pre-identified violation is COPY-10: `layout.tsx` metadata contains "Modern portfolio website showcasing innovative projects and technical expertise" and "cutting-edge web technologies" — these are textbook AI slop and must be rewritten in Max's voice. The `constants.ts` `SITE_CONFIG.description` carries the same text.

**Primary recommendation:** Run Lighthouse mobile audit first, fix the one COPY-10 violation in metadata that's already confirmed, then do the mobile audit pass in browser DevTools at 375px/390px/768px. The canvas and font loading are the only likely performance surprises.

---

## Standard Stack

### Core (already installed — no new dependencies needed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Next.js | 15.4.6 | Framework, static generation, next/image, next/font | Already configured |
| Framer Motion | 12.23.12 | Animations (prefers-reduced-motion via MotionProvider) | Already implemented |
| Tailwind CSS 4 | 4.x | Responsive utilities (sm:/md:/lg:) | Already in use |
| d3-contour | runtime dep | Canvas contour rendering | Already implemented |

No new packages required for this phase. This is an audit-and-fix phase.

### Optional (Claude's discretion)
| Tool | Purpose | When to Use |
|---------|---------|-------------|
| `@next/bundle-analyzer` | Visualize JS bundle chunks | Only if Lighthouse flags JS execution as the bottleneck |

**Installation if needed:**
```bash
npm install --save-dev @next/bundle-analyzer
```

---

## Architecture Patterns

### Recommended Audit Order
```
1. COPY-10 grep scan (fast, known violation exists)
2. Lighthouse mobile audit: home page
3. Lighthouse mobile audit: one case study (/work/tonos)
4. DevTools mobile simulation: 375px audit per D-02 priority list
5. DevTools mobile simulation: 390px
6. DevTools mobile simulation: 768px
7. Manual anti-slop visual review (7 subjective items)
8. Case study scannability check (4 pages)
```

### Pattern 1: Lighthouse Mobile Audit
**What:** Run Chrome DevTools Lighthouse audit with Mobile preset, no throttle throttling override
**When to use:** Before ANY performance fixes (D-05)
**Key settings:** Category: Performance. Device: Mobile. Throttling: Simulated (default).
**What to capture:** Performance score, LCP value, LCP element, TBT, CLS, opportunities list

### Pattern 2: LCP Optimization — Font
**What:** Space Grotesk loaded via `next/font/google` with `display: 'swap'` already. If font is the LCP element, add `preload` hint or verify font-display behavior.
**When to use:** If Lighthouse identifies LCP as "Text is visible during webfont load" or the LCP element is a text node
**Current state:** `layout.tsx` loads Space Grotesk with `display: 'swap'` — this is correct. Next.js 15 auto-inlines font `@font-face` declarations. No manual preload needed unless Lighthouse says otherwise.

### Pattern 3: LCP Optimization — Hero Canvas
**What:** Canvas element renders from JS — it is not an LCP candidate itself (canvas is not a text/image LCP element). The actual LCP is likely the first visible text below the fold after puzzle solve, or the hero background.
**When to use:** If Lighthouse flags canvas init as blocking
**Current state:** `TopoCanvas` uses `useEffect` which runs after hydration — correct. The `isMobile` state initializes in a `useEffect` too, so canvas starts on first render regardless. No known blocking.

### Pattern 4: Next.js Image Optimization
**What:** All images must have `sizes` prop when using `fill` layout to prevent oversized image downloads.
**When to use:** If Lighthouse shows "Properly size images" in opportunities
**Current state:** About section uses `fill` + `object-cover` with fixed-height containers but NO `sizes` prop. This is a likely opportunity.

```typescript
// Source: Next.js docs — next/image with fill
// Add sizes prop to all fill images in About.tsx
<Image
  src="/images/Me.jpg"
  alt="max beato portrait"
  fill
  priority
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 250px"
  className="object-cover"
/>
```

### Pattern 5: Hero Background Gradient — Anti-Slop Check
**What:** `Hero.tsx` uses `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)` as a dot grid background. This is a dot pattern, not a color gradient. Anti-slop item 2 prohibits gradient backgrounds. The dot grid is borderline — it is a visual decoration, not a gradient.
**Assessment:** The dot pattern is used as a CSS background behind the canvas. Since the canvas covers it entirely (z-index 0 with opacity mask), the dot pattern is only visible during the pre-canvas paint frame. This is low risk but should be reviewed — if the canvas fully covers it, the dot grid could be removed to simplify the hero without visual loss.

### Pattern 6: Mobile Touch Interaction — Canvas
**What:** Canvas puzzle drag uses mouse events. Touch events need validation at 375px.
**When to use:** During mobile audit
**Current state:** `DraggableLetters.tsx` handles `onMouseDown`/`onMouseMove`/`onMouseUp`. Touch equivalents (`onTouchStart`/`onTouchMove`/`onTouchEnd`) need to be verified. If touch events aren't wired, puzzle is unplayable on mobile — user must use the Skip button.

### Anti-Patterns to Avoid
- **Fixing before measuring:** Always run Lighthouse first. Changes made blind may not address actual bottlenecks.
- **Removing canvas animation:** D-07 explicitly prohibits this. Reduce thresholds if needed, do not remove.
- **Adding preload hints without measuring:** `<link rel="preload">` for fonts added unnecessarily can hurt performance by competing with critical resources.

---

## Pre-Identified Findings by Requirement

### COPY-10: Confirmed Violations

From codebase audit, these copy violations are already confirmed:

| File | Line | Violation | Rewrite Needed |
|------|------|-----------|----------------|
| `src/app/layout.tsx` | 26 | `"Modern portfolio website showcasing innovative projects and technical expertise in full-stack development, built with Next.js and cutting-edge web technologies."` | Yes — metadata description |
| `src/app/layout.tsx` | 46 | Same description in OpenGraph | Yes |
| `src/app/layout.tsx` | 60 | Same in Twitter card | Yes |
| `src/lib/constants.ts` | 7 | `SITE_CONFIG.description` same text | Yes |

**Grep patterns to run (from `ANTI_SLOP_CHECKLIST`):**
```bash
# Item 1 — No Inter
grep -rn "Inter" src/ --include="*.tsx" --include="*.ts" --include="*.css"

# Item 2 — No gradient (flag for manual review — mask/linear-gradient for CSS masking is OK)
grep -rn "gradient" src/ --include="*.tsx" --include="*.ts" --include="*.css"

# Item 3 — No bento
grep -rn "bento" src/ --include="*.tsx" --include="*.ts"

# Item 4 — No typewriter
grep -rn "typewriter" src/ --include="*.tsx" --include="*.ts"

# Item 6 — No particle decoration (particles serve physics — verify grep hits are in canvas)
grep -rn "particle|starfield|floating" src/ --include="*.tsx" --include="*.ts"

# Item 7 — No glassmorphism
grep -rn "glassmorphism|frosted" src/ --include="*.tsx" --include="*.ts"

# Item 8 — No skill bars
grep -rn "skill-bar|progress-bar" src/ --include="*.tsx" --include="*.ts"

# Item 9 — No tech logo grid
grep -rn "logo-grid|tech-grid" src/ --include="*.tsx" --include="*.ts"

# Item 10 — No generic CTA
grep -rn "build something amazing|available for opportunities" src/ --include="*.tsx" --include="*.ts"

# Item 12 — No cursor trail
grep -rn "cursor-trail|cursor-follow" src/ --include="*.tsx" --include="*.ts"
```

**Grep hits already audited:**
- `Inter`: No source hits — all hits are in `useIntersectionObserver` function name pattern (not the font). CLEAN.
- `gradient`: Hits are in `DraggableLetters.tsx` (CSS mask technique), `TopoCanvas.tsx` (CSS fade mask), `Hero.tsx` (dot grid backdrop, see Pattern 5 above). None are decorative color gradients. CLEAN for anti-slop; dot grid in Hero needs manual judgment.
- `bento`: No hits. CLEAN.
- `typewriter`: No hits. CLEAN.
- `particle`: Hits are in `useTopoAnimation.ts` — these are physics simulation particles (SLOP-06 explicitly approved as physics-driven, not decorative). CLEAN.
- `glassmorphism|frosted`: No hits. CLEAN.
- `skill-bar|progress-bar`: No hits. CLEAN.
- `logo-grid|tech-grid`: No hits. CLEAN.
- `build something amazing|available for opportunities`: No hits in components. CLEAN.
- `cursor-trail|cursor-follow`: No hits. CLEAN (one hit in DraggableLetters is a comment "cursor-following spotlight" — not a pattern match for cursor trail).
- `innovative|cutting-edge|modern portfolio`: Confirmed in `layout.tsx` and `constants.ts`. **VIOLATION.**

**Recommended metadata rewrite for layout.tsx:**
The current description is AI-template language. Replace with specific, voice-accurate description:
```
// Before:
"Modern portfolio website showcasing innovative projects and technical expertise in full-stack development, built with Next.js and cutting-edge web technologies."

// After (Max's voice — lowercase, specific, no buzzwords):
"max beato — purdue cs, building fast systems. tonos (voice api), vtx athlete platform, apimesh (mcp orchestration)."
```

### PERF-01: Mobile Responsive Pre-Audit Findings

From static analysis of the codebase, these areas carry mobile risk. Actual breakage must be verified in DevTools.

| Section | Risk | Likely Issue | Fix Type |
|---------|------|-------------|----------|
| About (photo grid) | MEDIUM | Fixed `minHeight: '400px'` on portrait photo won't collapse cleanly at 375px; 2-column grid on small screen means each photo is ~175px wide | CSS fix |
| About (layout) | LOW | `lg:flex-row` correctly collapses to single column on mobile. Text column at 100% is correct. | Verify only |
| Hero canvas | MEDIUM | `DraggableLetters` touch interaction — needs validation. Skip button available as fallback. | Verify + fix if broken |
| Experience | LOW | Single-column already, `paddingLeft: var(--spacing-6)` reduces available text width. No carousel. | Verify only |
| Contact grid | LOW | `lg:grid-cols-2` collapses correctly. `sm:grid-cols-2` on name/email fields collapses at 640px. | Verify only |
| Navigation | LOW | Mobile menu implemented with hamburger. Width collapses correctly. | Verify only |
| Case studies | LOW | `max-w-[720px] px-6` — 720px collapses fine. Long code/tech strings in `CaseStudySection` could overflow if content has no break points. | Verify |
| Case study hero | LOW | `CaseStudyHero` flex-wraps tech tags — correct. Links wrap. | Verify only |

**Critical mobile check:** The About photo grid is the highest-risk section at 375px. The `grid-cols-2` layout with `row-span-2` creates a complex photo mosaic. At 375px viewport with `px-6` padding, the grid is 363px wide. Each column is ~179px. The `minHeight: '400px'` on the portrait forces the left column to 400px height, which may be too tall for the viewport. The right column stacks at 195px + 93px + 93px = 381px minimum. This layout was designed for the 40% desktop column — on mobile it needs to either collapse to single column or have reduced minHeights.

### PERF-02 / PERF-03: Performance Optimization Strategy

**Known starting point:** Phase 1 baseline was Lighthouse 98 before canvas. Canvas is the primary regression risk.

**Prioritized fix areas (D-06 order):**

1. **Font loading** — Space Grotesk via `next/font` with `display: 'swap'` is already correct. Next.js 15 self-hosts Google Fonts and inlines the `@font-face` in `<head>`. This should be optimal out of the box. Only investigate if Lighthouse specifically calls out font as LCP blocker.

2. **Canvas animation LCP impact** — The canvas element itself is not an LCP candidate (canvas is not evaluated for LCP). The hero section LCP is likely the page background or the first text element visible on load. Since puzzle is unsolved on first load, the DraggableLetters elements are the first visible content. The subtitle and scroll arrow are hidden until solve. LCP should be the hero name letters.

3. **Image optimization** — `next/image` with `fill` is in use. The `priority` prop is correctly set on `Me.jpg` (above-fold image). Missing `sizes` prop on all fill images in About section. This is a concrete improvement opportunity:
   ```typescript
   // About.tsx — all fill images need sizes:
   sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 200px"
   ```

4. **JS bundle** — No 3D libraries remain (removed in Phase 1). Current heavy deps: d3-contour, Framer Motion, simplex-noise. These are necessary for the hero animation. Only investigate with bundle-analyzer if Lighthouse shows high TBT.

### CASE-03: Case Study Scannability

The case study page structure at `src/app/work/[slug]/page.tsx` renders: `CaseStudyHero` → `problem` section → `approach` section → `outcome` section → `tradeoffs` section.

**Above-the-fold hook (D-13):** `CaseStudyHero` renders title, hook paragraph, tech tags, and links before any `CaseStudySection`. With `pt-24` on the main and no hero image, the hook (the `hook` field in case study data) should be visible above the fold at 375px if the h1 is reasonably sized. At `text-h1` (2.5rem) and the hook at `text-body-lg` (1.125rem), approximately 5-7 lines of content appear above fold on mobile.

**2-scroll requirement:** `CaseStudySection` for `problem` renders with `py-12` padding. On mobile, a 375px screen is ~667px tall (iPhone SE). Each section with `py-12` (96px vertical padding) + heading + 2-3 paragraphs = ~400-600px per section. So "approach" should be reachable within 1-2 scrolls from page top. This likely passes.

**Verify all 4 slugs:** `tonos`, `vtx`, `apimesh`, `awesome-mpp`. Content length varies — longer `approach` sections may push `outcome` further down.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font optimization | Custom font loading | `next/font` (already in use) | Handles self-hosting, FOUT, `display: swap` automatically |
| Image sizing | Manual responsive images | `next/image` `sizes` prop (already in use, add `sizes`) | Handles WebP conversion, lazy loading, srcset generation |
| Performance metrics | Custom timing code | Lighthouse CLI or Chrome DevTools | Already has PerformanceProvider for runtime metrics |
| Mobile viewport simulation | Physical device testing | Chrome DevTools Device Mode | Sufficient for audit; real device testing optional |
| Bundle analysis | Manual investigation | `@next/bundle-analyzer` | Only if TBT is flagged by Lighthouse |

---

## Common Pitfalls

### Pitfall 1: Treating CSS Masks as Gradient Violations
**What goes wrong:** The grep for `gradient` returns hits in `TopoCanvas.tsx` and `DraggableLetters.tsx`. Reviewer flags these as anti-slop violations.
**Why it happens:** `linear-gradient` and `radial-gradient` are used as CSS `mask-image` values — they control transparency/fading, not color decoration.
**How to avoid:** Verify each grep hit is a `background-image: gradient` (decorative) vs `mask-image: gradient` (functional transparency). The hits in canvas components are all mask-image values — not violations.
**Warning signs:** If a gradient appears in a `background:` or `background-image:` property outside canvas mask context, that is a violation.

### Pitfall 2: Fixing Performance Without Measuring First
**What goes wrong:** Preload hints added speculatively, bundle-analyzer run unnecessarily, canvas reduced before checking if it's actually the bottleneck.
**Why it happens:** Eager optimization without a baseline.
**How to avoid:** D-05 is locked — measure first. Run Lighthouse before touching any code.
**Warning signs:** Any performance code change made before seeing Lighthouse output.

### Pitfall 3: About Photo Grid Breaking at 375px
**What goes wrong:** The `minHeight: '400px'` on the portrait photo and `grid-cols-2` layout was designed for the 40% desktop column. On mobile, the full-width grid with `minHeight: '400px'` creates a very tall section with narrow photos.
**Why it happens:** The about layout uses `lg:w-[40%]` for the photo column — on mobile this becomes 100% width, but the photo heights were sized for a narrow column.
**How to avoid:** Audit About section specifically at 375px. Fix may be: reduce `minHeight` on mobile, or switch to single-column photo stack below lg breakpoint.
**Warning signs:** Horizontal scroll on about section, photos appearing very narrow and tall.

### Pitfall 4: Canvas Touch Events Not Handled
**What goes wrong:** Puzzle is technically playable on mobile but only via mouse events. Touch users can't drag letters.
**Why it happens:** `DraggableLetters.tsx` handles `onMouseDown`/`onMouseMove`/`onMouseUp`. Touch equivalents need verification.
**How to avoid:** Test puzzle drag at 375px in DevTools touch simulation. If touch doesn't work, the Skip button (appears after 5 seconds) is the fallback — this is acceptable per D-07 (don't remove animation). Add touch event handlers if feasible, but skip button is the fallback path.
**Warning signs:** Letter doesn't move when dragged with simulated touch in DevTools.

### Pitfall 5: Metadata Copy Outside Grep Scope
**What goes wrong:** `layout.tsx` metadata strings aren't scanned by standard grep patterns since they don't contain exact phrases like "build something amazing".
**Why it happens:** `ANTI_SLOP_CHECKLIST` grep patterns target specific phrases, not general "AI voice" tone.
**How to avoid:** Manual review of `layout.tsx` title/description and `constants.ts` SITE_CONFIG. Confirmed violation already found: "innovative projects", "technical expertise", "cutting-edge web technologies".
**Warning signs:** OG/Twitter card descriptions that sound like template boilerplate.

---

## Code Examples

### Rewriting Slop Metadata (COPY-10)
```typescript
// src/app/layout.tsx — replace description fields
// Source: DESIGN.md voice rules — lowercase, direct, specific

// Current (slop):
description: "Modern portfolio website showcasing innovative projects and technical expertise in full-stack development, built with Next.js and cutting-edge web technologies."

// Replacement (Max's voice):
description: "max beato — purdue cs. i build fast systems: tonos (voice profiling api), vtx (athlete composite scoring), apimesh (mcp tool orchestration)."
```

### Adding sizes to fill Images (PERF-02/03)
```typescript
// src/components/sections/About.tsx
// Source: Next.js docs — https://nextjs.org/docs/app/api-reference/components/image#sizes
// Portrait photo (left column, full height)
<Image
  src="/images/Me.jpg"
  alt="max beato portrait"
  fill
  priority
  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"
  className="object-cover"
/>

// Smaller photos (right column)
<Image
  src="/images/Climbing.jpg"
  alt="rock climbing in a gym"
  fill
  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 18vw, 200px"
  className="object-cover"
/>
```

### Mobile-Safe About Photo Grid
```typescript
// src/components/sections/About.tsx
// Fix minHeight values for mobile — use responsive CSS or conditional styles

// Option A: Tailwind responsive classes (preferred)
<div className="row-span-2 relative" style={{ minHeight: 'clamp(200px, 50vw, 400px)' }}>

// Option B: Collapse to single column on mobile
<div className="lg:grid lg:grid-cols-2 gap-3 flex flex-col">
  {/* On mobile: stacks vertically, reasonable height each */}
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|-----------------|-------|
| Manual `<link rel="preload">` for fonts | `next/font` with `display: 'swap'` | Next.js 15 handles self-hosting automatically |
| `fill` images without `sizes` | `fill` + `sizes` prop | `sizes` is required for proper srcset generation |
| CSS `border: 1px solid` | Shadow-as-border technique (`box-shadow: 0px 0px 0px 1px`) | Already established in this project |

**Note on `display: 'swap'` in next/font:** This is the correct setting. It prevents invisible text during font load. CLS impact is zero because next/font reserves space with a size-adjusted fallback.

---

## Validation Architecture

nyquist_validation is enabled in config.json.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed — this is a UI-only audit phase |
| Config file | None |
| Quick run command | `npm run build && npx lighthouse http://localhost:3000 --only-categories=performance --form-factor=mobile --output=json` (after `npm run dev`) |
| Full suite command | Chrome DevTools Lighthouse mobile audit (manual) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COPY-10 | Zero anti-slop grep matches | automated grep | `grep -rn "innovative\|cutting-edge\|modern portfolio" src/ --include="*.tsx" --include="*.ts"` | N/A (grep) |
| PERF-01 | No horizontal scroll at 375px/390px/768px | manual visual | DevTools Device Mode simulation | N/A (manual) |
| PERF-02 | LCP < 2.5s mobile | automated audit | Lighthouse mobile | N/A (audit) |
| PERF-03 | Lighthouse >= 90 home + case study | automated audit | Lighthouse mobile | N/A (audit) |
| CASE-03 | Hook above fold, approach ≤ 2 scrolls | manual visual | Browser at 375px | N/A (manual) |

### Wave 0 Gaps
None — no test files need to be created. This phase uses Lighthouse audits and browser DevTools for validation. All verification is done by the executor during the phase rather than unit tests.

---

## Open Questions

1. **Touch events on DraggableLetters**
   - What we know: `DraggableLetters.tsx` uses `onMouseDown`/`onMouseMove`/`onMouseUp`. Skip button appears after 5s.
   - What's unclear: Whether touch events are wired or whether the component silently fails on touch. Need to test in DevTools.
   - Recommendation: If touch drag doesn't work, verify Skip button is accessible. Touch drag is a nice-to-have; Skip is the designed fallback.

2. **Hero dot-grid background**
   - What we know: `Hero.tsx` sets `backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)'` — this is a dot grid backdrop. The anti-slop rule is "no gradient backgrounds". This is technically a gradient used as a dot pattern.
   - What's unclear: Whether this is considered a violation. The canvas renders over it entirely.
   - Recommendation: Since the canvas covers it at full opacity with its own mask, the dot grid is invisible in practice. Could be removed entirely to eliminate ambiguity without visual impact.

3. **Lighthouse score after canvas addition**
   - What we know: Phase 1 baseline was 98. Canvas + puzzle system has been added since.
   - What's unclear: Current Lighthouse score. Canvas is adaptive (mobile tier: 80x50 grid, 20 particles) and uses `useEffect` for initialization, which shouldn't block LCP.
   - Recommendation: Measure first (D-05). If score is already >= 90, no optimization work needed beyond the confirmed COPY-10 violation.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev server | Yes | 25.5.0 | — |
| npm | Package management | Yes | (installed) | — |
| Chrome DevTools | Mobile audit, Lighthouse | Yes (browser tool) | — | Firefox DevTools (less accurate for Lighthouse) |
| Next.js dev server | Lighthouse audit target | Yes (npm run dev) | 15.4.6 | — |

No missing dependencies. Lighthouse is available via Chrome DevTools or `npm install -g lighthouse`. No additional installs required.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase audit — `src/app/layout.tsx`, `src/lib/constants.ts`, all section components, `ANTI_SLOP_CHECKLIST` in `design-constraints.ts`
- `DESIGN.md` section 9 — Anti-slop checklist (15 items with grep patterns)
- `DESIGN.md` section 8 — Responsive behavior spec
- `.planning/phases/06-polish-performance/06-CONTEXT.md` — All locked decisions

### Secondary (MEDIUM confidence)
- Next.js 15 `next/font` documentation — `display: 'swap'` is standard and well-documented
- Next.js `next/image` `sizes` prop documentation — standard optimization

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- COPY-10 violations: HIGH — confirmed by direct grep audit of codebase
- Mobile risk areas: MEDIUM — identified by static analysis, not live testing
- Performance impact of canvas: MEDIUM — based on adaptive tier design, not live measurement
- Fix strategies: HIGH — standard Next.js optimization patterns

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable stack — Next.js 15, Tailwind 4 patterns don't change quickly)
