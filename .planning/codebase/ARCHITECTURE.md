# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** React Server Components (RSC) + Client Components hybrid architecture with Next.js 15 App Router. Single-page portfolio site built as a continuous scroll experience with lazy-loaded 3D graphics, dynamic project data integration, and comprehensive accessibility/performance monitoring.

**Key Characteristics:**
- Server-rendered root layout with client-side providers for state management
- Component-based UI split into sections, utilities, and 3D graphics
- Client Context Providers for accessibility, performance monitoring, and theme management
- Real-time data fetching from GitHub API with client-side caching
- Animation-first design using Framer Motion with device capability detection
- Intersection Observer pattern for lazy loading and scroll-triggered animations
- Comprehensive error handling and fallbacks for API failures

## Layers

**Route Layer (App Router):**
- Purpose: Entry point and page structure
- Location: `src/app/`
- Contains: Root layout (`layout.tsx`), main page (`page.tsx`)
- Depends on: Component sections, providers
- Used by: Browser renderer; all other components render through this

**Section Components Layer:**
- Purpose: Major page sections (Hero, About, Experience, Projects, Contact)
- Location: `src/components/sections/`
- Contains: Full-page sections with their own internal composition
- Depends on: UI components, 3D components, hooks, utilities, constants
- Used by: Page component (`page.tsx`)
- Key files: `Hero.tsx`, `Projects.tsx`, `Experience.tsx`, `Contact.tsx`, `About.tsx`, `Navigation.tsx`

**UI Components Layer:**
- Purpose: Reusable UI building blocks and context providers
- Location: `src/components/ui/`
- Contains: Atomic components, theme/accessibility/performance providers
- Depends on: Lucide icons, Framer Motion, hooks, constants
- Used by: Section components, other UI components
- Examples: `Button.tsx`, `Card.tsx`, `PerformanceProvider.tsx`, `AccessibilityProvider.tsx`

**3D Graphics Layer:**
- Purpose: Three.js-powered 3D visualizations and geometric animations
- Location: `src/components/3d/`
- Contains: React Three Fiber components, particle systems, interactive graphics
- Depends on: Three.js, React Three Fiber/Drei, Framer Motion
- Used by: Section components (especially Hero section)
- Key files: `InteractiveGraphics.tsx`, `FloatingShapes.tsx`, `SkillBubbles.tsx`, `EarthModel.tsx`

**Context Providers (Global State):**
- Purpose: Manage cross-cutting concerns (theme, accessibility, performance)
- Location: `src/components/ui/`
- Contains: Three context providers wrapping entire app
- Wrapping order in page: `PerformanceProvider` → `AccessibilityProvider` → page content
- Managed state: Performance metrics, device capability detection, accessibility settings, theme

**Hooks Layer:**
- Purpose: Encapsulated stateful logic for reuse across components
- Location: `src/hooks/`
- Contains: Custom hooks for theme management, intersection observation, scroll tracking, GitHub integration
- Key files: `useTheme.ts`, `useGitHubProjects.ts`, `useIntersectionObserver.ts`, `useScrollProgress.ts`

**Utilities & Constants Layer:**
- Purpose: Shared data, animation configurations, type definitions
- Location: `src/lib/`
- Contains: Type definitions, constants, utility functions, GitHub API client, project data
- Key files: `types.ts`, `constants.ts`, `utils.ts`, `github.ts`, `projects.ts`

## Data Flow

**GitHub Projects Pipeline:**

1. `Projects.tsx` component renders and calls `useGitHubProjects()` hook
2. Hook triggers `fetchGitHubProjects()` from `src/lib/github.ts` on mount
3. GitHub.ts fetches repos via GitHub API v3 (`/users/mbeato/repos`)
4. Response filtered (excludes archived, disabled, config repos)
5. Each repo converted to `ProjectData` type via `convertRepoToProject()`
6. Languages fetched per-repo from GitHub API and cached (5 min TTL)
7. Projects sorted by featured status, stars, update date
8. Results stored in `useGitHubProjects` state and passed to `Projects` section
9. Projects component filters/searches via `useMemo` based on active filter and search query
10. Filtered results rendered as `Card` components with GitHub stats and links

