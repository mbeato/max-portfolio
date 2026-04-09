---
phase: 6
slug: polish-performance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Lighthouse CLI + grep-based validation |
| **Config file** | src/lib/design-constraints.ts (ANTI_SLOP_CHECKLIST) |
| **Quick run command** | `npx next build && npx next start` |
| **Full suite command** | `npx lighthouse http://localhost:3000 --output json --chrome-flags="--headless"` |
| **Estimated runtime** | ~30 seconds (build) + ~15 seconds (lighthouse) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (verify no build errors)
- **After every plan wave:** Run full Lighthouse audit
- **Before `/gsd:verify-work`:** Full suite must be green (Lighthouse >= 90, all anti-slop checks pass)
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | COPY-10 | automated | grep patterns from ANTI_SLOP_CHECKLIST | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | PERF-01, PERF-02 | automated | `npm run build` + image sizes check | N/A | ⬜ pending |
| 06-02-01 | 02 | 2 | PERF-02, PERF-03 | manual | Lighthouse mobile audit on home + case study | N/A | ⬜ pending |
| 06-02-02 | 02 | 2 | PERF-01, COPY-10, CASE-03 | manual | mobile responsive + visual anti-slop + scannability | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile usability at 375/390/768px | PERF-01 | Viewport testing requires browser DevTools | Open DevTools, set responsive mode, check each breakpoint |
| No uniform fade-in-on-scroll | COPY-10 (item 5) | Subjective visual assessment | Scroll through entire page, verify each section has distinct animation |
| Copy in Max's voice | COPY-10 (item 13) | Tone/voice assessment | Read all copy, verify lowercase, direct, no buzzwords |
| Coral at emphasis points only | COPY-10 (item 14) | Visual color assessment | Check coral usage is limited to CTAs, hover states, peaks |
| Every animation ties to topographic concept | COPY-10 (item 15) | Conceptual assessment | Review each animation, verify topographic connection |
| Case study scannability | CASE-03 | Timed reading assessment | Time reading each case study, verify <90s for key info |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
