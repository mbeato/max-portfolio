# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
max-portfolio/
├── src/                          # Source code root
│   ├── app/                      # Next.js App Router directory
│   │   ├── layout.tsx            # Root layout wrapper
│   │   ├── page.tsx              # Home page entry point
│   │   └── globals.css           # Global Tailwind styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # UI primitives and providers
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── PerformanceProvider.tsx    # Web Vitals monitoring
│   │   │   ├── AccessibilityProvider.tsx  # A11y settings context
│   │   │   ├── ThemeToggle.tsx            # Theme switcher UI
│   │   │   ├── ScrollProgress.tsx         # Scroll progress bar
│   │   │   ├── AccessibilityMenu.tsx      # A11y settings UI
│   │   │   ├── StarField.tsx              # Animated star background
│   │   │   ├── BinaryMatrix.tsx           # Code-style animation
│   │   │   ├── ProjectModal.tsx           # Project detail modal
│   │   │   ├── Lazy3DComponent.tsx        # 3D lazy loader wrapper
│   │   │   └── ErrorBoundary3D.tsx        # 3D error catcher
│   │   │
│   │   ├── 3d/                   # Three.js graphics
│   │   │   ├── InteractiveGraphics.tsx    # Main hero graphics
│   │   │   ├── FloatingShapes.tsx         # Geometric particles
│   │   │   ├── SkillBubbles.tsx           # Skill visualization
│   │   │   ├── EarthModel.tsx             # Earth 3D model
│   │   │   └── ErrorBoundary3D.tsx        # 3D error handling
│   │   │
│   │   └── sections/              # Full-page sections
│   │       ├── Navigation.tsx             # Header navigation
│   │       ├── Hero.tsx                   # Hero section
│   │       ├── About.tsx                  # About/skills section
│   │       ├── Experience.tsx             # Timeline section
│   │       ├── Projects.tsx               # GitHub projects grid
│   │       └── Contact.tsx                # Contact form
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTheme.ts           # Theme management
│   │   ├── useGitHubProjects.ts  # GitHub API data fetching
│   │   ├── useIntersectionObserver.ts    # Scroll visibility detection
│   │   └── useScrollProgress.ts  # Scroll position tracking
│   │
│   └── lib/                      # Utilities and constants
│       ├── types.ts              # TypeScript type definitions
│       ├── constants.ts          # Site config, skill data, animation settings
│       ├── utils.ts              # Helper functions, animation variants
│       ├── github.ts             # GitHub API client
│       └── projects.ts           # Project data (optional static fallback)
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.png              # Open Graph preview image
│   └── [other images/assets]
│
├── .planning/                    # GSD planning documents
│   └── codebase/                 # Codebase analysis output
│
├── .vercel/                      # Vercel deployment config
├── .git/                         # Git repository
├── .gitignore                    # Git ignore rules
├── .env.local                    # Environment variables (not committed)
│
├── next.config.ts               # Next.js config
├── tsconfig.json                # TypeScript config
├── postcss.config.mjs           # Tailwind CSS config
├── eslint.config.mjs            # ESLint rules
├── tailwind.config.ts           # Tailwind CSS settings
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Dependency lock file
│
└── README.md                    # Project documentation
```

## Directory Purposes

**`src/app/`**
- Purpose: Next.js App Router - routing and layout
- Contains: Root layout, page components, CSS globals
- Key files: `layout.tsx` (metadata, fonts, providers), `page.tsx` (main entry point)

**`src/components/`**
- Purpose: All React components organized by type
- Organized into three categories: UI primitives, 3D graphics, page sections
- No barrel exports needed; direct imports preferred

**`src/components/ui/`**
- Purpose: Reusable UI building blocks and context providers
- Contains: Buttons, cards, theme/performance/accessibility providers, overlay components
- Key files: `PerformanceProvider.tsx`, `AccessibilityProvider.tsx` (global context setup)

**`src/components/3d/`**
- Purpose: Three.js and React Three Fiber components
- Contains: 3D graphics, particle systems, model renders
- All wrapped in `ErrorBoundary3D` for error isolation
- Lazy-loaded via `Lazy3DComponent` wrapper to defer bundle loading

**`src/components/sections/`**
- Purpose: Major page sections that render as scroll targets
- Contains: Self-contained UI sections with internal state and composition
- Each section has its own visual styling and data flow
- Key files: `Hero.tsx`, `Projects.tsx` (fetches GitHub data), `Contact.tsx` (email form)

**`src/hooks/`**
- Purpose: Custom React hooks for reusable stateful logic
- Contains: Theme management, data fetching, scroll tracking, intersection observation
- Pattern: One hook per file, exported as named export

**`src/lib/`**
- Purpose: Non-component code: types, utilities, constants, API clients
- Organized by responsibility: `types.ts` (TypeScript), `constants.ts` (site config), `github.ts` (API)
- No circular imports; clean dependency flow

**`public/`**
- Purpose: Static assets served directly by Next.js
- Contains: Favicon, app icons, OG images, potentially image/video assets
- Optimized via `next/image` component for responsive delivery

**`.planning/`**
- Purpose: GSD-generated codebase documentation
- Contains: Architecture, structure, conventions, testing, concerns analysis
- Read by `/gsd:plan-phase` and `/gsd:execute-phase` commands

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML structure, metadata, font loading
- `src/app/page.tsx`: Home page orchestration, provider wrapping
- `src/app/globals.css`: Tailwind CSS imports and root variables

**Configuration:**
- `next.config.ts`: Build settings (currently ignoring TypeScript/ESLint errors)
- `tsconfig.json`: TypeScript compiler options, path aliases (`@/*`)
- `tailwind.config.ts`: Tailwind CSS customization
- `postcss.config.mjs`: PostCSS plugins
- `eslint.config.mjs`: ESLint rules

**Core Logic:**
- `src/lib/github.ts`: GitHub API client with caching, repo fetching, language detection
- `src/hooks/useGitHubProjects.ts`: Data loading hook wrapping GitHub API
- `src/components/sections/Projects.tsx`: Main projects section with filtering/search

**Global State:**
- `src/components/ui/PerformanceProvider.tsx`: Performance metrics context
- `src/components/ui/AccessibilityProvider.tsx`: Accessibility settings context
- `src/hooks/useTheme.ts`: Theme management with system preference detection

**Testing:**
- Not detected in codebase (no test files found)

## Naming Conventions

**Files:**
- React components: PascalCase (e.g., `Hero.tsx`, `useTheme.ts`)
- Hooks: `use` prefix in camelCase (e.g., `useTheme.ts`, `useGitHubProjects.ts`)
- Utilities: camelCase (e.g., `github.ts`, `utils.ts`, `types.ts`)
- CSS: Tailwind classes, no separate CSS files except `globals.css`

**Directories:**
- Component directories: kebab-case when nested under `components/` (e.g., `components/3d/`, `components/ui/`, `components/sections/`)
- Feature directories: descriptive names matching content

**Variables:**
- React components: PascalCase (e.g., `Hero`, `PerformanceProvider`)
- Functions: camelCase (e.g., `fetchGitHubProjects`, `useTheme`)
- Constants: CONSTANT_CASE (e.g., `SITE_CONFIG`, `GITHUB_USERNAME`, `CACHE_DURATION`)
- Boolean values: `is`/`has` prefix (e.g., `isLowEndDevice`, `hasIntersected`)

**Types:**
- Interfaces: PascalCase with descriptive suffix (e.g., `PerformanceContextType`, `AccessibilitySettings`)
- Props types: ComponentNameProps suffix (e.g., `HeroProps`, `ProjectsProps`)
- Data types: Domain-specific names (e.g., `ProjectData`, `GitHubRepo`)

**IDs:**
- HTML element IDs: kebab-case with pattern `section-element-purpose` (e.g., `hero-content-container`)
- Generated via `generateElementId()` utility in `src/lib/utils.ts`
- Examples: `portfolio-main-page`, `portfolio-scroll-progress`, `portfolio-navigation`

## Where to Add New Code

**New Feature (e.g., Blog Section):**
- Primary code: `src/components/sections/Blog.tsx`
- Hooks if needed: `src/hooks/useBlogPosts.ts`
- Data/utils: `src/lib/blog.ts`
- Add to page layout: Import and render in `src/app/page.tsx`
- Types: Add to `src/lib/types.ts`

**New Component/Module:**
- UI component: `src/components/ui/NewComponent.tsx`
- Section component: `src/components/sections/NewSection.tsx`
- 3D component: `src/components/3d/New3DElement.tsx`
- Follow PascalCase naming convention
- Import and use where needed

**Utilities:**
- Shared helpers: `src/lib/utils.ts` (append to existing file)
- New domain logic: `src/lib/[domain].ts` (e.g., `email.ts`, `analytics.ts`)
- Constants: Add to `src/lib/constants.ts` or create new constant file

**Custom Hooks:**
- Always create separate file: `src/hooks/use[Feature].ts`
- Export as named export from the file
- Use in components via `import { useFeature } from '@/hooks/useFeature'`

**Global State:**
- If cross-cutting concern: Create provider in `src/components/ui/[Feature]Provider.tsx`
- Wrap app in `src/app/page.tsx` or `src/app/layout.tsx`
- Export context and hook from same file

## Special Directories

**`src/app/`**
- Purpose: Next.js App Router directory - required structure for routing
- Generated: No, manually created
- Committed: Yes, contains app structure and layout
- Important: Changes here affect routing; structure must follow Next.js conventions

**`public/`**
- Purpose: Static files served directly without processing
- Generated: No, manually maintained
- Committed: Yes (except node_modules-like folders)
- Important: All files here accessible at `/` URL path (e.g., `/favicon.ico`)

**`.next/`**
- Purpose: Build output from `next build` command
- Generated: Yes, by Next.js during build
- Committed: No, listed in `.gitignore`
- Important: Contains cached builds and optimized assets

**`node_modules/`**
- Purpose: Installed npm packages
- Generated: Yes, by `npm install` or `npm ci`
- Committed: No, listed in `.gitignore`
- Important: Derived from `package.json` and `package-lock.json`

**`.git/`**
- Purpose: Git version control metadata
- Generated: Yes, by `git init`
- Committed: N/A (internal to git)
- Important: Do not modify directly

---

*Structure analysis: 2026-04-07*
