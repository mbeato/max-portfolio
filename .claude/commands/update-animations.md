# Update Animations Command

## Purpose
Maintain and optimize animations across the portfolio website for performance and accessibility.

## Animation Guidelines

### Performance Best Practices
- Use `transform` and `opacity` properties for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)
- Use `will-change` property sparingly and remove after animation
- Keep animation durations around 250ms for optimal UX

### Framer Motion Patterns
```tsx
// Preferred animation pattern
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" }
}

// Respect reduced motion preferences
const fadeInUpAccessible = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.25, 
    ease: "easeOut",
    // Disable animation for reduced motion users
    ...(prefersReducedMotion ? { duration: 0 } : {})
  }
}
```

### Scroll-Driven Animations
```tsx
// Intersection Observer pattern
const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true
})

return (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.25 }}
  >
    {content}
  </motion.div>
)
```

## Animation Audit Checklist

### Performance Check
- [ ] No jank during animations (use browser dev tools)
- [ ] Animations use GPU-accelerated properties
- [ ] No unnecessary re-renders during animations
- [ ] `will-change` is removed after animations complete

### Accessibility Check
- [ ] `prefers-reduced-motion` is respected
- [ ] No flashing or strobing effects
- [ ] Animations don't interfere with keyboard navigation
- [ ] Focus states are maintained during animations

### Cross-Browser Testing
- [ ] Safari (including iOS Safari)
- [ ] Chrome/Chromium browsers
- [ ] Firefox
- [ ] Edge

## Common Animation Issues & Solutions

### Issue: Janky scroll animations
**Solution**: Use `transform: translateY()` instead of changing `top` property

### Issue: Animations not working on mobile
**Solution**: Check for `hover` states that don't work on touch devices

### Issue: Reduced motion not respected
**Solution**: Implement proper `prefers-reduced-motion` media query handling

## Performance Monitoring
Run Lighthouse audit after animation changes:
```bash
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-animation-test.json
```

Focus on:
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)

## Usage
Use this command when updating existing animations or adding new animated elements to ensure consistency and performance.