**Scroll Animation Pipeline:**

1. Component mounts and hooks into `useScrollAnimation()` (wraps `useIntersectionObserver`)
2. Component receives `ref` and `isIntersecting` boolean
3. `ref` attached to section DOM element
4. `isIntersecting` drives Framer Motion `animate` state in variant groups
5. Variants (`fadeInUp`, `staggerContainer`) defined in `src/lib/utils.ts`
6. Scroll progress tracked globally via Framer Motion's `useScroll` hook
7. Scroll-bound properties (`scrollYProgress`) transform element position/rotation
8. `InteractiveGraphics` component uses `useScroll` for particle/geometry parallax

**Theme Application Pipeline:**

1. `useTheme()` hook detects system preference via `window.matchMedia('(prefers-color-scheme: dark)')`
2. Saved theme loaded from localStorage (`portfolio-theme` key)
3. `resolvedTheme` computed: 'system' → current system theme, or explicit 'light'/'dark'
4. On `resolvedTheme` change, `light` and `dark` classes applied to `<html>` and `<body>`
5. Tailwind CSS responds to `dark:` prefixed classes
6. Meta theme-color updated for browser UI color
7. `ThemeToggle` component allows manual cycling: light → dark → system → light

**Performance Optimization Data Flow:**

1. `PerformanceProvider` initializes on first render
2. Detects device capabilities: `navigator.hardwareConcurrency`, `navigator.deviceMemory`, connection type
3. `isLowEndDevice` flag set if CPU ≤ 2 cores or memory ≤ 2GB
4. PerformanceObserver instances created for FCP, LCP, FID, CLS, TTFB metrics
5. Metrics stored in context state and logged in dev mode
6. If low-end device detected: animations disabled via CSS injection + `--animation-duration: 0.1s`
7. `enableAnimations` computed as `!prefersReducedMotion && !isLowEndDevice`
8. Components can consume `usePerformance()` to conditionally render based on device capability

**Accessibility Settings Flow:**

1. `AccessibilityProvider` loads saved settings from localStorage on mount
2. System preferences detected via media queries: reduced motion, high contrast
3. Keyboard navigation detected on first Tab key press
4. Screen reader presence detected via user agent matching
5. Settings state updated with all detections
6. CSS classes added to root: `high-contrast`, `reduce-motion`, `large-text`, `focus-visible`, `keyboard-navigation`
7. Dynamic style element injected with accessibility-specific CSS overrides
8. All settings persisted to localStorage on change
9. Screen reader announcements pushed to hidden ARIA-live region for narration

**State Management Strategy:**

- **Global state:** Theme (localStorage + context), accessibility settings (localStorage + context), performance metrics (context)
- **Local state:** Component-level for UI interactions (filters, search, modals, animations)
- **Server data:** GitHub projects fetched client-side with in-memory cache (5 min TTL)
- **No external state manager:** Context API sufficient for cross-cutting concerns

## Key Abstractions

**Context Providers as Middleware:**
- Purpose: Inject capability detection and settings management without prop drilling
- Examples: `PerformanceProvider`, `AccessibilityProvider`
- Pattern: React Context + useContext + useState for encapsulated state

**Custom Hooks for Reusable Logic:**
- `useTheme()`: Theme resolution with localStorage persistence and system preference detection
- `useGitHubProjects()`: Async data loading with error handling and refetch capability
- `useIntersectionObserver()`: Lazy-loading and scroll-triggered animation trigger
- `useScrollProgress()`: Scroll position tracking for parallax effects
- `useReducedMotion()`: Media query detection for animation preference

