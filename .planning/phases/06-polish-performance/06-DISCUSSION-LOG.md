# Phase 6: Polish & Performance - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 06-polish-performance
**Areas discussed:** Mobile audit approach, Performance optimization strategy, Anti-slop verification method, Case study scannability
**Mode:** Auto (all decisions auto-selected with recommended defaults)

---

## Mobile Responsive Audit Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Lighthouse mobile + viewport testing at 375px/390px/768px | Test at 3 key breakpoints covering smallest common, most common, and tablet. Priority sections: Hero canvas, Experience, Contact, Navigation | ✓ |
| Lighthouse mobile only | Rely solely on Lighthouse mobile simulation | |
| Full device lab testing | Test on actual physical devices across many screen sizes | |

**User's choice:** [auto] Lighthouse mobile + viewport testing at 375px/390px/768px (recommended default)
**Notes:** Three breakpoints cover the critical range. Physical device testing unnecessary for a portfolio — Lighthouse mobile simulation is sufficient for the target audience.

---

## Performance Optimization Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Measure-first: Lighthouse audit, then fix by LCP impact | Run Lighthouse before any changes. Prioritize: font loading → canvas init → image optimization → JS bundle | ✓ |
| Canvas-first optimization | Assume canvas animation is the bottleneck and optimize it first | |
| Bundle-first optimization | Analyze and reduce JS bundle size as primary strategy | |

**User's choice:** [auto] Measure-first approach (recommended default)
**Notes:** Phase 1 baseline was 98 before canvas was added. Measuring first avoids premature optimization. Canvas already has adaptive performance from Phase 4.

---

## Anti-Slop Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| Automated grep (8 items) + manual visual review (7 items) | Use ANTI_SLOP_CHECKLIST grep patterns for automatable items, manual review for subjective items across all pages | ✓ |
| Fully manual review | Visual inspection of every item on every page | |
| Automated only | Only check items with grep patterns, skip subjective items | |

**User's choice:** [auto] Automated grep + manual visual review (recommended default)
**Notes:** 8 of 15 checklist items have grep patterns in design-constraints.ts. The 7 subjective items (uniform scroll animations, voice, coral usage, animation concept) require human/AI visual judgment.

---

## Case Study Scannability

| Option | Description | Selected |
|--------|-------------|----------|
| Verify current layout: hook above fold, approach/outcome within 2-3 scrolls | Check existing case study structure meets 90-second scan. Fix layout if needed, don't rewrite content | ✓ |
| Restructure all case studies | Redesign case study page layout for maximum scannability | |
| Add summary cards | Add a TL;DR card at top of each case study | |

**User's choice:** [auto] Verify current layout (recommended default)
**Notes:** CASE-03 is already marked complete in REQUIREMENTS.md. This is a verification pass, not a redesign. Phase 3 already delivered the content structure.

---

## Claude's Discretion

- Specific Lighthouse fix prioritization beyond general order
- Font preloading strategy (next/font vs manual preload)
- Bundle analysis tooling choice
- Exact responsive CSS fixes (discovered during audit)
- Whether sections need structural mobile changes vs CSS-only tweaks

## Deferred Ideas

None — discussion stayed within phase scope.
