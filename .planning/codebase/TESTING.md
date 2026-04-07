# Testing Patterns

**Analysis Date:** 2025-04-07

## Test Framework

**Status:** No testing framework configured

**Current State:**
- No test files found in codebase (`*.test.ts`, `*.spec.ts`)
- No test runner dependency (Jest, Vitest, etc.) in `package.json`
- No test configuration files (`jest.config.js`, `vitest.config.ts`)
- ESLint configuration enforces code quality via linting, not tests

**Implication:**
Testing is not implemented. Quality assurance relies on:
- ESLint type checking and code style enforcement
- TypeScript strict mode compilation
- Manual testing during development
- Next.js built-in optimization checks

## Where Tests Should Go

**Test File Location:**
- Co-located with source: `src/components/ui/Button.test.tsx` next to `src/components/ui/Button.tsx`
- Or in separate directory: `src/__tests__/components/ui/Button.test.tsx`
- Follow naming convention: `[ComponentName].test.tsx` or `[ComponentName].spec.tsx`

**Suggested Test Runner Setup:**
```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

**Example jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/src/**/*.test.ts',
  ],
}
```

## Areas to Test

**High-Priority Testing:**

1. **Form Validation:** `src/components/sections/Contact.tsx`
   - Validate field lengths match `FORM_VALIDATION` rules
   - Test error message display
   - Test form reset on success
   - Test email pattern validation

2. **GitHub Data Fetching:** `src/lib/github.ts`
   - Cache behavior (5-minute TTL)
   - Error handling (network failures return empty array)
   - Repo filtering logic (no archived, no forks, no config repos)
   - Language detection and sorting
   - Project status determination (completed vs in-progress)

3. **Utilities:** `src/lib/utils.ts`
   - `cn()` class merging
   - `generateElementId()` formatting
   - `debounce()` timing behavior
   - `throttle()` rate limiting

4. **Custom Hooks:** `src/hooks/`
   - `useTheme()`: localStorage persistence, system preference detection, theme cycling
   - `useScrollAnimation()`: intersection observer triggering
   - `useIntersectionObserver()`: observer lifecycle, ref handling
   - `useGitHubProjects()`: loading, error, and success states

5. **Components:** `src/components/`
   - Button component: variants, sizes, loading state, disabled state
   - Card component: variants, padding options, motion animation
   - Error boundary: fallback rendering, error logging
   - Modal: open/close state, accessibility

## Mocking Strategy (Future)

**What to Mock:**
- Fetch API calls (use `jest.mock('fetch')` or MSW)
- Browser APIs (localStorage, IntersectionObserver, matchMedia)
- External libraries where needed (EmailJS, GitHub API)

**What NOT to Mock:**
- React components (test integration)
- DOM rendering (test actual output)
- Utility functions (test real logic)
- Animation libraries (test presence of animation props)

**Example Mock Pattern:**
```typescript
// Mock fetch for GitHub API tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([mockRepoData])
  })
) as jest.Mock

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    callback([{ isIntersecting: true }] as any, {} as any)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
} as any
```

## Testing Patterns to Implement

**Unit Test Structure:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button', () => {
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button id="test-btn">Click me</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-blue-600')
    })

    it('applies secondary variant styles', () => {
      render(<Button id="test-btn" variant="secondary">Click</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('bg-gray-100')
    })
  })

  describe('loading state', () => {
    it('shows spinner when loading', () => {
      render(<Button id="test-btn" isLoading>Submit</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
```

**Hook Testing Pattern:**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

describe('useTheme', () => {
  it('initializes with system theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
  })

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.setTheme('dark')
    })
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
  })

  it('cycles through themes', () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.cycleTheme() // light -> dark
      result.current.cycleTheme() // dark -> system
    })
    expect(result.current.theme).toBe('system')
  })
})
```

**Form Validation Test Pattern:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '@/components/sections/Contact'

describe('Contact Form Validation', () => {
  it('shows error when name is too short', async () => {
    const user = userEvent.setup()
    render(<Contact id="contact" />)
    
    const nameInput = screen.getByLabelText('Name *')
    await user.type(nameInput, 'a') // Only 1 character
    
    const submitBtn = screen.getByRole('button', { name: /send/i })
    await user.click(submitBtn)
    
    expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument()
  })

  it('clears error when user types', async () => {
    const user = userEvent.setup()
    render(<Contact id="contact" />)
    
    // Trigger validation
    const submitBtn = screen.getByRole('button', { name: /send/i })
    await user.click(submitBtn)
    expect(screen.getByText(/required/i)).toBeInTheDocument()
    
    // User types
    const nameInput = screen.getByLabelText('Name *')
    await user.clear(nameInput)
    await user.type(nameInput, 'John Doe')
    
    // Error clears
    expect(screen.queryByText(/name.*required/i)).not.toBeInTheDocument()
  })
})
```

**Async Function Testing:**
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useGitHubProjects } from '@/hooks/useGitHubProjects'

describe('useGitHubProjects', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('loads projects and transforms them', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockRepoData])
    })

    const { result } = renderHook(() => useGitHubProjects())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.projects).toHaveLength(1)
  })

  it('returns empty array on error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useGitHubProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.projects).toEqual([])
    expect(result.current.error).toBeTruthy()
  })
})
```

## Coverage Goals

**Recommended Targets (when implementing):**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**Start with:**
1. All utility functions in `src/lib/` (high ROI, no UI dependencies)
2. Custom hooks in `src/hooks/` (pure logic, easy to test)
3. Form validation in `Contact.tsx`
4. Data transformation in `github.ts`

**Lower Priority:**
- Presentational components (Button, Card - mostly styling)
- Animation-heavy components (integration test via E2E instead)
- 3D components (integration test only)

## Running Tests (Once Implemented)

**Commands to Add to `package.json`:**
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

**Example npm scripts:**
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

---

*Testing analysis: 2025-04-07*

**Note:** This codebase currently has no automated testing. The patterns outlined above are industry-standard Next.js practices that should be adopted incrementally, starting with utility and hook tests which provide high value with minimal dependencies.
