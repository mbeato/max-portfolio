export interface TechTag {
  label: string;
  category: 'runtime' | 'framework' | 'database' | 'protocol' | 'service' | 'tool';
}

export interface CaseStudyLink {
  label: string;
  url: string;
  type: 'live' | 'github' | 'npm' | 'docs';
}

export interface CaseStudySection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  hook: string;
  problem: CaseStudySection;
  approach: CaseStudySection;
  outcome: CaseStudySection;
  tradeoffs: CaseStudySection;
  tech: TechTag[];
  links: CaseStudyLink[];
  year?: string;
  status?: 'live' | 'private' | 'open-source';
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'tonos',
    title: 'tonos',
    hook: 'a voice profile api that learns how you write and generates text that sounds like you — not like an ai assistant',
    year: '2025',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "LLMs write in their own voice, not yours. when you use Claude or GPT to draft a message, it sounds formal, structured, slightly over-explained — like an ai assistant wrote it, because one did.\n\nthe gap is especially obvious in short-form — Slack messages, emails, DMs. you can tell immediately when someone's AI wrote their message. tonos solves this by learning your actual writing patterns from real messages you've sent.",
    },
    approach: {
      heading: 'how it works',
      body: "submit 10-20 real message samples. tonos analyzes them across voice dimensions — formality, punctuation style, sentence length, directness, warmth — and generates a structured voice profile. then call tonos_draft_message or tonos_rewrite_text from any MCP-compatible client.\n\nunder the hood: a RAG pipeline using Voyage AI embeddings retrieves relevant samples at generation time. a credit system atomically deducts before generation so you never get charged for a failed call. SSE streaming via Hono keeps responses snappy.",
      bullets: [
        '7 mcp tools — submit samples, generate profile, draft, rewrite, feedback',
        'voice dimensions: formality, punctuation, sentence length, directness, warmth, humor',
        'platform modes — linkedin auto-capitalizes even for casual writers',
        'bun + hono serving sub-5ms page renders, no react hydration overhead',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: "tonos exposes 7 MCP tools that connect to Claude Code, Cursor, and any MCP client. users submit samples, generate a profile, then draft or rewrite from inside their AI assistant. live at tonos.fyi with Stripe billing, OAuth login, and an API key system for programmatic access.",
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'two architectural choices define how tonos stores and serves voice data.',
      bullets: [
        "rejected storing raw message history for rag — voice profile json with structured dimensions is portable, explainable, and doesn't grow unboundedly",
        'rejected react/next.js for the web app — server-rendered jsx via typed-htmx + hono means no hydration overhead, and the product is api-first anyway',
      ],
    },
    tech: [
      { label: 'Bun', category: 'runtime' },
      { label: 'Hono', category: 'framework' },
      { label: 'Anthropic SDK', category: 'service' },
      { label: 'PostgreSQL + pgvector', category: 'database' },
      { label: 'Voyage AI', category: 'service' },
      { label: 'Stripe', category: 'service' },
      { label: 'Zod', category: 'tool' },
      { label: 'MCP SDK', category: 'protocol' },
    ],
    links: [
      { label: 'live', url: 'https://tonos.fyi', type: 'live' },
      { label: 'github', url: 'https://github.com/mbeato/tonos', type: 'github' },
    ],
  },
  {
    slug: 'vtx',
    title: 'vtx athlete',
    hook: 'an athlete scoring engine that ranks training, social presence, and competition results into a single 0-1000 score for brand sponsorship matching',
    year: '2025',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "brands want to sponsor athletes who are actively training, posting consistently, and competing — not just athletes with big follower counts. the athlete who posts every day but hasn't run a race in six months isn't worth the same as someone doing both.\n\nmanually reviewing athlete profiles across Strava, Instagram, and competition results doesn't scale. there's no single metric that captures 'this athlete is worth sponsoring right now.'",
    },
    approach: {
      heading: 'how it works',
      body: 'three independent signals feed into a composite score. training comes from Strava webhooks — 90-day rolling window. social comes from the Instagram API — 90-day rolling, logarithmic scale to avoid mega-influencer domination. competition results are all-time, top-N average. equal weight average produces the VTX Score.\n\nleaderboard snapshots every 15 minutes, daily archival. distributed locking prevents duplicate score calculations when multiple server instances fire simultaneously.',
      bullets: [
        'three signals: training (strava webhooks, 90-day), social (instagram, 90-day, logarithmic), competition (all-time, top-n average)',
        'equal weight by design — changing weights later is a config change, not a data migration',
        'logarithmic scale on social audience — 100k engaged followers scores comparably to 10m passive followers',
        'nestjs + graphql code-first schema, postgresql via typeorm, redis cache, bull queues',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: 'multi-platform data aggregation feeding into a scoring engine with leaderboards, dashboards, and an Expo mobile app (iOS + Android). athlete scores update within minutes of new training or social activity. sponsor dashboard launching March 2026.',
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'scoring design is where the interesting choices were.',
      bullets: [
        "equal weight (1/3 each) vs weighted scoring — rejected weighting because business priorities change. equal weights = config change later, not a data migration",
        "90-day rolling windows vs all-time — sponsors care about current activity, not lifetime stats. athletes can't coast on historical performance",
        'soft-delete for out-of-window posts — posts older than 90 days soft-deleted for storage, but historical score rebuilds include them so past scores stay accurate',
      ],
    },
    tech: [
      { label: 'NestJS', category: 'framework' },
      { label: 'GraphQL + Apollo', category: 'framework' },
      { label: 'PostgreSQL + TypeORM', category: 'database' },
      { label: 'Redis', category: 'database' },
      { label: 'Bull', category: 'tool' },
      { label: 'AWS Cognito', category: 'service' },
      { label: 'Expo', category: 'framework' },
      { label: 'Strava API', category: 'service' },
    ],
    links: [
      { label: 'live', url: 'https://vtxathlete.com', type: 'live' },
    ],
  },
  {
    slug: 'apimesh',
    title: 'apimesh',
    hook: '27 pay-per-call web analysis apis with crypto micropayments and an autonomous build loop that discovers demand, generates apis, and deploys without human involvement',
    year: '2026',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "AI agents can't use most APIs because they require signup flows, billing accounts, or OAuth — agents can't complete a signup form. x402 makes API access as simple as an HTTP header. no accounts, no subscriptions.\n\nAPIMesh built 27 focused web analysis APIs on this model, plus a 25-tool MCP server so agents can discover and use them without reading docs.",
    },
    approach: {
      heading: 'how it works',
      body: "each API lives on its own subdomain (core-web-vitals.apimesh.xyz, security-headers.apimesh.xyz). the payment flow: agent hits endpoint, gets 402 with price, wallet, and network. agent signs a USDC payment on Base, includes the X-PAYMENT header. Coinbase CDP verifies the signature. server returns the response.\n\nevery API has a free /preview endpoint — agents can verify the response format before paying. the brain loop runs autonomously: monitor → scanner (Sundays) → scout → build (up to 3 apis/run) → security audit → staging → prod.",
      bullets: [
        '27 apis on separate subdomains — independent deploy, independent rate limiting, no blast radius',
        'x402 payment flow: 402 response → usdc signature on base → coinbase cdp verification → response',
        'free /preview endpoints — agents verify response format before committing credits',
        'autonomous brain loop: monitor → scanner (sundays) → scout → build (up to 3 apis/run) → security audit → staging → prod',
        'brain loop security: external data sanitized, system-role prompt rules, 14+ vulnerability pattern audit on generated code',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: '27 APIs live on subdomain routing, 25 MCP tools published to npm as @mbeato/apimesh-mcp-server, listed on Smithery and MCP Registry. the brain loop has autonomously built and deployed 9 APIs. three payment methods: x402 USDC on Base, Stripe MPP, and API key auth.',
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'the architecture is shaped by who the users are — ai agents, not humans.',
      bullets: [
        "rejected single monolithic api server — each api on its own subdomain for independent deploy and no blast radius from one broken api affecting others",
        "rejected requiring signup/api keys as default — x402 pay-per-call is the default because ai agents can't complete a signup flow",
        "free /preview on every api — rejected 'pay-to-discover' because agents need to confirm the api does what they need before committing credits",
        "security hardening on brain loop — rejected trusting llm output directly. generated code goes through a 14-pattern security audit before staging",
      ],
    },
    tech: [
      { label: 'Bun', category: 'runtime' },
      { label: 'Hono', category: 'framework' },
      { label: 'x402', category: 'protocol' },
      { label: 'Coinbase CDP', category: 'service' },
      { label: 'Stripe MPP', category: 'service' },
      { label: 'Cheerio', category: 'tool' },
      { label: 'OpenAI', category: 'service' },
      { label: 'MCP SDK', category: 'protocol' },
      { label: 'SQLite', category: 'database' },
      { label: 'Caddy', category: 'tool' },
    ],
    links: [
      { label: 'live', url: 'https://apimesh.xyz', type: 'live' },
      { label: 'github', url: 'https://github.com/mbeato/APIMesh', type: 'github' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@mbeato/apimesh-mcp-server', type: 'npm' },
    ],
  },
  {
    slug: 'awesome-mpp',
    title: 'awesome-mpp',
    hook: 'a curated registry of 100+ machine payments protocol projects, sdks, and services — maintained autonomously by apimesh\'s brain loop',
    year: '2026',
    status: 'open-source',
    problem: {
      heading: 'the problem',
      body: "MPP launched in March 2026 — co-created by Stripe and Tempo Labs. within weeks, 100+ SDKs, agent frameworks, and services appeared. developers building in the space had no central directory.",
    },
    approach: {
      heading: 'how it works',
      body: "awesome-list format on GitHub — lower maintenance burden than a database or website, GitHub stars and forks as community signal, pull request workflow for contributions. what distinguishes it from a manually-curated list: APIMesh's brain loop scanner runs every Sunday, discovers new projects, and submits additions autonomously.",
      bullets: [
        '15+ categories: protocol specs, sdks (7 languages), payment methods (15+ chains), framework integrations, infrastructure, agent tools',
        'autonomous maintenance — apimesh brain loop scanner runs weekly, discovers new projects, submits additions',
        'structured data in registry.json alongside the markdown for programmatic access',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: '100+ projects catalogued across 15+ categories, covering 7 SDK languages and 15+ payment chains. the GitHub repo is the product — no separate website needed.',
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'format and maintenance model were the key choices.',
      bullets: [
        "chose awesome-list format over a structured database/website — lower maintenance, github stars as community signal, pr workflow for contributions",
        "autonomous maintenance via brain loop vs manual curation — the scanner catches new projects faster than a human curator could",
        "the list explicitly links back to apimesh — these projects are related and cross-reference each other",
      ],
    },
    tech: [
      { label: 'Markdown', category: 'tool' },
      { label: 'GitHub Pages', category: 'service' },
    ],
    links: [
      { label: 'github', url: 'https://github.com/mbeato/awesome-mpp', type: 'github' },
    ],
  },
];

export function getAllSlugs(): string[] {
  return CASE_STUDIES.map((s) => s.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}
