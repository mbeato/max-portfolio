# Performance Check Command

## Purpose
Comprehensive performance analysis and optimization for the portfolio website.

## Performance Audit Steps

### 1. Lighthouse Analysis
```bash
# Run full Lighthouse audit
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Run specific audits
npx lighthouse http://localhost:3000 --only-categories=performance --output=json
```

### 2. Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s  
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### 3. Bundle Analysis
```bash
# Analyze bundle size (requires @next/bundle-analyzer)
npm run analyze

# Check for unused dependencies
npx depcheck
```

## Optimization Checklist

### Images & Assets
- [ ] All images are optimized (WebP format preferred)
- [ ] Images use Next.js `Image` component with proper sizing
- [ ] Critical images are preloaded
- [ ] Non-critical images are lazy-loaded
- [ ] SVG icons are optimized

### JavaScript & CSS
- [ ] Unused JavaScript is removed
- [ ] CSS is purged of unused classes
- [ ] Critical CSS is inlined
- [ ] Non-critical CSS is loaded asynchronously
- [ ] Third-party scripts are loaded efficiently

### React/Next.js Specific
- [ ] Components are properly code-split
- [ ] Dynamic imports are used for heavy components (Three.js)
- [ ] Server components are used where possible
- [ ] Proper `loading` and `error` boundaries are implemented

### Network & Caching
- [ ] Static assets are cached properly
- [ ] API routes are optimized
- [ ] CDN is utilized for static assets
- [ ] Compression (gzip/brotli) is enabled

## Performance Monitoring Setup

### Real User Monitoring
```typescript
// Add to _app.tsx or layout.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric)
}

// Measure Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)  
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Development Performance Monitoring
```bash
# Profile build performance
npm run build -- --profile

# Analyze build output
npm run build -- --debug
```

## Common Performance Issues & Solutions

### Issue: Large bundle size
**Solutions**:
- Dynamic import for Three.js components
- Code splitting by route
- Remove unused dependencies

### Issue: Poor LCP scores
**Solutions**:
- Optimize hero section images
- Preload critical resources
- Use Server Components where possible

### Issue: High CLS scores
**Solutions**:
- Set explicit dimensions for images
- Avoid dynamic content insertion
- Use CSS aspect-ratio for responsive images

### Issue: Slow Time to Interactive
**Solutions**:
- Minimize main thread work
- Optimize JavaScript execution
- Use `loading="lazy"` for below-fold images

## Mobile Performance Considerations
- Test on actual devices, not just dev tools
- Consider slower network conditions
- Optimize touch interactions
- Test scroll performance on iOS Safari

## Automated Performance Testing
```json
// package.json scripts
{
  "scripts": {
    "perf:audit": "lighthouse http://localhost:3000 --output-path=./reports/lighthouse.html",
    "perf:ci": "lhci autorun",
    "perf:analyze": "npm run build && npm run analyze"
  }
}
```

## Performance Budget
Set performance budgets to catch regressions:

```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 1500 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "first-input-delay", "budget": 100 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 170 },
      { "resourceType": "total", "budget": 500 }
    ]
  }
]
```

## Usage
Run this command regularly during development and especially before deployment to ensure optimal performance.