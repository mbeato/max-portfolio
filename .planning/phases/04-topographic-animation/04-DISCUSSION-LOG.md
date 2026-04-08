# Phase 4: Topographic Animation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-07
**Phase:** 04-topographic-animation
**Areas discussed:** Canvas rendering approach, Visual character & feel, Section transition accents, Performance & mobile strategy

---

## Canvas Rendering Approach

### Noise Library

| Option | Description | Selected |
|--------|-------------|----------|
| simplex-noise (npm) | Lightweight, well-maintained, pure JS. ~2KB gzipped | ✓ |
| Custom noise implementation | Roll minimal simplex noise inline — zero deps, more code | |
| open-simplex-noise | Alternative package, smoother gradients, ~3KB | |

**User's choice:** simplex-noise (npm)
**Notes:** None — straightforward choice

### Canvas-Hero Relationship

| Option | Description | Selected |
|--------|-------------|----------|
| Background layer behind hero content | Canvas sits behind hero text, z-index below. Clean separation | ✓ |
| Standalone canvas, content beside it | Canvas takes one side, text on other. More layout-coupled | |
| Full-page canvas extending beyond hero | Canvas bleeds past hero section. More dramatic, harder to coordinate | |

**User's choice:** Background layer behind hero content
**Notes:** None

### Threading Model

| Option | Description | Selected |
|--------|-------------|----------|
| Main thread with RAF | Simpler architecture, d3-contour fast enough for grid sizes needed | ✓ |
| Web Worker + OffscreenCanvas | Noise in worker, transferred to main thread. Adds complexity | |
| You decide | Claude picks based on performance testing | |

**User's choice:** Main thread with RAF
**Notes:** User asked "does 2 add anything visually" — answer was no, purely computational difference. Main thread handles the grid sizes easily (sub-2ms per frame).

---

## Visual Character & Feel

### Animation Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Slow breathing / tidal | Noise field evolves slowly, lines shift like slow tide | |
| Pulse from center outward | Periodic ripple emanating from a point | |
| Reactive to mouse/scroll | Noise field distorts near cursor or responds to scroll | ✓ |

**User's choice:** Reactive to mouse
**Notes:** User initially selected "Slow breathing / tidal" but immediately corrected to "actually should be reactive to mouse"

### Mouse Reactivity Intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle warp | Mouse gently distorts noise field in radius. You notice if you look | ✓ |
| Visible displacement | Clear ripple/displacement ~200px radius. Unmistakably interactive | |
| Magnetic pull | Lines actively pull toward cursor like gravity well. Dramatic | |

**User's choice:** Subtle warp
**Notes:** None

### Idle State Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Ambient drift + mouse warp | Lines slowly breathe on their own, mouse adds local warp on top | ✓ |
| Static until mouse moves | Frozen until cursor enters hero. Clean but risks looking like static image | |
| You decide | Claude picks during implementation | |

**User's choice:** Ambient drift + mouse warp
**Notes:** None

### Coral in Canvas

| Option | Description | Selected |
|--------|-------------|----------|
| Pure black lines only | Canvas stays monochrome, coral only in UI elements | |
| Coral at peak density | Densest contour regions get coral tint, like heat map peak | |
| Coral near mouse position | Lines near cursor subtly shift toward coral | ✓ |

**User's choice:** Coral near mouse position
**Notes:** Ties the accent color directly to the interactive element. Warp + coral shift together make cursor feel like a "peak marker" on terrain.

---

## Section Transition Accents

### Divider Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Between every section | Consistent rhythm, each divider unique path | |
| Only at major transitions | 2-3 dividers at key moments. Less is more | ✓ |
| You decide | Claude picks based on visual flow | |

**User's choice:** Only at major transitions
**Notes:** None

### Post-Draw Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Stay static | Line draws on, then stays. The draw is the moment | ✓ |
| Subtle pulse/breathe | After drawing, line subtly pulses. Keeps alive but may distract | |
| You decide | Claude picks during implementation | |

**User's choice:** Stay static
**Notes:** None

---

## Performance & Mobile Strategy

### Mobile Scaling

| Option | Description | Selected |
|--------|-------------|----------|
| Reduce grid + skip mouse | Halve grid, fewer thresholds, no mouse reactivity. Ambient only | ✓ |
| Static fallback on mobile | One frame rendered as static SVG/image. Zero overhead | |
| Same animation, lower framerate | Keep same field, throttle to 30fps | |

**User's choice:** Reduce grid + skip mouse
**Notes:** None

### Reduced Motion Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Static contour snapshot | One frame of noise field as static lines. On-theme, zero motion | ✓ |
| Blank / minimal | Just Map White background, no contour lines | |
| You decide | Claude picks during implementation | |

**User's choice:** Static contour snapshot
**Notes:** None

---

## Claude's Discretion

- Exact noise grid dimensions and contour threshold count
- Specific SVG divider placement (2-3 locations)
- Mouse warp radius and falloff curve
- Coral color shift gradient near cursor
- Canvas resize/DPI handling strategy

## Deferred Ideas

None — discussion stayed within phase scope.
