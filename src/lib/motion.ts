import type { Variants, Transition } from 'framer-motion';

// Base transitions — values match DESIGN.md section 8 / globals.css animation timing tokens
export const transitions = {
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } as Transition,
  base: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } as Transition,
  slow: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  draw: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
};

// fadeInUp — primary scroll reveal (rises like elevation contour)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: transitions.slow },
  exit: { opacity: 0, y: -12, transition: transitions.fast },
};

// fadeIn — reduced-motion safe version (opacity only, no transform)
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.slow },
  exit: { opacity: 0, transition: transitions.fast },
};

// staggerContainer — parent that staggers child animations
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// slideInLeft — for experience timeline items
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: transitions.slow },
  exit: { opacity: 0, x: -8, transition: transitions.fast },
};

// drawPath — SVG path drawing for section dividers (Phase 4)
export const drawPath: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1, transition: transitions.draw },
};
