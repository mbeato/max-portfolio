# Coding Conventions

**Analysis Date:** 2025-04-07

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Card.tsx`, `Contact.tsx`, `Button.tsx`)
- Utilities/Libraries: camelCase (e.g., `utils.ts`, `github.ts`, `constants.ts`, `types.ts`)
- Hooks: camelCase prefixed with `use` (e.g., `useTheme.ts`, `useScrollAnimation.ts`)
- Directories: camelCase (e.g., `components/ui/`, `components/sections/`, `components/3d/`, `lib/`, `hooks/`)

**Functions:**
- camelCase for regular functions (e.g., `fetchGitHubRepos`, `validateForm`, `handleSubmit`)
- camelCase for custom hooks (e.g., `useTheme`, `useScrollAnimation`, `useIntersectionObserver`)
- PascalCase for React components exported as defaults or named exports (e.g., `Card`, `Button`, `Contact`)
- Utility functions have descriptive verb-noun pattern (e.g., `generateElementId`, `formatRepoName`, `getCachedData`)

**Variables:**
- camelCase for all variables and constants (e.g., `formState`, `filteredProjects`, `isIntersecting`)
- CONSTANT_CASE for exported constants (e.g., `SITE_CONFIG`, `NAVIGATION`, `FORM_VALIDATION`)
- Destructured form state pattern: `const [state, setState] = useState()`
- Ref naming: `Ref` suffix (e.g., `formRef`, `ref`)

**Types:**
- PascalCase for interfaces and types (e.g., `CardProps`, `ContactForm`, `LoadingState`, `ProjectData`)
- Discriminated union types for state (e.g., `LoadingState = 'idle' | 'loading' | 'success' | 'error'`)
- Interface suffixes: `Props` for component props, no special suffix for data types
- Readonly tuples for config (e.g., `[number, number, number]`)

## Code Style

**Formatting:**
- ESLint + Next.js core web vitals config enforced via `eslint.config.mjs`
- No explicit Prettier config (uses default formatting)
- 2-space indentation (inferred from code examples)
- Single quotes for strings (e.g., `'use client'`, `'dark'`, `'primary'`)
- Semicolons always used

**Linting:**
- Framework: ESLint v9
- Config: `eslint-config-next` (v15.4.6) extending `next/core-web-vitals` and `next/typescript`
- Located at `eslint.config.mjs` using flat config system
- Run command: `npm run lint`

**Code Organization:**
- Client components marked with `'use client'` directive at top
- Type imports before value imports: `import type { Type }` before `import Component`
- Library imports organized first (React, third-party), then local imports
- Local imports use `@/` alias pattern

## Import Organization

**Order:**
1. React imports (`react`, `react/hooks`)
2. Third-party library imports (framer-motion, lucide-react, etc.)
3. Component imports from `@/components/`
4. Hook imports from `@/hooks/`
5. Utility/lib imports from `@/lib/`
6. Type imports using `import type { Type }`

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All imports use this alias pattern (e.g., `import { cn } from '@/lib/utils'`)
- No relative imports like `../` or `./` in codebase

**Example:**
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { fadeInUp } from '@/lib/utils'
import type { ContactForm } from '@/lib/types'
```

## Error Handling

**Patterns:**
- Try-catch blocks with console.error logging (e.g., `console.error('Failed to fetch...', error)`)
- Async functions return safe defaults on error (empty arrays, null, fallback values)
- Form submission errors managed via state (`formState: 'error'`)
- Error boundaries for 3D components: `ErrorBoundary3D` class component catches rendering errors
- No error throwing to parent—errors logged and handled locally with fallbacks
- API failures return empty results rather than throwing: `return []` on fetch failure
- Validation errors stored in object map: `const [errors, setErrors] = useState<Record<string, string>>({})`

