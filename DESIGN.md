# Design System — Max Beato Portfolio

## 1. Visual Theme & Atmosphere

The portfolio is a topographic survey rendered as a website. The visual language is borrowed from cartography — contour lines that map terrain elevation — applied to a developer portfolio where the "terrain" is Max's work. Every visual element traces back to this metaphor: lines that pulse and breathe, varying density that implies depth, and a single accent color that marks the peaks.

The atmosphere is calm, precise, and deliberate. White space dominates. Black contour lines provide structure. Coral marks what matters. Nothing is decorative — every element either carries content or reinforces the topographic concept. The site should feel like opening a well-made map: immediately legible, quietly beautiful, rewarding on closer inspection.

This is explicitly not a tech-dark-mode-gradient portfolio. No purple orbs. No particle systems. No glassmorphism. No bento grids. The restraint is the statement. The craft is in the lines.

**Key Characteristics:**
- Topographic contour lines as the unifying visual metaphor across all pages
- White canvas with black contour lines — cartographic, not corporate
- Canvas-rendered hero animation: simplex noise field processed through marching squares (d3-contour), drawn with varying line weights and non-uniform spacing
- SVG contour accents at section boundaries using Framer Motion `pathLength` draw-on
- Coral accent used like a cartographer's peak marker — sparingly, at points of emphasis
- Typography with personality and editorial scale — never Inter, never uniform
- Shadow-as-border technique for subtle depth without drop-shadow heaviness
- Motion that follows the contour metaphor: waves, pulses, organic flow — never linear paths, never spinning

## 2. Color Palette & Roles

### Primary
- **Map White** (`#FAFAF9`): Page background. Not pure white — the warmth of aged paper. Slightly stone-tinted.
- **Contour Black** (`#1A1A1A`): Primary text, contour lines, navigation. Near-black with micro-warmth.
- **Pure White** (`#FFFFFF`): Card surfaces, overlay backgrounds, input fields.

### Accent
- **Coral Peak** (`#E8523F`): The single accent color. Used at points of peak emphasis only: active navigation states, key CTAs, hover states on project links, the "peak" areas of the topographic animation. Never used on backgrounds or large surfaces.
- **Coral Muted** (`#E8523F` at 12% opacity): Subtle coral tint for hover backgrounds on interactive elements.
- **Coral Deep** (`#C7402F`): Darker coral for pressed/active states. Derived, not a separate design decision.

### Neutral Scale
- **Stone 900** (`#1A1A1A`): Primary text, headings, contour lines.
- **Stone 700** (`#404040`): Secondary text, body copy, descriptions.
- **Stone 500** (`#737373`): Tertiary text, metadata, timestamps, muted labels.
- **Stone 300** (`#D4D4D4`): Borders (via shadow technique), dividers, inactive states.
- **Stone 200** (`#E5E5E5`): Subtle borders, input outlines, card edges.
- **Stone 100** (`#F5F5F4`): Section backgrounds where slight differentiation is needed (used rarely).
- **Stone 50** (`#FAFAF9`): Page background (same as Map White).

### Functional
- **Focus Ring** (`#E8523F` at 50% opacity): Focus outline for keyboard navigation — coral, not blue. Maintains the single-accent discipline.
- **Error** (`#DC2626`): Form validation errors only. Not the accent coral — errors are system-level, not design-level.
- **Success** (`#16A34A`): Form submission confirmation only.

### Shadows & Depth
- **Border Shadow** (`rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`): Shadow-as-border for cards and containers. Subtler than Vercel's — the contour lines provide enough structure.
- **Subtle Lift** (`rgba(0, 0, 0, 0.04) 0px 1px 3px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`): Cards on hover — minimal elevation.
- **Contour Shadow** (`rgba(0, 0, 0, 0.08) 0px 4px 12px -4px`): Case study cards — enough depth to signal clickability.

## 3. Typography Rules

