# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**GitHub API:**
- Service: GitHub REST API v3
  - What it's used for: Fetching public repositories and project data for portfolio showcase
  - SDK/Client: Native `fetch` API (no SDK)
  - Base URL: `https://api.github.com`
  - Authentication: Optional (supports `Authorization: token` header for increased rate limits)
  - Username: `mbeato`
  - Implementation: `src/lib/github.ts`
  - Caching: 5-minute in-memory cache to avoid rate limiting
  - Endpoints used:
    - `GET /users/{username}/repos` - Fetch all public repositories
    - `GET /repos/{owner}/{repo}/languages` - Fetch languages for specific repository

**Email Service (EmailJS):**
- Service: EmailJS (client-side email)
  - What it's used for: Contact form submission and email delivery
  - SDK/Client: `@emailjs/browser` (4.4.1)
  - Type: Browser-based (no backend required)
  - Implementation: `src/components/sections/Contact.tsx`
  - Initialization: On-demand in form submission handler
  - Demo mode: Supported (form works without credentials configured)
  - Configuration: Required environment variables below

## Environment Configuration

**Required env vars (optional for demo mode):**
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - EmailJS email template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - EmailJS public API key

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to browser. These are intentionally public for EmailJS.

**Optional env vars:**
- `GITHUB_TOKEN` - GitHub API token (commented out in `src/lib/github.ts` line 85, for increased rate limits)

## Data Storage

**Databases:**
- None - Static portfolio site with no persistent database

**File Storage:**
- Local filesystem only - Images and assets in `public/` directory

**Caching:**
- In-memory cache (5-minute TTL) for GitHub API responses in `src/lib/github.ts`
- No external cache layer (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- None required - Portfolio is public-facing
- Social profiles linked via URLs only (GitHub, LinkedIn, email)

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Datadog, or similar integration

**Logs:**
- Browser console only (`console.error` used in `src/lib/github.ts` and `src/components/sections/Contact.tsx`)
- No centralized logging service

**Performance Monitoring:**
- Vercel analytics (configured via `.vercel/` directory)
- Lighthouse reports present (dev artifacts)

## CI/CD & Deployment

**Hosting:**
- Vercel - Detected via `.vercel/` directory, site deployed to `https://maximusbeato.com`

**CI Pipeline:**
- Vercel automatic deployments (git push triggers builds)
- No GitHub Actions or external CI/CD configuration found

**Build Configuration:**
- Next.js build via `npm run build`
- TypeScript and ESLint errors ignored during build (`next.config.ts`)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- EmailJS backend service callback (automatic via `@emailjs/browser` library)

## Social & Contact Integration

**Social Links (hardcoded in constants):**
- GitHub: `https://github.com/mbeato`
- LinkedIn: `https://linkedin.com/in/maximus-beato`
- Email: `maximus.beato@gmail.com`
- Location: West Lafayette, IN
- Timezone: America/New_York

## Rate Limiting & Quotas

**GitHub API:**
- Unauthenticated: 60 requests/hour per IP
- With token: 5,000 requests/hour per user
- Current implementation: In-memory 5-minute cache mitigates rate limit issues

**EmailJS:**
- Free tier: Limited requests (check EmailJS dashboard)
- Demo mode: Simulates email send for testing without credentials

## Configuration Files & Secrets

**Secrets location:**
- `.env.local` - Contains EmailJS credentials and optional GitHub token
- File is gitignored (not committed to repository)

**Configuration files:**
- `next.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - Linting rules

---

*Integration audit: 2026-04-07*