**Example Error Handling:**
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return await response.json()
} catch (error) {
  console.error('Failed to fetch:', error)
  return [] // Safe default
}
```

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- `console.error()` for error logging
- Located at failure points in try-catch blocks
- Includes context: `console.error('Action failed:', error)`
- Logging in component lifecycle: `componentDidCatch()` in error boundaries
- No debug logging in components

## Comments

**When to Comment:**
- Explain "why" for non-obvious logic (e.g., `// Filter out forks and archived repos, keep only meaningful projects`)
- Clarify complex calculations or business logic
- Document edge cases and workarounds
- Section headers for logical groupings (e.g., `// Contact Details`, `// Form Status Messages`)
- No comment-per-line style; prefer clear code

**JSDoc/TSDoc:**
- Not heavily used
- Function parameters documented via TypeScript types
- Component props documented via interface definitions
- Used for complex utilities: `generateElementId(section: string, element: string, purpose: string)`

## Function Design

**Size:** 
- Keep functions under 40 lines where practical
- Complex logic extracted to utilities in `src/lib/`
- Render logic organized into focused components

**Parameters:**
- Use destructured object pattern for complex parameter lists
- Hook options use optional object with defaults: `UseIntersectionObserverOptions = {}`
- Event handlers use React.ChangeEvent, React.FormEvent type annotations
- Avoid positional parameters beyond 3; use object destructuring

**Return Values:**
- Explicit return types on functions (TypeScript strict mode)
- React components return JSX.Element or similar
- Hooks return tuples (`[value, setter]`) or objects with named properties
- Utility functions return typed values, never implicit `any`

**Example:**
```typescript
export async function convertRepoToProject(repo: GitHubRepo): Promise<ProjectData> {
  const languages = await fetchRepoLanguages(repo.name)
  return {
    id: repo.name.toLowerCase(),
    title: formatRepoName(repo.name),
    // ... rest of object
  }
}
```

## Module Design

**Exports:**
- Named exports for utilities, types, and hooks
- Default exports for React components (sometimes)
- Mix of both in same file acceptable (e.g., `Card` default, card sub-components named)
- Type-only exports using `export type { Type }`

**Barrel Files:**
- Not used in `components/` directories
- Each component imported directly from its file path
- Single file per component (no index.ts aggregation)

**Example Export Patterns:**
```typescript
// Component with sub-components (named + default)
const Card = forwardRef<HTMLDivElement, CardProps>(...)
const CardHeader = forwardRef<...>(...)
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

// Utility functions (named exports)
export function cn(...inputs: ClassValue[]) { ... }
export const generateElementId = (section, element, purpose) => { ... }

// Hooks (named exports)
export function useTheme() { ... }
export function useReducedMotion() { ... }

// Constants (named exports)
export const SITE_CONFIG = { ... } as const
```

## Form Handling

**State Management:**
- Form data in single object state: `useState<ContactForm>({ name, email, subject, message })`
- Errors in object map by field name: `Record<string, string>`
- Loading state as discriminated union: `LoadingState = 'idle' | 'loading' | 'success' | 'error'`

**Validation:**
- Validation rules centralized in `FORM_VALIDATION` constants
- Validate before submit, return early if invalid
- Clear errors on user input (onChange handler)
- Display errors inline with animated reveal: `initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}`

## Animation Patterns

**Framer Motion:**
- Animation variants defined as objects: `fadeInUp = { initial: {}, animate: {}, exit: {} }`
- Export shared variants from `@/lib/utils` (e.g., `fadeInUp`, `staggerContainer`)
- Component-level motion props passed via `motionProps` prop when `asMotion={true}`
- Conditional animation based on intersection: `animate={isIntersecting ? "animate" : "initial"}`

## Accessibility

**ID Attributes:**
- All interactive elements require `id` prop (required in component interfaces)
- ID generation follows pattern: `generateElementId(section, element, purpose)`
- Format: `{section}-{element}-{purpose}` in kebab-case (e.g., `contact-form-submit-button`)
- Used for HTML accessibility and testing

**ARIA & Labels:**
- Form labels use `htmlFor` paired with input `id`
- Screen reader text: `<span className="sr-only">Label</span>`
- Icon buttons include aria labels or sr-only text

---

*Convention analysis: 2025-04-07*
