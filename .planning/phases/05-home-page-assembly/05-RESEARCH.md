# Phase 5: Home Page Assembly — Research

**Researched:** 2026-04-08
**Domain:** Next.js 15 / React 19 / Framer Motion / Tailwind CSS 4 — section assembly, scroll animation, content integration
**Confidence:** HIGH

---

## Summary

Phase 5 is a content and styling assembly phase, not a new-technology phase. All dependencies (Framer Motion variants, design tokens, TopoSvgDivider, PuzzleContext, case study data, photo assets, resume PDF) are already in the repository. The work is overwhelmingly **wiring existing pieces together and writing copy**, not building new infrastructure.

The five section files (About, Experience, Projects, Contact, Hero) are intentional stubs left from Phase 1 cleanup — each has a comment indicating "Phase 5" work. The Contact section is the most complete (full form functionality intact) but needs a copy pass and visual cleanup. Navigation is functionally complete but has a button style misalignment (coral-filled when DESIGN.md specifies secondary/outlined for the resume button).

**Primary recommendation:** Plan this as a per-section implementation wave with a shared "token and pattern" reference drawn directly from the UI-SPEC. Each section is self-contained and can be planned and executed independently. The only cross-cutting concern is the TopoSvgDivider placement in page.tsx, which depends on at least About and Experience being structurally in place.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COPY-02 | Hero post-solve subtitle — specific, in Max's voice, appears after puzzle unlock | Hero.tsx has `{/* Phase 5: hero subtitle, CTA */}` placeholder; `puzzleSolved` boolean + `showArrow` delay pattern already implemented — subtitle uses same 1800ms timer |
| COPY-03 | About section authentic personal content (climbing, lifting, cats, engineering philosophy) | All four bio paragraphs preserved as JSX comments in About.tsx; photo paths confirmed at `/public/images/` (Me.jpg, Climbing.jpg, Lifting.jpg, Cats.jpg) |
| COPY-09 | Experience descriptions for VertikalX, DocReserve, Data Mine with specific technical detail | UI-SPEC has VertikalX description locked; DocReserve/Data Mine dates and descriptions are executor-confirm items — planner must treat as fill-in slots |
| HOME-01 | Hero — post-solve subtitle/tagline visible after puzzle unlock | puzzleSolved from PuzzleContext; showArrow state already gated at 1800ms; subtitle needs parallel useState with same timer |
| HOME-02 | About — personal bio, real photos, engineering philosophy | Photos confirmed in public/images; bio copy in About.tsx comments; next/image available in stack |
| HOME-03 | Projects — cards linking to /work/[slug] with hook + tech + outcome hint | CASE_STUDIES array in case-studies.ts has all 4 projects with `hook`, `tech`, `year`, `status` fields ready to consume |
| HOME-04 | Experience — VertikalX, DocReserve, Data Mine with dates and technical specifics | UI-SPEC provides VertikalX full entry; DocReserve and Data Mine are fill-in-at-execution |
| HOME-05 | Contact — form functional, needs voice/style pass | Contact.tsx form logic is complete and correct; only copy + visual cleanup needed |
| HOME-06 | Navigation — functional with resume download, style refinement | Navigation.tsx fully functional; resume.pdf confirmed at /public/resume.pdf; button style needs change from coral-filled to secondary outlined |
| HOME-07 | Recruiter can reach case studies within 2 scrolls + 1 click from hero | Single-column Projects stack at max-width 720px is the layout that makes this achievable; each ProjectCard is an `<a>` wrapping the full card to /work/[slug] |
| SECT-01 | Section transitions use contour-line accents | TopoSvgDivider.tsx built; DIVIDER_PATHS in topo-paths.ts has all 3 transition sets; page.tsx has commented import ready to uncomment |
| SECT-02 | Each section has distinct scroll animation treatment | UI-SPEC Animation Matrix specifies: About-text=slideInLeft, About-photos=fadeIn, Experience=slideInLeft+stagger, Projects=fadeInUp+stagger, Contact=fadeInUp; all variants exist in motion.ts |
| SLOP-03 | No bento grid layout | Projects section: single column stack, max-width 720px, NOT a grid |
| SLOP-05 | No uniform fade-in-on-scroll | Enforced by Animation Matrix — 3 different variants across sections |
| SLOP-08 | No skill bars or percentage indicators | Skills shown as mono-label tags on project cards and experience entries only |
| SLOP-09 | No technology logo grid | Tech shown as mono-label text tags (Label token, mono font, stone-100 bg, stone-700 text, 3px radius) |
| SLOP-10 | No generic CTAs | All CTAs specified in UI-SPEC Copywriting Contract — "view case study →", "send message", "resume" |
| SLOP-11 | No shadcn/MUI default styling | All components hand-crafted from design tokens — no component library imports |
| PERF-04 | Resume PDF downloadable from nav or contact section | /public/resume.pdf confirmed present; Navigation.tsx already implements download via anchor createElement pattern |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- Tech stack locked: Next.js 15, React 19, Tailwind CSS 4, Framer Motion. No Three.js/R3F.
- No component libraries for general UI — hand-crafted only. shadcn only through MCP for specific enhanced components (none needed in this phase). Cards, layout, text styling must be bespoke.
- Anti-AI-slop: Must explicitly avoid top 50 AI design trends (enforced via ANTI_SLOP_CHECKLIST in design-constraints.ts).
- Content accuracy: All project info from actual repos / real data, not fabricated.
- Voice: All copy lowercase, direct, no buzzwords — Max's actual writing voice.
- No `Co-Authored-By: Claude` in commit messages.