### Font Family
- **Primary**: A deliberate, non-Inter sans-serif with editorial character. Candidates: `Space Grotesk`, `Satoshi`, or `General Sans` — geometric but with enough quirk to feel chosen, not defaulted. Final selection at Phase 2 implementation.
- **Monospace**: `JetBrains Mono` or `Fira Code` — for code snippets in case studies and technical labels. Ligatures enabled.
- **Fallback chain**: `[Primary], ui-sans-serif, system-ui, -apple-system, sans-serif`
- **OpenType Features**: `"liga"` on monospace. `"kern"` on primary.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Use |
|------|------|--------|-------------|----------------|-----|
| Display | 64px (4rem) | 700 | 1.05 | -2.5px | Hero name only |
| Heading 1 | 40px (2.5rem) | 600 | 1.15 | -1.2px | Section titles (About, Projects, etc.) |
| Heading 2 | 28px (1.75rem) | 600 | 1.25 | -0.8px | Case study titles, subsection heads |
| Heading 3 | 22px (1.375rem) | 500 | 1.35 | -0.4px | Card titles, minor headings |
| Body Large | 18px (1.125rem) | 400 | 1.7 | normal | Lead paragraphs, case study intro |
| Body | 16px (1rem) | 400 | 1.65 | normal | Standard reading text, descriptions |
| Body Small | 14px (0.875rem) | 400 | 1.5 | normal | Metadata, captions, secondary info |
| Label | 12px (0.75rem) | 500 | 1.3 | 0.5px | Tags, tech stack labels, uppercase sparingly |
| Mono Body | 15px (0.9375rem) | 400 | 1.6 | normal | Code snippets in case studies |
| Mono Label | 12px (0.75rem) | 500 | 1.3 | 0.3px | Technical identifiers, file paths |

### Principles
- **Negative tracking at display sizes**: -2.5px at 64px creates compressed, intentional headlines. Tracking relaxes progressively: -1.2px at 40px, -0.8px at 28px, normal at 16px.
- **Three weights, strict roles**: 400 (reading), 500 (UI/interactive), 600-700 (headings/emphasis). No weight 300. No weight 800+.
- **Editorial scale contrast**: Display (64px) to Body (16px) is a 4:1 ratio. This dramatic jump creates visual tension that templates never have — they cluster sizes together.
- **Lowercase as voice**: Section headings and hero text use sentence case or lowercase to match Max's writing voice. Never ALL CAPS on headings (uppercase reserved for small labels only).

## 4. Component Stylings

### Buttons

**Primary (Coral)**
- Background: `#E8523F`
- Text: `#FFFFFF`
- Padding: 12px 24px
- Radius: 4px (subtle — not pill, not sharp)
- Font: 14px weight 500
- Hover: `#C7402F` (Coral Deep)
- Focus: 2px outline `#E8523F` at 50% opacity, 2px offset
- Use: Primary CTAs only — "view case study", "send message". Maximum 1-2 per viewport.

**Secondary (Outlined)**
- Background: transparent
- Text: `#1A1A1A`
- Border: via shadow — `rgba(0, 0, 0, 0.12) 0px 0px 0px 1px`
- Padding: 12px 24px
- Radius: 4px
- Hover: background `#F5F5F4`, shadow darkens to `rgba(0, 0, 0, 0.2) 0px 0px 0px 1px`
- Use: Secondary actions — "download resume", "view code"

**Ghost (Text link)**
- Background: none
- Text: `#1A1A1A`
- Underline: 1px solid `#D4D4D4`, offset 4px
- Hover: underline color transitions to `#E8523F`
- Use: Inline links, navigation items

### Cards — Project/Case Study

- Background: `#FFFFFF`
- Border: via shadow — `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`
- Radius: 6px
- Padding: 32px
- Hover: shadow transitions to `rgba(0, 0, 0, 0.04) 0px 1px 3px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px`. Subtle coral line appears on left edge (2px wide, `#E8523F`).
- Content structure: Project name (Heading 3) → one-line hook → tech stack as Mono Labels → arrow indicator
- No images on cards — text and craft signal the quality. Screenshots live on case study pages.

### Cards — Experience

- Background: transparent (no card surface — just content)
- Left border: 2px solid `#E5E5E5`, transitions to `#E8523F` on hover
- Padding-left: 24px
- Content: Role + Company (Heading 3) → Date range (Body Small, Stone 500) → Description (Body) → Tech tags (Mono Label)
- Stacked vertically with 48px gap

### Tags / Tech Labels

- Background: `#F5F5F4`
- Text: `#404040`
- Padding: 4px 10px
- Radius: 3px
- Font: Mono Label (12px weight 500)
- No border. The background tint is the container.
- Use: Tech stack on case study pages and experience items. Never as a standalone "skills grid."

### Navigation

- Position: fixed, top
- Background: `#FAFAF9` with backdrop-blur (8px) for scroll transparency
- Bottom border: via shadow — `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`
- Logo/name: "max beato" in primary font, 16px weight 600, lowercase
- Links: 14px weight 400, Stone 700. Hover: Stone 900. Active: Coral Peak with subtle underline.
- CTA: "resume" — secondary button style, right-aligned
- Mobile: hamburger collapse, full-screen overlay with large centered links

### Contact Form

