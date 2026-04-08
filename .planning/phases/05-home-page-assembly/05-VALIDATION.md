---
phase: 5
slug: home-page-assembly
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-08
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + ESLint |
| **Config file** | `next.config.ts`, `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | COPY-02, HOME-01 | build | `npm run build` | N/A | ⬜ pending |
| 05-02-01 | 02 | 1 | COPY-03, HOME-02 | build+lint | `npm run build && npm run lint` | N/A | ⬜ pending |
| 05-03-01 | 03 | 1 | HOME-03, SLOP-03, SLOP-09 | build | `npm run build` | N/A | ⬜ pending |
| 05-04-01 | 04 | 1 | COPY-09, HOME-04, SLOP-08 | build | `npm run build` | N/A | ⬜ pending |
| 05-05-01 | 05 | 2 | HOME-05, HOME-06, SLOP-10, SLOP-11 | build+lint | `npm run build && npm run lint` | N/A | ⬜ pending |
| 05-06-01 | 06 | 2 | SECT-01, SECT-02, SLOP-05 | build | `npm run build` | N/A | ⬜ pending |
| 05-07-01 | 07 | 3 | HOME-07, PERF-04 | build | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed — validation via build success, lint pass, and manual visual checks.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero subtitle appears after puzzle solve | COPY-02 | Requires browser interaction (puzzle) | Complete puzzle → verify subtitle text below name |
| About photos render correctly | HOME-02 | Visual layout check | Scroll to About → verify 4 photos visible, not stretched |
| Recruiter 2-scroll + 1-click path | HOME-07 | UX flow measurement | From hero, scroll twice, verify case study link reachable |
| Section transitions are visually connected | SECT-01 | Visual design judgment | Scroll through all sections → verify TopoSvgDivider renders at transitions |
| Each section has distinct animation | SECT-02, SLOP-05 | Animation variety is visual | Scroll through → verify no two sections use identical animation |
| No anti-slop violations | SLOP-03, SLOP-08, SLOP-09, SLOP-10, SLOP-11 | Visual/copy audit | Run anti-slop checklist against rendered page |
| Contact form voice matches Max | HOME-05 | Copy tone judgment | Read contact copy → verify lowercase, direct, no buzzwords |
| Resume PDF downloads | PERF-04 | Browser download behavior | Click resume link in nav and contact → verify PDF opens |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-08