---

## Standard Stack

### Core (already installed — no new dependencies needed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | 15.4.6 | App Router, SSR, `next/image` for optimized photos | In use |
| React | 19.1.0 | Component model | In use |
| Framer Motion | 12.38.0 | All scroll animations via existing motion.ts variants | In use |
| Tailwind CSS 4 | latest | Design token consumption via CSS var() | In use |
| lucide-react | 0.539.0 | Icons (Mail, MapPin, Github, Linkedin, Download, Send, CheckCircle, AlertCircle) | In use |
| @emailjs/browser | 4.4.1 | Contact form email delivery — already wired in Contact.tsx | In use |

**No new packages required for Phase 5.** All dependencies are already installed.

### Key Internal Modules (already built — consume, don't rebuild)

| Module | Path | What It Provides |
|--------|------|-----------------|
| motion.ts | `@/lib/motion` | `fadeIn`, `fadeInUp`, `slideInLeft`, `drawPath`, `staggerContainer`, `transitions` |
| case-studies.ts | `@/lib/case-studies` | `CASE_STUDIES` array with all 4 projects (hook, tech, year, status, slug) |
| constants.ts | `@/lib/constants` | `SITE_CONFIG`, `NAVIGATION`, `SOCIAL_LINKS`, `EMAIL_CONFIG`, `FORM_VALIDATION` |
| topo-paths.ts | `@/lib/topo-paths` | `DIVIDER_PATHS.heroToAbout`, `.aboutToExperience`, `.experienceToProjects` |
| TopoSvgDivider.tsx | `@/components/dividers/TopoSvgDivider` | Ready-to-use divider component |
| PuzzleContext | `@/contexts/PuzzleContext` | `puzzleSolved` boolean via `usePuzzle()` |
| useScrollAnimation | `@/hooks/useIntersectionObserver` | `{ ref, isIntersecting }` — triggerOnce default |
| utils.ts | `@/lib/utils` | `cn()`, `generateElementId()` |

---

## Architecture Patterns

### Pattern 1: Scroll Animation — Standard Section Treatment

Every section uses `useScrollAnimation` to get `isIntersecting`, then drives `motion.div` variants from motion.ts. The parent container gets `staggerContainer` where multiple children stagger. This is the established pattern from Contact.tsx.

```typescript
// Source: Contact.tsx (existing, Phase 4 established)
const { ref, isIntersecting } = useScrollAnimation({ threshold: 0.2 })

<motion.div
  ref={ref}
  variants={staggerContainer}
  initial="initial"
  animate={isIntersecting ? "animate" : "initial"}
>
  <motion.div variants={slideInLeft}> ... </motion.div>
  <motion.div variants={slideInLeft}> ... </motion.div>
</motion.div>
```

**Animation Matrix (enforces SECT-02 / SLOP-05):**

