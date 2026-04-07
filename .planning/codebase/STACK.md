# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript 5 - All source code, type-safe development
- JavaScript (ES2017+) - Runtime execution

**Styling:**
- CSS (Tailwind CSS 4) - Utility-first styling framework

## Runtime

**Environment:**
- Node.js (latest stable) - Development and build time

**Package Manager:**
- npm - Dependency management
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 15.4.6 - React framework, App Router, SSR/SSG
- React 19.1.0 - UI component library
- React DOM 19.1.0 - DOM rendering

**UI & Animation:**
- Framer Motion 12.23.12 - Advanced animations and transitions
- Lucide React 0.539.0 - SVG icon library (538+ icons)
- Tailwind CSS 4 - Utility-first CSS framework with PostCSS plugin (`@tailwindcss/postcss`)

**3D Graphics:**
- Three.js 0.179.1 - 3D WebGL library
- @react-three/fiber 9.3.0 - React renderer for Three.js
- @react-three/drei 10.6.1 - Useful 3D utilities and helpers

**Form & Communication:**
- @emailjs/browser 4.4.1 - Client-side email sending without backend

**Utilities:**
- clsx 2.1.1 - Conditional CSS class composition
- react-intersection-observer 9.16.0 - Intersection Observer API wrapper for React

## Build & Development Tools

**Testing & Linting:**
- ESLint 9 - JavaScript/TypeScript linter
- @eslint/eslintrc 3 - ESLint configuration utilities
- eslint-config-next 15.4.6 - Next.js ESLint presets

**Type Checking:**
- @types/node 20 - Node.js type definitions
- @types/react 19 - React type definitions
- @types/react-dom 19 - React DOM type definitions

**CSS Processing:**
- PostCSS 4 (via Tailwind) - CSS transformations

**Other:**
- gh 2.8.9 - GitHub CLI integration

## Configuration Files

**TypeScript:**
- `tsconfig.json` - Target ES2017, strict mode enabled, path aliases (`@/*` → `./src/*`)

**Next.js:**
- `next.config.ts` - Ignores TypeScript and ESLint errors during build (temporary configuration)

**ESLint:**
- `eslint.config.mjs` - Extends "next/core-web-vitals" and "next/typescript"

**PostCSS:**
- `postcss.config.mjs` - Tailwind CSS PostCSS plugin configuration

**Environment:**
- `.env.local` - Present; contains environment variables (secrets not shown)

## Platform Requirements

**Development:**
- Node.js (any recent LTS version)
- npm or compatible package manager
- Git for version control

**Production:**
- Node.js runtime (Vercel deployment)
- Environment variables: `NEXT_PUBLIC_EMAILJS_*` (optional, for email functionality)

## Key Dependencies Analysis

**Critical Runtime:**
- Next.js 15.4.6 - Core framework, SSR, App Router with latest features
- React 19.1.0 - Latest major version with concurrent features
- TypeScript 5 - Type safety across entire codebase

**High Priority:**
- Three.js ecosystem (Three.js + @react-three/fiber + @react-three/drei) - 3D visualization components
- Framer Motion - Complex animation requirements (card snapping, scroll animations)
- @emailjs/browser - Contact form email delivery (client-side, no backend required)

**Supporting:**
- Tailwind CSS 4 - Modern utility-first styling with latest features
- lucide-react - Icon system avoiding custom SVG management
- react-intersection-observer - Scroll-triggered animations and lazy loading

## Performance & Optimization

**Next.js Features Used:**
- Image optimization via `next/image`
- Font optimization via `next/font` (Geist fonts)
- Dynamic imports for 3D components (lazy loading)
- Metadata API for SEO

**Build Optimization:**
- TypeScript compilation with `noEmit: true`
- ESLint strict configuration
- Incremental builds enabled

---

*Stack analysis: 2026-04-07*
