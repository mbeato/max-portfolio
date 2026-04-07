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

export const CASE_STUDIES: CaseStudy[] = [];

export function getAllSlugs(): string[] {
  return CASE_STUDIES.map((s) => s.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}