| Section | Parent | Children | Threshold |
|---------|--------|----------|-----------|
| About — text column | `staggerContainer` | `slideInLeft` | 0.2 |
| About — photos | `staggerContainer` | `fadeIn` | 0.2 |
| Experience list | `staggerContainer` | `slideInLeft` | 0.2 |
| Projects list | `staggerContainer` | `fadeInUp` | 0.15 |
| Contact header | none | `fadeInUp` | 0.2 |
| Contact columns | `staggerContainer` | `fadeInUp` (0.1s delay) | 0.2 |

**Critical:** `staggerContainer` from motion.ts has `staggerChildren: 0.08` and `delayChildren: 0.1` hardcoded. To get the 0.1s column stagger in Contact, pass `transition` override or use a second stagger container with adjusted values.

### Pattern 2: Design Token Consumption

Tailwind CSS 4 with `@theme` block makes CSS vars available as Tailwind utilities. The pattern used throughout the codebase:

```typescript
// Source: globals.css @theme, Contact.tsx pattern
// CSS var directly in style prop for compound values (shadows, exact sizes)
style={{ boxShadow: 'var(--shadow-border)' }}

// Tailwind token via utility class for spacing, color, radius
className="bg-stone-900 text-map-white rounded-lg px-4 py-2"
```

**Shadow-as-border rule (DESIGN.md section 4):** Never use CSS `border` property for card/container containment. Always use `boxShadow` with the shadow vars. This applies to: project cards, contact form card, experience entries on hover, form inputs.

```typescript
// Input at rest
style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px' }}
// Input focused
style={{ boxShadow: '#E8523F 0px 0px 0px 1px' }}
// Input error
style={{ boxShadow: '#DC2626 0px 0px 0px 1px' }}
```

### Pattern 3: Typography Token Application

CSS `@theme` companion properties set line-height and letter-spacing alongside font-size — apply with `style` prop (not Tailwind utilities for the size-specific companions):

```typescript
// Source: Hero.tsx, established Phase 2 pattern
style={{
  fontSize: 'var(--text-h1)',
  lineHeight: 'var(--text-h1--line-height)',
  letterSpacing: 'var(--text-h1--letter-spacing)',
  fontWeight: 600,
}}
```

For tokens without companion properties (body, label), Tailwind class equivalents work since there are no specific tracking overrides:

```typescript
// Body text — no letter-spacing override, Tailwind works
className="text-base leading-relaxed font-normal text-stone-700"
// But for --text-body-lg (1.125rem = not a standard Tailwind step), use inline style
style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--text-body-lg--line-height)' }}
```

### Pattern 4: Hero Subtitle (timed reveal from PuzzleContext)

Hero.tsx already has a `showArrow` state gated at 1800ms post-solve. The subtitle uses the **same 1800ms timer** (same `useEffect`) and the `fadeIn` variant (not `fadeInUp` — active canvas below makes transforms jarring).

```typescript
// Source: Hero.tsx extended pattern
const [showSubtitle, setShowSubtitle] = useState(false)

useEffect(() => {
  if (!puzzleSolved) return
  const timer = setTimeout(() => {
    setShowArrow(true)
    setShowSubtitle(true)  // same timer, both trigger together
  }, 1800)
  return () => clearTimeout(timer)
}, [puzzleSolved])
```

Position: absolutely centered, below the invisible name bounding box (roughly `top-[60%]` or `top-[65%]` — needs visual calibration at execution time), above the explore arrow at `bottom-10`.

**Reduced motion:** `MotionConfig reducedMotion="user"` is set globally in MotionProvider. The `fadeIn` variant (opacity only) is already the safe choice. No additional conditional logic needed in components — Framer Motion respects it automatically.

### Pattern 5: next/image for Photos

```typescript
// Source: Next.js 15 App Router pattern
import Image from 'next/image'

<Image
  src="/images/Me.jpg"
  alt="max beato portrait"
  width={400}
  height={500}
  priority   // only on Me.jpg (above-fold portrait)
  className="object-cover rounded-[var(--radius-comfortable)]"
  style={{ objectPosition: 'center 15%' }}  // preserved from Phase 1 comment
/>
```

All four photos confirmed present at `/public/images/`: Me.jpg, Climbing.jpg, Lifting.jpg, Cats.jpg.

### Pattern 6: Navigation — Secondary Button Fix