**Framer Motion Variants as Reusable Animation Logic:**
- Purpose: Centralize animation definitions for consistency
- Location: `src/lib/utils.ts`
- Examples: `fadeInUp`, `staggerContainer`
- Pattern: Objects with `initial`, `animate`, `exit`, `transition` keys passed to Motion components

**Section Components as Composition Units:**
- Purpose: Encapsulate major page sections with internal layout and data fetching
- Each section self-contained with own visual styling, data flow, interactivity
- Examples: `Hero` (with typewriter effect), `Projects` (with filtering/search), `Contact` (with form)

**3D Graphics as Progressive Enhancement:**
- Purpose: 3D elements wrapped in error boundaries and lazy-loaded for performance
- `Lazy3DComponent` delays Three.js bundle loading until needed
- `ErrorBoundary3D` catches Three.js errors without breaking page

## Entry Points

**Next.js App Router Entry:**
- Location: `src/app/layout.tsx`
- Triggers: Every request to `/`
- Responsibilities: 
  - Renders root HTML structure
  - Sets up metadata for SEO (title, description, OG images, robots)
  - Loads Google Fonts (Geist Sans/Mono)
  - Wraps page with CSS global styles
  - Renders `suppressHydrationWarning` to prevent theme flashing

**Page Component:**
- Location: `src/app/page.tsx`
- Triggers: Renders within root layout for `/` route
- Responsibilities:
  - Wraps content with `PerformanceProvider` and `AccessibilityProvider`
  - Renders scroll progress indicator
  - Orchestrates section components in scroll order: Navigation → Hero → About → Experience → Projects → Contact
  - Renders accessibility menu overlay

**Hero Section:**
- Location: `src/components/sections/Hero.tsx`
- First visible content after navigation
- Responsibilities:
  - Typewriter name animation on load
  - Interactive background with animated gradient orbs
  - CTA buttons (View Work, Get In Touch) with smooth scroll navigation
  - Social media links with dynamic icon selection
  - Scroll-to-About indicator arrow

## Error Handling

**Strategy:** Graceful degradation with fallbacks

**Patterns:**

1. **GitHub API Failures:**
   - `useGitHubProjects` catches errors, stores in state, returns empty array
   - `Projects` section displays error UI with AlertCircle icon
   - Refetch button allows manual retry
   - Fallback: Shows loading state, then error message, no crash

2. **3D Graphics Failures:**
   - `ErrorBoundary3D` wraps Three.js components
   - Catches React errors in 3D rendering
   - Falls back to static 2D background (gradient orbs)
   - Console logs error for debugging

3. **Async Data Loading:**
   - `useGitHubProjects` tracks loading and error states
   - Components conditional render based on state: idle → loading → success/error
   - RefreshCw spinner shown during loading
   - Error messages include retry buttons

4. **Browser API Failures:**
   - `PerformanceProvider` wraps observer creation in try-catch
   - Missing API gracefully ignored with console.warn
   - Accessibility provider catches localStorage errors
   - Fallback to sensible defaults if APIs unavailable

## Cross-Cutting Concerns

**Logging:** 
- Development only: `PerformanceProvider` logs metrics in console.group
- Error logging in catch blocks for GitHub API, component errors
- No production logging infrastructure

**Validation:** 
- Form validation in `Contact` section via `FORM_VALIDATION` rules from constants
- Email regex pattern, min/max length checks
- Real-time validation feedback on input change

**Authentication:** 
- Not implemented; public portfolio site
- GitHub API calls unauthenticated (lower rate limits but sufficient)
- No user login or protected content

**Performance Monitoring:**
- `PerformanceProvider` measures Core Web Vitals: FCP, LCP, FID, CLS, TTFB
- Device capability detection informs animation complexity
- Connection speed detection available but not used yet
- Thresholds defined in `PERFORMANCE_THRESHOLDS` constant

---

*Architecture analysis: 2026-04-07*
