/**
 * Anti-slop checklist from DESIGN.md section 9.
 * Referenced by planners and executors at every phase gate.
 * Each item must pass for the phase to ship.
 */
export const ANTI_SLOP_CHECKLIST = [
  { id: 1, rule: 'No Inter typeface anywhere', grep: 'Inter' },
  { id: 2, rule: 'No gradient backgrounds, text, or borders', grep: 'gradient' },
  { id: 3, rule: 'No bento grid layout', grep: 'bento' },
  { id: 4, rule: 'No typewriter animation', grep: 'typewriter' },
  { id: 5, rule: 'No uniform fade-in-on-scroll', grep: null },
  { id: 6, rule: 'No particle/star/floating object decoration', grep: 'particle|starfield|floating' },
  { id: 7, rule: 'No glassmorphism or frosted cards', grep: 'glassmorphism|frosted' },
  { id: 8, rule: 'No skill bars or percentage indicators', grep: 'skill-bar|progress-bar' },
  { id: 9, rule: 'No technology logo grid', grep: 'logo-grid|tech-grid' },
  { id: 10, rule: 'No generic CTA copy', grep: 'build something amazing|available for opportunities' },
  { id: 11, rule: 'No shadcn/MUI default visual styling on layout elements', grep: null },
  { id: 12, rule: 'No cursor trail effects', grep: 'cursor-trail|cursor-follow' },
  { id: 13, rule: 'Copy reads in Max voice (lowercase, direct, specific)', grep: null },
  { id: 14, rule: 'Coral appears at emphasis points only — never on large surfaces', grep: null },
  { id: 15, rule: 'Every animation ties back to the topographic concept', grep: null },
] as const;

export type AntiSlopItem = (typeof ANTI_SLOP_CHECKLIST)[number];
