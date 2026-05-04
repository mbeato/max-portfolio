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
  logo?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'tonos',
    title: 'tonos',
    hook: 'a voice profile api that learns how you write and generates messages that actually sound like you',
    year: '2025',
    status: 'live',
    logo: '/logos/tonos-icon.png',
    problem: {
      heading: 'the problem',
      body: "llms write in their own voice. when you use claude or gpt to draft a message it comes out formal and over-explained, like you can immediately tell when someone's ai wrote their slack message or email. tonos fixes this by learning your actual writing patterns from real messages.",
    },
    approach: {
      heading: 'how it works',
      body: "you submit 10-20 real message samples. tonos runs a two-pass claude pipeline where haiku observes each batch and extracts structured signals, then sonnet synthesizes a 16-dimension voice profile. generation uses rag with voyage ai embeddings to pull relevant samples at inference time. credit system does atomic deduction before generation so failed calls dont cost anything. the whole thing runs on bun + hono with sse streaming.",
      bullets: [
        '7 mcp tools for submitting samples, generating profile, drafting, rewriting, feedback',
        '16 voice dimensions including formality, punctuation, sentence length, directness, warmth',
        'platform-aware drafting, linkedin mode auto-capitalizes even for casual writers',
        'bun + hono on hetzner, sub-5ms page renders, no react hydration overhead',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: "7 mcp tools that connect to claude code, cursor, and any mcp client. live at tonos.fyi with stripe billing, oauth login for google and github, api key auth. 63 test files including 10 owasp security suites. 33 phases built.",
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'two architectural choices that shaped the whole project.',
      bullets: [
        "voice profile json over raw message history for rag. structured dimensions are portable, explainable, and dont grow unboundedly",
        'hono jsx + htmx over react/next.js. no hydration overhead and the product is api-first anyway, the web ui is secondary',
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
    logo: '/logos/vtx-icon.svg',
    hook: 'built a composite scoring engine that pulls training data, social metrics, and competition results into a single 0-1000 score so sponsors can actually find athletes worth working with',
    year: '2025',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "brands want to sponsor athletes who are actively training, posting, and competing, not just people with follower counts. manually going through strava profiles and instagram pages and competition results doesnt scale at all.\n\nbasically theres no single metric that tells you whether an athlete is worth sponsoring right now versus six months ago.",
    },
    approach: {
      heading: 'how it works',
      body: "we pull data from multiple platforms and aggregate it into a composite score that reflects actual sponsorship value, not just raw follower counts. sponsors get a dashboard where they can filter and search athletes based on scores and other criteria.\n\ncant go into too much detail on the scoring internals since im under nda, but the general idea is normalizing signals from different sources so you can compare athletes across sports and audience sizes.",
      bullets: [
        'nestjs backend with graphql api, postgresql via typeorm, redis for caching',
        'expo react native mobile app for ios and android',
        'multi-platform data aggregation from social, training, and competition sources',
        'bull queues for background processing, kubernetes for orchestration',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: "multi-platform data aggregation feeding a scoring engine with leaderboards, dashboards, and an expo mobile app for ios and android. scores update within minutes of new activity.\n\n60+ athletes on the platform. also rebuilt ci/cd cutting deploy time from 3hrs to 15min and reduced aws costs by 45%.",
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'infrastructure and architecture choices were the main decisions i can talk about.',
      bullets: [
        "nestjs monolith over microservices. at our scale a single deployable unit is simpler to operate and debug, splitting can happen later if needed",
        "graphql over rest. the mobile app and web dashboard need very different data shapes from the same endpoints, graphql lets each client request exactly what it needs",
        "rebuilt ci/cd from manual deploys to a 5-stage gitlab pipeline. cut deploy from 3hrs to 15min which made shipping way less painful",
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
    logo: '/logos/apimesh-icon.svg',
    hook: 'single-purpose dev tools that solve one specific pain. each wedge stands alone — its own subdomain, its own demo, no signup.',
    year: '2026',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "started early 2026 as a marketplace of pay-per-call web analysis apis with an autonomous build loop. the marketplace framing didnt land — human devs wanted flat pricing on focused tools, not crypto micropayments on a hundred half-built endpoints, and the autonomous build loop generated more breadth than signal.\n\npivoted in april 2026 to single-pain wedge products. each wedge is its own focused tool with its own subdomain, its own seo term, its own honest scope. the umbrella brand recedes — the wedges are the products.",
    },
    approach: {
      heading: 'how it works',
      body: "wedges ship standalone on their own subdomains like agentsmd.apimesh.xyz. shared chassis under the hood — caddy routing, bun + hono, single $4/mo hetzner arm server — but each wedge is independently deployable with no blast radius if one breaks.\n\nwedges are picked by pain not by topic. if a developer hits the same wall three times and there isnt a small focused fix already, that's a wedge candidate. if a wedge grows past one specific job, it splits into a new one.",
      bullets: [
        'agentsmd — fan AGENTS.md out to CLAUDE.md, .cursorrules, .clinerules, .windsurfrules. cli + mcp server, no copy-paste tax.',
        'stripesig — paste a failing stripe (or github / slack / shopify) webhook, get a plain-english reason and the fix in 5 seconds.',
        'each wedge on its own subdomain, independently deployed, independently brandable.',
        'shared chassis: caddy + bun + hono + sqlite on one hetzner arm. mcp server published to npm as @mbeato/apimesh-mcp-server.',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: "two live wedges as of may 2026 — agentsmd and stripesig — each on its own subdomain with its own demo and seo target. mcp server on npm.\n\nthe pivot has a real cost to own: ~90 apis from the original marketplace are being culled by a 14-day-zero-revenue prune script. lesson taken — ship fewer focused tools that earn their pain instead of generating breadth autonomously.",
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'the biggest decision was killing the marketplace strategy after six months of building it.',
      bullets: [
        'pivoted from marketplace to single-pain wedges in april 2026. the marketplace framing assumed agents would be the buyers; turned out human devs wanted flat pricing on focused tools.',
        'turned off the autonomous build loop. it generated breadth without signal — most apis got zero usage. the prune script removes any wedge that goes 14 days with zero revenue.',
        'each wedge gets its own subdomain and own seo term over a unified marketplace. lets each tool earn its own pain on its own.',
        'kept x402 and stripe mpp wired up as free upside, not the primary pitch. agent payments are a real ecosystem but not yet a real distribution channel.',
      ],
    },
    tech: [
      { label: 'Bun', category: 'runtime' },
      { label: 'Hono', category: 'framework' },
      { label: 'Caddy', category: 'tool' },
      { label: 'SQLite', category: 'database' },
      { label: 'OpenAI', category: 'service' },
      { label: 'MCP SDK', category: 'protocol' },
      { label: 'x402', category: 'protocol' },
      { label: 'Stripe MPP', category: 'service' },
    ],
    links: [
      { label: 'agentsmd', url: 'https://agentsmd.apimesh.xyz', type: 'live' },
      { label: 'stripesig', url: 'https://stripesig.apimesh.xyz', type: 'live' },
      { label: 'github', url: 'https://github.com/mbeato/conway', type: 'github' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@mbeato/apimesh-mcp-server', type: 'npm' },
    ],
  },
];

export function getAllSlugs(): string[] {
  return CASE_STUDIES.map((s) => s.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}