- Input background: `#FFFFFF`
- Input border: via shadow — `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px`
- Input focus: shadow transitions to `#E8523F 0px 0px 0px 1px` (coral ring)
- Input radius: 4px
- Input padding: 12px 16px
- Input font: Body (16px weight 400)
- Label: Body Small weight 500, Stone 700
- Submit: Primary button style

## 5. Layout Principles

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Component internal padding: 16-32px
- Section vertical padding: 96-128px (generous — let the white space work)
- Between section items: 32-48px

### Grid & Container
- Max content width: 1120px (slightly narrow — editorial feel)
- Content padding: 24px (mobile), 48px (tablet), 0 (desktop, centered)
- Single column dominant — the topographic theme works best without competing columns
- Case study pages: single column, max-width 720px for reading comfort
- Home sections: occasional asymmetric two-column (60/40) where content warrants it

### Whitespace Philosophy
- **Cartographic breathing room**: Topographic maps use empty space to let contour lines speak. The portfolio does the same — massive section padding (96-128px) creates rhythm.
- **Content density varies intentionally**: The hero is spacious and atmospheric. Case study pages are denser and more reading-focused. This variation prevents the monotony that AI templates create with uniform spacing.
- **No section background color alternation**: Sections are separated by whitespace and optional SVG contour dividers — never by alternating light/dark backgrounds.

### Border Radius Scale
- Subtle (3px): Tags, small elements
- Standard (4px): Buttons, inputs, form elements
- Comfortable (6px): Cards, containers
- Never use pill radius (9999px) on primary elements — pills are an AI slop pattern in this context
- Never use large radius (16px+) — the topographic theme is precise, not bubbly

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks, transparent cards |
| Border (Level 1) | `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px` | Shadow-as-border on cards, nav, inputs at rest |
| Hover (Level 2) | Border + `rgba(0, 0, 0, 0.04) 0px 1px 3px` | Cards on hover, focused inputs |
| Lifted (Level 3) | `rgba(0, 0, 0, 0.08) 0px 4px 12px -4px` + Border | Case study cards, modals (if any) |
| Focus (Accessibility) | `0 0 0 2px #FAFAF9, 0 0 0 4px rgba(232, 82, 63, 0.5)` | Keyboard focus — double-ring: white gap + coral outer |

**Shadow Philosophy**: Shadows exist to create subtle containment, not floating elevation. The contour lines already provide the visual structure — shadows are supporting, not leading. Every shadow uses negative spread or minimal blur to stay grounded. No shadows above 0.08 opacity. Cards should feel like they're resting on the surface, not hovering above it.

### Contour-Specific Depth
- The hero canvas animation creates perceived depth through varying line opacity (0.15 to 0.6) and line weight (0.5px to 1.5px) — denser, darker lines feel "closer" like higher elevation on a topo map
- SVG section dividers use a single weight (1px) at lower opacity (0.2) — they're geographic reference lines, not content elements

## 7. Do's and Don'ts

