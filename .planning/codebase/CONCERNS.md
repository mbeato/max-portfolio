# Codebase Concerns

**Analysis Date:** 2026-04-07

## Build Configuration Issues

**TypeScript and ESLint Errors Ignored:**
- Issue: `next.config.ts` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true` for both TypeScript and ESLint
- Files: `next.config.ts`
- Impact: Compilation errors and linting violations are silently ignored, allowing broken code to reach production. This masks real issues and makes debugging harder.
- Fix approach: Identify and fix all TypeScript type errors and ESLint violations. Remove the ignore flags and address errors at their source. Use type assertions only when absolutely necessary and document why.

## Performance Bottlenecks

**3D Component Bundle Size:**
- Problem: Three.js, @react-three/fiber, and @react-three/drei are heavy dependencies. Multiple 3D components (EarthModel, SkillBubbles, FloatingShapes) are bundled even if users never see them.
- Files: `src/components/3d/EarthModel.tsx`, `src/components/3d/SkillBubbles.tsx`, `src/components/3d/FloatingShapes.tsx`
- Cause: 3D libraries are loaded upfront despite lazy-loading wrapper in `Lazy3DComponent.tsx`. Code splitting helps but bundle remains large.
- Improvement path: Verify route-based code splitting works correctly. Consider moving Three.js imports behind dynamic imports with `ssr: false`. Monitor bundle size with `next/bundle-analyzer`. Consider replacing heavy 3D elements with simpler CSS/SVG animations for non-essential visual effects.

**Canvas Texture Generation in EarthModel:**
- Problem: `EarthModel.tsx` generates a 2048x1024 pixel canvas texture dynamically on every render with multiple continents drawn via expensive path operations.
- Files: `src/components/3d/EarthModel.tsx` (lines 30-100)
- Cause: Procedural texture generation is computationally expensive. Calculating organic continent shapes with noise functions in a loop is inefficient.
- Improvement path: Pre-render the Earth texture as a static image asset. Use image textures instead of canvas-based generation. This reduces runtime CPU usage and allows Three.js to cache the texture efficiently.

**GitHub API Rate Limiting:**
- Problem: `useGitHubProjects()` hook fetches all repositories on mount without rate limit awareness. Multiple page loads or rapid re-fetches can hit GitHub's 60-request/hour unauthenticated limit.
- Files: `src/hooks/useGitHubProjects.ts`, `src/lib/github.ts` (lines 70-114)
- Cause: No GitHub token in environment, and 5-minute client-side cache may not persist across sessions or multiple tabs.
- Improvement path: Add GitHub token (`process.env.NEXT_PUBLIC_GITHUB_TOKEN`) to increase rate limit to 5000/hour. Implement persistent cache (localStorage or server-side). Add rate-limit error handling and user feedback when limit is exceeded.

## Security Considerations

**Client-Side EmailJS Configuration Exposure:**
- Risk: EmailJS credentials (`serviceId`, `templateId`, `publicKey`) are exposed via `NEXT_PUBLIC_*` environment variables and visible in browser network requests.
- Files: `src/lib/constants.ts` (lines 178-184), `src/components/sections/Contact.tsx` (lines 88-107)
- Current mitigation: Keys are NEXT_PUBLIC (expected), and EmailJS is designed for client-side use. However, this still allows anyone to see and potentially abuse your EmailJS service.
- Recommendations: (1) Use EmailJS rate limiting and domain restrictions in dashboard. (2) Consider moving email submission to a Next.js API route (`/api/send-email`) to hide credentials and add server-side validation. (3) Add CAPTCHA/honeypot field to prevent spam. (4) Document in `.env.example` what credentials are needed.

**localStorage Without Validation:**
- Risk: `AccessibilityProvider.tsx` and `useTheme.ts` read `localStorage` without validating JSON structure. Corrupted data could cause errors.
- Files: `src/components/ui/AccessibilityProvider.tsx` (lines 54-62), `src/hooks/useTheme.ts`
- Current mitigation: Try-catch wraps JSON.parse calls
- Recommendations: Validate parsed data against expected shape using a schema validator. Set stricter localStorage quotas and handle quota-exceeded errors gracefully.

**Form Input Not Sanitized:**
- Risk: Contact form in `Contact.tsx` sends user input directly to EmailJS without sanitization. While EmailJS handles escaping, XSS vectors via crafted template injection are possible.
- Files: `src/components/sections/Contact.tsx` (lines 94-107)
- Current mitigation: EmailJS handles escaping. Client-side validation prevents obviously malformed input.
- Recommendations: Validate input on server side if moving to API route. Consider using a dedicated email service library with built-in security (SendGrid, Resend).

**No CSRF Protection on Form:**
- Risk: Contact form has no CSRF token. If this becomes a server-side endpoint in future, it would be vulnerable.
- Files: `src/components/sections/Contact.tsx`
- Impact: Currently low (form is client-side only and uses a third-party service), but risk increases if architecture changes.

## Fragile Areas

**Contact Form State Management:**
- Files: `src/components/sections/Contact.tsx` (lines 21-28, 79-124)
- Why fragile: Complex state flow with `formState`, `formData`, and `errors` managed separately. Timeout-based state reset (lines 117, 122) can leave UI in inconsistent state if component unmounts during timeout. No debouncing on error clearing (line 70) means rapid typing triggers state updates per keystroke.
- Safe modification: Refactor to single state object or use a state machine (e.g., XState). Move timeout cleanup to proper effect. Debounce error clearing with 300ms delay.
- Test coverage: No tests visible. Unit tests needed for form validation, error states, and state transitions.

**Experience Component Card Carousel:**
- Files: `src/components/sections/Experience.tsx` (lines 27-100)
- Why fragile: Manual geometry calculations for card positioning (`totalWidth`, `maxDraggable`, `step`). Window resize events could cause calculated values to become stale. Drag animation logic is tightly coupled to card width calculations.
- Safe modification: Memoize geometry calculations and re-run only when container width changes. Use `ResizeObserver` instead of relying on state updates. Add error boundaries for null checks on refs.
- Test coverage: No visible tests for edge cases (empty experiences, single experience, very small screens).

**GitHub Project Data Transformation:**
- Files: `src/lib/github.ts` (lines 157-203)
- Why fragile: Category determination uses simplistic language detection (lines 161-174). Projects with mixed languages get misclassified. Status determination is threshold-based (line 179) without accounting for drafts or archived repos. "Featured" logic uses magic numbers (5 stars, 1 month old) that may not reflect actual portfolio goals.
- Safe modification: Make category/status/featured logic configurable. Add metadata file or labels in repos for manual classification. Test with various repo configurations.
- Test coverage: No unit tests for `convertRepoToProject()` or category/status logic.

**3D Component WebGL Detection:**
- Files: `src/components/ui/Lazy3DComponent.tsx` (lines 69-83)
- Why fragile: Canvas context check runs only once on mount. Does not retry if WebGL becomes unavailable. Manual canvas cleanup calls `getExtension()` which may fail silently. No error logging if cleanup fails.
- Safe modification: Add try-catch around canvas operations. Log errors. Consider retry logic or fallback to 2D rendering if available.

## Test Coverage Gaps

**No Unit Tests for Core Logic:**
- What's not tested: GitHub API integration, project categorization, form validation, email sending
- Files: `src/lib/github.ts`, `src/components/sections/Contact.tsx`, `src/lib/constants.ts`
- Risk: Bugs in form validation or API error handling go unnoticed until production. Contact form logic is safety-critical (user data) but untested.
- Priority: High — Add tests for `validateForm()` in Contact, `convertRepoToProject()` in github.ts, and error scenarios.

**No E2E Tests:**
- What's not tested: Form submission flow, navigation between sections, GitHub integration real data
- Risk: Changes to component structure or state management can silently break user workflows
- Priority: Medium — Add Playwright or Cypress tests for critical user paths (navigation, contact form, project viewing)

**Animation Edge Cases Untested:**
- What's not tested: Reduced motion preference handling, animation cleanup on unmount, animation interrupt handling
- Files: `src/components/ui/PerformanceProvider.tsx`, `src/components/sections/Experience.tsx`
- Risk: Users with `prefers-reduced-motion` may still see janky animations if logic fails. Unmounting during animation transitions could leave refs in inconsistent state.
- Priority: Medium

## Dependencies at Risk

**EmailJS Outdated Pattern:**
- Risk: Initializing EmailJS on every form submit (line 92 in Contact.tsx) is inefficient and not recommended
- Impact: Extra initialization call per submission; potential memory leaks if not cleaned up
- Migration plan: Initialize EmailJS once at app root or in a shared effect. Use a ref to check if already initialized.

**@emailjs/browser Maintenance:**
- Risk: EmailJS ecosystem is less actively maintained than major frameworks
- Impact: Security vulnerabilities may not be patched quickly
- Alternative: Consider moving to SendGrid API (already in skills), Resend, or Nodemailer with server-side endpoint

**react-intersection-observer Version:**
- Risk: Currently using v9.16.0 (2024 release). Intersection Observer API is native in modern browsers; this library adds minimal value.
- Impact: Extra dependency weight (~3KB) with limited benefit
- Recommendation: Migrate to native Intersection Observer API. The code already uses it for 3D component detection (Lazy3DComponent.tsx lines 59-62). Could be refactored to use native API consistently.

## Missing Critical Features

**No Error Recovery for GitHub API Failures:**
- Problem: If GitHub API is down, Projects section shows error message with no way to manually refetch without page reload
- Blocks: Users can't see projects if API fails temporarily
- Impact: Portfolio appears broken even if issue is temporary
- Solution: Add persistent retry logic with exponential backoff. Cache last successful response. Show cached data with "stale data" indicator.

**No Offline Support:**
- Problem: Portfolio requires online access to fetch projects. No service worker or offline fallback.
- Blocks: Portfolio unusable on slow/no connection
- Impact: Poor experience for mobile users or in poor connectivity areas
- Solution: Implement service worker to cache critical assets and GitHub data. Show cached projects with offline indicator.

**No Form Rate Limiting or Spam Prevention:**
- Problem: Contact form can be submitted repeatedly without any throttling
- Blocks: Inbox spam, potential DoS via automation
- Impact: User inbox flooded with duplicate messages
- Solution: (1) Client-side: Disable button for 5 seconds after submit. (2) Server-side (if moved to API): Implement IP-based rate limiting and CAPTCHA.

## Known Bugs & Quirks

**EmailJS Demo Mode Not Clear:**
- Issue: When EmailJS is not configured, form shows "Demo Mode" notice (Contact.tsx line 482-485) but still displays success message, which could mislead users into thinking email was sent.
- Symptoms: Users in demo mode see success confirmation but no email is actually sent
- Workaround: Notice text is present but could be more prominent. Consider disabling submit button in demo mode.
- Recommendation: Make demo mode behavior more explicit (different button text, no success state, or warning dialog).

**Timezone Hardcoded:**
- Issue: `SITE_CONFIG.timezone` is hardcoded to "America/New_York" but should reflect actual location or user preference
- Impact: Misleading if you move locations or want to display client's time instead
- Fix: Make timezone dynamic based on location or system preference

## Accessibility Concerns

**Screen Reader Detection Unreliable:**
- Issue: `AccessibilityProvider.tsx` (lines 112-124) uses user-agent string matching for screen reader detection, which is fragile
- Impact: Screen readers not in the hardcoded list won't be detected
- Fix: Rely on `aria-live` and `aria-label` throughout app rather than trying to detect screen readers. Ensure all interactive elements have proper ARIA labels.

**No Focus Management Between Sections:**
- Issue: Navigation between sections doesn't move focus to section heading
- Impact: Keyboard users may not realize they've navigated to a new section
- Fix: Implement `skipToContent` links and focus management on navigation

## Scaling Limits

**Hard-Coded Experience/Project Data:**
- Problem: Experience list is hardcoded in component (Experience.tsx lines 38-86). As you add more experiences, component becomes unmaintainable.
- Current capacity: 3 experiences shown in hardcoded array
- Recommendation: Move to external data source (CMS, JSON file, or API). Parametrize the component.

**localStorage for Accessibility Settings:**
- Problem: Settings stored in localStorage with no sync mechanism across tabs/windows
- Current capacity: Works for single session, but inconsistent if user opens portfolio in multiple tabs
- Scaling path: Use server-side storage (auth system) or implement cross-tab sync via SharedWorker or BroadcastChannel API

**GitHub API Performance:**
- Problem: Fetching 100 repos with language data for each means 100+ API calls
- Current capacity: Works fine with <100 public repos and good connection
- Scaling path: Implement pagination, cache aggressively, or move to server-side fetching with incremental updates

---

*Concerns audit: 2026-04-07*