Current Navigation.tsx uses `bg-coral-peak` for the resume button. DESIGN.md section 4 specifies "secondary button style, right-aligned" for nav resume. The fix:

```typescript
// Current (incorrect)
className="... bg-coral-peak hover:bg-coral-deep text-map-white rounded-lg ..."

// Corrected (secondary outlined)
style={{ boxShadow: 'var(--shadow-border-dark)' }}
className="... bg-transparent hover:bg-stone-100 text-stone-900 transition-colors ..."
```

The `whileHover={{ scale: 1.05 }}` on the resume button in nav is acceptable (it's a button, not decorative content). The scale hover removals in UI-SPEC apply specifically to Contact section items.

### Pattern 7: TopoSvgDivider Activation in page.tsx

```typescript
// Source: page.tsx commented import + topo-paths.ts
import TopoSvgDivider from '@/components/dividers/TopoSvgDivider'
import { DIVIDER_PATHS } from '@/lib/topo-paths'

// Between Hero and About:
<TopoSvgDivider id="divider-hero-to-about" paths={DIVIDER_PATHS.heroToAbout} />
// Between About and Experience:
<TopoSvgDivider id="divider-about-to-experience" paths={DIVIDER_PATHS.aboutToExperience} />
// Between Experience and Projects:
<TopoSvgDivider id="divider-experience-to-projects" paths={DIVIDER_PATHS.experienceToProjects} />
```

No divider between Projects and Contact per UI-SPEC decision.

### Pattern 8: Experience Entry Data Structure

The `Experience` type in types.ts exists but is not used yet for the section. The UI-SPEC specifies an inline data structure for the three entries. Best approach: define a local `ExperienceEntry` interface inside Experience.tsx and a const array — mirrors how case-studies.ts works. Do NOT reuse the `Experience` type from types.ts (it has fields like `type: 'work' | 'education'` that the new design doesn't use).

### Pattern 9: Inline ID Generation

All interactive elements require IDs using `generateElementId(section, element, purpose)`. The pattern throughout the codebase:

```typescript
import { generateElementId } from '@/lib/utils'
// e.g.
id={generateElementId('about', 'section', 'container')}
id={generateElementId('experience', 'entry', 'vertikalx')}
id={generateElementId('projects', 'card', 'tonos')}
```

### Recommended Project Structure (Phase 5 changes only)

No structural changes to `src/` directory. All work is within existing section files plus page.tsx.

```
src/
├── app/
│   └── page.tsx              — uncomment TopoSvgDivider imports, add 3 divider placements
├── components/
│   └── sections/
│       ├── Hero.tsx           — add subtitle state + JSX below canvas
│       ├── About.tsx          — full rebuild from stub
│       ├── Experience.tsx     — full rebuild from stub
│       ├── Projects.tsx       — full rebuild from stub
│       ├── Contact.tsx        — copy rewrite + visual cleanup (form logic untouched)
│       └── Navigation.tsx     — resume button style fix only
└── lib/
    └── constants.ts           — no changes required
```

### Anti-Patterns to Avoid

- **Tailwind `border-*` utilities for card containment:** Use `boxShadow` inline style with shadow vars instead. `border-stone-300` creates a visible border that's visually heavier than shadow-as-border.
- **`focus:ring-*` Tailwind utilities on inputs:** The project uses inline `boxShadow` for focus states (coral shadow, not blue ring). Remove `focus:ring-2 focus:border-transparent` Tailwind classes from Contact.tsx inputs.
- **`whileHover={{ scale: 1.02 }}` on non-interactive content:** UI-SPEC explicitly calls out removing this from contact detail rows and the submit button. Scale on non-interactive text creates uncanny hover behavior.
- **Centering body text:** All body text is left-aligned per DESIGN.md. The current Contact.tsx section header is `text-center` — this must change to left-aligned per the copy contract.
- **`min-h-screen` on content sections:** About and Experience stubs have `min-h-screen`. This forces sections to be full viewport height even when content is shorter. Remove — use vertical padding only.
- **Importing from `@/components/dividers/TopoSvgDivider` in server components incorrectly:** TopoSvgDivider is a client component (uses Framer Motion + useScrollAnimation). page.tsx is a server component — this import is fine (Next.js handles the client boundary). DIVIDER_PATHS is a pure data file imported separately; the Phase 4 decision (DIVIDER_PATHS extracted to topo-paths.ts) was specifically to avoid client-boundary prerender failures.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animation | Custom IntersectionObserver hooks | `useScrollAnimation` from `@/hooks/useIntersectionObserver` | Already built, triggerOnce by default |
| SVG path drawing animation | Custom CSS animation | `drawPath` variant from `@/lib/motion` | Already defined, works with Framer Motion |
| Section-to-section stagger | Custom timing logic | `staggerContainer` + `staggerChildren: 0.08` | Already in motion.ts |
| Reduced motion detection | `useReducedMotion()` hook | `MotionConfig reducedMotion="user"` (global, in MotionProvider) | Already applied globally via layout.tsx |
| Photo optimization | `<img>` tags | `next/image` with `priority` on above-fold | Built-in lazy loading, automatic format conversion, layout-shift prevention |
| Resume download | Fetch + blob | `<a href="/resume.pdf" download="...">` via `document.createElement('a')` | Pattern already in Navigation.tsx — copy exactly |
| Icon components | Custom SVGs | `lucide-react` — already installed, same icons used in Contact.tsx | Consistent icon weight, already tree-shaken |
| Case study data | Re-querying or duplicating | `CASE_STUDIES` from `@/lib/case-studies` | Single source of truth, already validated in Phase 3 |

**Key insight:** This phase is 90% assembly of existing pieces. The only genuinely new code is the structural JSX and inline styles for the three empty stubs (About, Experience, Projects). Contact is a copy/style pass. Hero gets ~10 lines.

---

## Common Pitfalls

### Pitfall 1: Stale `min-h-screen` on Content Sections
**What goes wrong:** About.tsx and Experience.tsx stubs both have `min-h-screen` class. Keeping it results in massive empty sections when content is shorter than 100vh — breaks visual rhythm.
**Why it happens:** Stubs were left with placeholder full-height to avoid layout collapse during development.
**How to avoid:** Remove `min-h-screen` from About and Experience. Use explicit vertical padding tokens only (`py-24` tablet+, `py-16` mobile).
**Warning signs:** Sections with large empty white gaps in the browser preview.

### Pitfall 2: Contact.tsx Focus Ring Conflict
**What goes wrong:** Current Contact.tsx inputs use Tailwind `focus:ring-2 focus:ring-coral-peak focus:border-transparent`. The UI-SPEC mandates shadow-as-border for focus state. These Tailwind utilities will fight with an inline `boxShadow` focus style.
**Why it happens:** The design system evolved after Contact.tsx was written (Phase 1 placeholder).
**How to avoid:** Remove `focus:ring-*` and `border-*` classes from all input elements. Replace with inline `boxShadow` style driven by form state (idle: stone shadow, focus: coral shadow, error: red shadow). Use `onFocus`/`onBlur` handlers or CSS-in-JS state to swap the value.
**Warning signs:** Two overlapping rings on focused inputs.

### Pitfall 3: text-center on Contact Section Header
**What goes wrong:** Current Contact.tsx header div has `text-center mb-16`. UI-SPEC specifies left-aligned body text throughout — "never centered except for the hero headline." The new "say hi" + subheading copy reads awkwardly centered.
**Why it happens:** Generic centered section header is the template default.
**How to avoid:** Remove `text-center` from the contact section header. Change max-width container to `max-w-[1120px]` per UI-SPEC.
**Warning signs:** "say hi" appearing centered when it should be left-aligned.

### Pitfall 4: About Section `useScrollAnimation` ref Type
**What goes wrong:** `useScrollAnimation` returns `ref: React.RefObject<HTMLElement>`. Assigning directly to a `<section>` works, but to a `<div>` inside requires matching the generic. Contact.tsx has `ref={ref}` on the `<section>` — that's the correct pattern.
**Why it happens:** TypeScript strict mode complains about `RefObject<HTMLElement>` vs `RefObject<HTMLDivElement>`.
**How to avoid:** Apply the `ref` directly to the outermost element (the `<section>` tag) in each section. Don't reassign through intermediate `div` wrappers.
**Warning signs:** TypeScript error "Type 'RefObject<HTMLElement>' is not assignable to type 'RefObject<HTMLDivElement>'."

### Pitfall 5: Two-Column About Layout Collapse
**What goes wrong:** About section uses a 60/40 two-column layout at desktop. If both columns share one `useScrollAnimation` ref, the animation triggers when the section first enters view — but the photo column (40%) may not be visible yet on narrower desktops.
**Why it happens:** Single observer on the outermost element measures section entrance, not column entrance.
**How to avoid:** Use separate `useScrollAnimation` instances for the text column and photo column. Text column triggers at 20% threshold; photos trigger at 20% threshold independently. This also gives the "different animations" treatment required by SECT-02.
**Warning signs:** Photos appearing before they enter viewport, or photos not animating in at all.

### Pitfall 6: Projects Card `<a>` vs `<button>` Semantics
**What goes wrong:** Using a `<motion.div>` or `<button>` for the project card when the entire card is a navigation link. This breaks keyboard navigation and semantic HTML.
**Why it happens:** Framer Motion `whileHover` is easier to apply to motion.div than to an anchor.
**How to avoid:** Use `<motion.a>` (not `<motion.div>` wrapping `<Link>` or `<a>`). Framer Motion supports all HTML elements. `href={/work/${project.slug}}` directly on the motion element. The `<motion.a>` gets `role="link"` semantics automatically.

```typescript
// Correct pattern
<motion.a
  href={`/work/${project.slug}`}
  style={{ boxShadow: 'var(--shadow-border)' }}
  whileHover={{ boxShadow: 'var(--shadow-hover)' }}
  className="block bg-white rounded-[var(--radius-comfortable)] p-8"
>
```

### Pitfall 7: Experience Left Border via CSS border-left
**What goes wrong:** Implementing the experience entry left border as `border-l-2 border-stone-200` Tailwind utilities, then trying to transition the color on hover. Tailwind border-color transition works, but it creates a visible border in addition to any shadow — violates shadow-as-border discipline.
**Why it happens:** Tailwind `border-l` is the obvious tool for a left border.
**How to avoid:** The experience entry left border is decorative structural line (not card containment), so CSS `border-left` is actually correct here per DESIGN.md. This is an exception to the shadow-as-border rule — shadow-as-border applies to card/container containment shadows. The 2px left accent line on experience entries is structural decoration.

```typescript
// Correct — this is structural decoration, not containment
style={{
  borderLeft: `2px solid ${isHovered ? 'var(--color-coral-peak)' : 'var(--color-stone-200)'}`,
  paddingLeft: 'var(--spacing-6)',
  transition: 'border-left-color var(--duration-slow) var(--ease-contour)',
}}
```

Use `useState` for hover tracking, or CSS custom property approach with `group-hover` Tailwind.

---

## Code Examples

### Hero Subtitle Addition
```typescript
// Source: Hero.tsx — extends existing showArrow pattern
const [showSubtitle, setShowSubtitle] = useState(false)

useEffect(() => {
  if (!puzzleSolved) return
  const timer = setTimeout(() => {
    setShowArrow(true)
    setShowSubtitle(true)
  }, 1800)
  return () => clearTimeout(timer)
}, [puzzleSolved])

// JSX — add before the scroll indicator div
<motion.p
  variants={fadeIn}
  initial="initial"
  animate={showSubtitle ? "animate" : "initial"}
  className="absolute left-0 right-0 text-center z-20"
  style={{
    top: '62%',
    fontSize: 'var(--text-body-lg)',
    lineHeight: 'var(--text-body-lg--line-height)',
    fontWeight: 400,
    color: 'var(--color-stone-700)',
  }}
>
  purdue cs + 4 years building systems that run at inference speed
</motion.p>
```

### Project Card
```typescript
// Source: UI-SPEC section 4 card spec
<motion.a
  href={`/work/${study.slug}`}
  className="block bg-white"
  style={{
    boxShadow: 'var(--shadow-border)',
    borderRadius: 'var(--radius-comfortable)',
    padding: 'var(--spacing-8)',
    borderLeft: '2px solid transparent',
    transition: `box-shadow var(--duration-slow) var(--ease-contour),
                 border-left-color var(--duration-slow) var(--ease-contour)`,
  }}
  whileHover={{
    boxShadow: 'var(--shadow-hover)',
  }}
  onHoverStart={(e) => {
    (e.target as HTMLElement).style.borderLeftColor = 'var(--color-coral-peak)'
  }}
  onHoverEnd={(e) => {
    (e.target as HTMLElement).style.borderLeftColor = 'transparent'
  }}
>
```

### Tech Tag
```typescript
// Source: UI-SPEC label spec — mono font, 3px radius, stone-100 bg
<span
  style={{
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-label)',
    fontWeight: 500,
    lineHeight: 'var(--text-label--line-height)',
    letterSpacing: 'var(--text-label--letter-spacing)',
    backgroundColor: 'var(--color-stone-100)',
    color: 'var(--color-stone-700)',
    borderRadius: 'var(--radius-subtle)',
    padding: '4px 8px',
  }}
>
  {tag.label}
</span>
```

### Contact Input Shadow-as-Border
```typescript
// Source: UI-SPEC form visual contract
const [focusedField, setFocusedField] = useState<string | null>(null)

const getInputShadow = (fieldName: string, hasError: boolean) => {
  if (hasError) return '#DC2626 0px 0px 0px 1px'
  if (focusedField === fieldName) return '#E8523F 0px 0px 0px 1px'
  return 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px'
}

<input
  style={{
    boxShadow: getInputShadow('name', !!errors.name),
    borderRadius: 'var(--radius-standard)',
    padding: '12px 16px',
    fontSize: 'var(--text-body)',
    outline: 'none',
    border: 'none',
    transition: `box-shadow var(--duration-fast) var(--ease-contour)`,
  }}
  onFocus={() => setFocusedField('name')}
  onBlur={() => setFocusedField(null)}
  // Remove: className with focus:ring-* and border-* utilities
/>
```

---

## State of the Art

| Old Approach (in stubs) | Current Approach (this phase) | Impact |
|------------------------|-------------------------------|--------|
| `border rounded-lg` for cards | `boxShadow` via `--shadow-border` var | Subtler containment, consistent depth system |
| `text-center` on all section headers | Left-aligned headers except hero | Matches Max's voice register, less corporate |
| `min-h-screen` on content sections | Explicit vertical padding only | Proper content flow, no artificial whitespace |
| Generic `border-stone-300` inputs | Shadow-as-border with color state | Focus/error state differentiation, no border-fighting |
| `whileHover={{ scale: 1.02 }}` on all hover targets | Scale only on buttons; color transitions on cards | Removes uncanny-valley micro-scale on text |
| `bg-coral-peak` nav resume button | Secondary outlined style | Coral reserved for primary CTAs only |

---

## Open Questions

1. **DocReserve and Data Mine experience dates and tech stack**
   - What we know: UI-SPEC explicitly marks these as "executor to confirm exact dates from Max" and "executor to fill with real technical detail per COPY-09"
   - What's unclear: Exact role titles, date ranges, and technical stack for DocReserve and Data Mine
   - Recommendation: Planner should create a task that asks Max to supply this content directly, OR executor reviews any available resume/LinkedIn content at execution time. Do NOT fabricate. UI-SPEC template structure is clear — only the content is missing.

2. **Hero subtitle absolute positioning**
   - What we know: The hero canvas is `min-h-screen` with `items-center justify-center`; the name is displayed via DraggableLetters within the canvas; the subtitle should appear "below the invisible name bounding box"
   - What's unclear: Exact `top` percentage needed for the subtitle to sit cleanly below the solved name without overlapping canvas interaction zones
   - Recommendation: Use `top: '62%'` as a starting value; executor calibrates visually. The subtitle is `pointer-events: none` to avoid interfering with canvas drag interactions.

3. **About section photo grid exact aspect ratios**
   - What we know: Me.jpg (portrait), Climbing.jpg, Lifting.jpg, Cats.jpg all exist in /public/images/; UI-SPEC says "2x2 grid, Me.jpg spans full left column taller"
   - What's unclear: Actual pixel dimensions of the images (affects `width`/`height` props for next/image and layout ratio)
   - Recommendation: Use `fill` layout with `object-cover` inside fixed-size containers rather than explicit width/height — this avoids CLS and works regardless of source dimensions.

---

## Environment Availability

Step 2.6: All dependencies verified in-repo — no external tools required.

| Dependency | Required By | Available | Notes |
|------------|-------------|-----------|-------|
| Node.js 25.5.0 | Build/dev | Yes | LTS+ |
| All npm packages | All sections | Yes | No new packages needed |
| /public/images/*.jpg | About section photos | Yes | Me.jpg, Climbing.jpg, Lifting.jpg, Cats.jpg confirmed |
| /public/resume.pdf | PERF-04 | Yes | Confirmed at /public/resume.pdf |
| case-studies.ts data | Projects section | Yes | 4 case studies complete from Phase 3 |
| TopoSvgDivider.tsx | SECT-01 | Yes | Built in Phase 4 |
| DIVIDER_PATHS | SECT-01 | Yes | 3 transition sets in topo-paths.ts |
| PuzzleContext | HOME-01 | Yes | puzzleSolved boolean available |

**No missing dependencies.** Phase 5 is a pure implementation phase using existing infrastructure.

---

## Validation Architecture

nyquist_validation is enabled (`config.json: "nyquist_validation": true`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test config files or test directories found |
| Config file | None — Wave 0 task needed |
| Quick run command | `npm run lint` (ESLint validation) |
| Full suite command | `npm run build` (TypeScript + ESLint + build check) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COPY-02 | Hero subtitle renders after puzzle solve | smoke | `npm run build` — no TS errors | ❌ Wave 0 |
| HOME-02 | About section photos render without layout shift | manual | Visual check in browser | N/A |
| HOME-03 | Project card links to /work/[slug] | smoke | `npm run build` — href validity | ❌ Wave 0 |
| HOME-05 | Contact form submits (demo mode) | manual | Form interaction in browser | N/A |
| SECT-02 | Distinct animation per section | manual | Visual check with dev server | N/A |
| SLOP-03 | No bento grid in Projects | lint/review | Code review at plan gate | N/A |
| PERF-04 | Resume PDF downloads | manual | Click Download Resume in nav | N/A |
| SLOP-10 | No generic CTAs | copy review | Manual copy audit at gate | N/A |
| SLOP-11 | No shadcn default styling | lint/review | grep for shadcn imports | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` — zero TypeScript errors, zero ESLint errors
- **Per wave merge:** `npm run build` + visual browser check with dev server
- **Phase gate:** Full `npm run build` green + manual visual review before `/gsd:verify-work`

### Wave 0 Gaps
- No formal test framework exists in the project. Given the visual/UI nature of this phase, the test pyramid is: TypeScript type checking (enforced at build) + ESLint + manual visual verification. No unit test scaffolding needed for this phase.
- `npm run build` serves as the automated gate — it runs TypeScript strict mode + ESLint (per next.config.ts, `ignoreBuildErrors` was fixed in Phase 1: FOUND-05).

---

## Sources

### Primary (HIGH confidence)
- Direct source code audit of `/Users/vtx/max-portfolio/src/` — all findings are from reading actual files in the repository
- `/Users/vtx/max-portfolio/.planning/05-home-page-assembly/05-UI-SPEC.md` — approved design contract
- `/Users/vtx/max-portfolio/DESIGN.md` — authoritative design system
- `/Users/vtx/max-portfolio/src/lib/motion.ts` — confirmed all variant names and values
- `/Users/vtx/max-portfolio/src/lib/case-studies.ts` — confirmed all 4 case study data structures
- `/Users/vtx/max-portfolio/public/` directory listing — confirmed image and PDF assets

### Secondary (MEDIUM confidence)
- Next.js 15 `next/image` `fill` prop behavior — training knowledge, consistent with observed codebase patterns
- Framer Motion 12 `motion.a` HTML element support — training knowledge; version 12.38.0 in use

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — everything verified by reading actual package.json and source files
- Architecture patterns: HIGH — derived from reading existing working code (Contact.tsx, Hero.tsx, TopoSvgDivider.tsx)
- Content/copy: HIGH — bio in About.tsx comments, project data in case-studies.ts, copy specs in UI-SPEC
- Asset availability: HIGH — confirmed by ls on /public/images/ and /public/
- Pitfalls: HIGH — derived from reading existing code and identifying specific misalignments with UI-SPEC

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (stable stack, no fast-moving dependencies)