### Do
- Use the topographic metaphor consistently — contour lines, varying density, organic wave motion
- Write all copy in Max's voice: lowercase, direct, specific, no buzzwords
- Use coral (#E8523F) only at points of emphasis — it should feel like a cartographer marked the peak
- Vary contour line density and animation phase — non-uniformity signals craft
- Use shadow-as-border instead of CSS border for subtle containment
- Let white space do most of the visual heavy lifting
- Show technical specifics (actual library names, actual architecture decisions) instead of vague claims
- Use the editorial type scale — dramatic size jumps between display and body
- Make the site functional first, animated second — content visible on first paint, animation layers on top
- Test every animation on mid-range mobile — 60fps or remove it

### Don't
- Don't use Inter, Poppins, Montserrat, or any other "safe default" typeface
- Don't use purple-to-blue gradients, gradient orbs, gradient mesh backgrounds, or any gradient as decoration
- Don't use bento grid layouts for any section
- Don't add a typewriter effect on the hero or anywhere else
- Don't apply fade-in-on-scroll uniformly to every section element
- Don't use particle systems, star fields, floating objects, or cursor trails
- Don't use glassmorphism, frosted glass, or backdrop-blur on cards (nav is the only exception)
- Don't use skill bars, progress bars, percentage indicators, or technology logo grids
- Don't write "innovative digital experiences", "passionate developer", "let's build something amazing", "available for opportunities", or any copy from the AI slop list
- Don't use shadcn/MUI/Radix default styling on visible layout elements — components must be hand-styled
- Don't make every element interactive or animated — restraint signals taste
- Don't use uniform border-radius (same radius on every element) — vary intentionally
- Don't add "dark mode" — the white topographic theme is the design commitment
- Don't use more than one accent color — coral is it
- Don't center-align body text — left-align for readability, center only for hero headline if appropriate
- Don't use emoji in professional copy sections

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, reduced section padding (64px), compact nav, hero animation simplified |
| Tablet | 640–1024px | Single column with wider margins, nav expands partially |
| Desktop | 1024–1280px | Full layout, max-width container centered, complete nav |
| Large | >1280px | Content stays at 1120px max-width, generous side margins |

### Touch Targets
- All interactive elements minimum 44x44px tap area
- Navigation links: 48px height with adequate horizontal spacing
- Buttons: minimum 44px height
- Form inputs: 48px height

### Collapsing Strategy
- Hero: Display 64px → 40px on mobile. Canvas animation reduces particle count / simplifies on mobile for performance.
- Navigation: full horizontal → hamburger with full-screen overlay
- Project cards: maintain single-column stack at all sizes (no grid to collapse)
- Case study pages: max-width 720px → full-width with 24px padding on mobile
- Section padding: 128px → 96px (tablet) → 64px (mobile)
- Experience cards: identical layout at all sizes (already single column)

### Animation Behavior
- Canvas hero animation: reduce contour line count on mobile (performance)
- SVG section dividers: still draw on scroll, but simpler paths on mobile
- Framer Motion transitions: `prefers-reduced-motion` disables all non-essential animation
- No animation should prevent content from being readable immediately

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: Map White (`#FAFAF9`)
- Primary text: Contour Black (`#1A1A1A`)
- Secondary text: Stone 700 (`#404040`)
- Muted text: Stone 500 (`#737373`)
- Accent: Coral Peak (`#E8523F`)
- Accent hover: Coral Deep (`#C7402F`)
- Card border (shadow): `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px`
- Focus ring: `0 0 0 2px #FAFAF9, 0 0 0 4px rgba(232, 82, 63, 0.5)`

### Example Component Prompts
- "Create a hero section on #FAFAF9 background. Name at 64px weight 700, line-height 1.05, letter-spacing -2.5px, color #1A1A1A, lowercase. Subtitle at 18px weight 400, line-height 1.7, color #404040. Coral CTA button (#E8523F, white text, 4px radius, 12px 24px padding) and outlined secondary button (transparent, shadow-border rgba(0,0,0,0.12) 0px 0px 0px 1px, 4px radius)."
- "Design a project card: white background, shadow-border rgba(0,0,0,0.06) 0px 0px 0px 1px, 6px radius, 32px padding. Title at 22px weight 500, -0.4px tracking. Description at 16px weight 400, #404040. Tech tags in 12px mono weight 500 on #F5F5F4 background, 3px radius. On hover: shadow intensifies, 2px coral left border appears."
- "Build experience item: no card background, 2px left border #E5E5E5 with 24px padding-left. Role at 22px weight 500. Date at 14px weight 400 #737373. Description at 16px weight 400. Hover: left border transitions to #E8523F."
- "Create navigation: fixed top, #FAFAF9 with backdrop-blur 8px. Shadow-border bottom. 'max beato' left at 16px weight 600 lowercase. Links 14px weight 400 #404040, hover #1A1A1A, active #E8523F. 'resume' as outlined button right-aligned."
- "Design a case study page: max-width 720px centered. Title at 40px weight 600, -1.2px tracking. Lead paragraph at 18px weight 400, line-height 1.7. Body at 16px weight 400, line-height 1.65. Code snippets in 15px mono on #F5F5F4 background. Coral used only for key callouts or links."

### Anti-Slop Checklist (Apply at Every Phase)
1. No Inter typeface anywhere
2. No gradient backgrounds, text, or borders
3. No bento grid layout
4. No typewriter animation
5. No uniform fade-in-on-scroll
6. No particle/star/floating object decoration
7. No glassmorphism or frosted cards
8. No skill bars or percentage indicators
9. No technology logo grid
10. No generic CTA copy ("let's build something amazing")
11. No shadcn/MUI default visual styling on layout elements
12. No cursor trail effects
13. Copy reads in Max's actual voice (lowercase, direct, specific)
14. Coral appears at emphasis points only — never on large surfaces
15. Every animation ties back to the topographic concept

### Iteration Guide
1. Start every component with content, not decoration — if the content doesn't work in plain text, the component won't save it
2. Shadow-as-border (`0px 0px 0px 1px`) replaces CSS border throughout
3. Letter-spacing scales with size: -2.5px at 64px → normal at 16px
4. Three weights: 400 (read), 500 (interact), 600-700 (announce)
5. Coral is the only accent color — if you need a second color, you've made a design error
6. The topographic animation is the design bet — every other visual element defers to it
7. White space is earned by restraint in everything else — don't fill it
8. Test on mobile after every animation change — 60fps or cut it
