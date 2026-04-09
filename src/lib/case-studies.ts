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
    hook: '23+ pay-per-call web analysis apis with crypto micropayments, stripe mpp, and an autonomous build loop that generates new apis without any human involvement',
    year: '2026',
    status: 'live',
    problem: {
      heading: 'the problem',
      body: "ai agents cant use most apis because they require signup flows and billing accounts. an agent literally cant complete a signup form. x402 and stripe mpp make api access as simple as including an http header, no accounts no subscriptions needed.\n\napimesh built 23+ focused web analysis apis on this model plus a 16-tool mcp server so agents can discover and use them without having to read docs.",
    },
    approach: {
      heading: 'how it works',
      body: "each api lives on its own subdomain like core-web-vitals.apimesh.xyz. the payment flow is agent hits endpoint, gets a 402 back with the price and wallet and network, agent signs a usdc payment on base, includes the x-payment header, coinbase cdp verifies it, server returns the response.\n\nevery api has a free /preview endpoint so agents can check the format before actually paying for anything. the brain loop runs autonomously: monitor, scanner on sundays, scout, build up to 3 apis per run, security audit, staging, prod. all running on a single $4/mo hetzner arm server.",
      bullets: [
        '23+ apis on separate subdomains, independent deploy and rate limiting, no blast radius if one breaks',
        'triple payment: x402 usdc on base, stripe mpp, api key auth with atomic credit deduction',
        'free /preview endpoints so agents can verify response format before committing credits',
        'autonomous brain loop: monitor, scanner sundays, scout, build up to 3 per run, 14-pattern security audit, staging, prod',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: "23+ apis live, 16 mcp tools published on npm as @mbeato/apimesh-mcp-server, listed on smithery and the mcp registry. the brain loop has built and deployed 9 apis autonomously so far. three payment methods working.\n\n1000+ requests per day at 99% success rate. listed as a first-party mpp service alongside browserbase and dune.",
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'architecture is shaped by who the users are, ai agents not humans.',
      bullets: [
        "each api on its own subdomain over a single monolithic server. gives you independent deploy and no blast radius from one broken api taking everything down",
        "x402 pay-per-call as the default over requiring signup and api keys. agents cant complete signup flows so this is the only way that actually works",
        "free /preview on every api over pay-to-discover. agents need to confirm the api works and returns what they need before spending credits",
        "14-pattern security audit on all brain-generated code. i dont trust llm output directly, it has to pass the audit before going to prod",
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
    logo: '/logos/awesome-icon.svg',
    hook: "a curated registry of 100+ machine payments protocol projects, sdks, and services, maintained autonomously by apimesh's brain loop",
    year: '2026',
    status: 'open-source',
    problem: {
      heading: 'the problem',
      body: "mpp launched in march 2026, co-created by stripe and tempo labs. within weeks there were 100+ sdks, agent frameworks, and services popping up everywhere.\n\ndevelopers building in the space had no central directory to find anything.",
    },
    approach: {
      heading: 'how it works',
      body: "went with the awesome-list format on github. lower maintenance than a database or website, github stars work as community signal, and the pr workflow handles contributions.\n\nthe key difference from a normal awesome list is that apimesh's brain loop scanner runs every sunday, discovers new projects, and submits additions automatically.",
      bullets: [
        '15+ categories covering protocol specs, sdks in 7 languages, payment methods across 15+ chains, framework integrations',
        'autonomous maintenance via the apimesh brain loop scanner running weekly',
        'structured data in registry.json alongside the markdown for programmatic access',
      ],
    },
    outcome: {
      heading: 'what shipped',
      body: '100+ projects across 15+ categories covering 7 sdk languages and 15+ payment chains. the github repo is the product, no separate website needed.',
    },
    tradeoffs: {
      heading: 'decisions and tradeoffs',
      body: 'format and maintenance model were the main choices.',
      bullets: [
        "awesome-list format over a database or website. lower maintenance and github stars work as community signal",
        "autonomous scanning via brain loop over manual curation. catches new projects faster than i could manually",
        "the list links back to apimesh since the projects are related and cross-reference each other",
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
