# Max Portfolio Website - Development Documentation

## Project Overview

This is a modern portfolio website built with Next.js 15.4.6, React 19.1.0, and Tailwind CSS v4. The project showcases personal projects and technical expertise through cutting-edge web development techniques including 3D animations, scroll-driven interactions, and performance optimizations.

## Development Standards

### HTML Element Identification
**CRITICAL REQUIREMENT**: Every HTML `div` element must have a unique `id` attribute for precise Claude Code targeting.

**ID Naming Convention**:
```
Pattern: [section]-[element]-[purpose]
Examples:
- hero-title-container
- about-skills-grid  
- projects-card-wrapper
- contact-form-container
```

### Code Quality Standards
- TypeScript strict mode enabled
- All components must be properly typed
- Follow React 19 concurrent features best practices
- Implement error boundaries for graceful error handling
- Use Server/Client components appropriately

### Accessibility Requirements
- WCAG 2.1 AA compliance mandatory
- All interactive elements must be keyboard accessible
- Proper ARIA labels and semantic HTML
- Color contrast ratios ≥4.5:1
- Respect `prefers-reduced-motion` user preferences

## Technology Stack

### Core Dependencies
```json
{
  "next": "15.4.6",
  "react": "19.1.0", 
  "react-dom": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4"
}
```

### Animation & 3D Dependencies (To be installed)
```json
{
  "framer-motion": "latest",
  "three": "latest",
  "@react-three/fiber": "latest", 
  "@react-three/drei": "latest",
  "react-intersection-observer": "latest"
}
```

### Utility Dependencies (To be installed)  
```json
{
  "emailjs-com": "latest",
  "lucide-react": "latest"
}
```

## Build & Development Commands

### Essential Commands
- **Development Server**: `npm run dev --turbopack`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`
- **Type Checking**: Included in build process

### Performance Testing
```bash
# Lighthouse CLI testing (to be configured)
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Bundle analysis (to be configured)
npm run analyze
```

## Project Structure

### Current Structure
```
/Users/maximusbeato/max-portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── [components to be created]
├── public/
├── .claude/ [to be created]
├── PRD.md ✅
├── CLAUDE.md ✅
└── package.json
```

### Target Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ThemeToggle.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   └── 3d/
│       ├── FloatingShapes.tsx
│       ├── SkillBubbles.tsx
│       └── EarthModel.tsx
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
├── hooks/
│   ├── useScrollAnimation.ts
│   ├── useTheme.ts
│   └── useIntersectionObserver.ts
└── styles/
    └── animations.css
```

## Component Guidelines

### Component Template
```tsx
'use client' // Only if client-side features needed

import { ReactNode } from 'react'

interface ComponentNameProps {
  children?: ReactNode
  className?: string
  id: string // REQUIRED for all div elements
}

export default function ComponentName({ 
  children, 
  className = '', 
  id,
  ...props 
}: ComponentNameProps) {
  return (
    <div id={id} className={className} {...props}>
      {children}
    </div>
  )
}
```

### Animation Best Practices
- Use Framer Motion for complex animations
- Implement `prefers-reduced-motion` checks
- Keep animation durations around 250ms for optimal UX
- Use `will-change` CSS property sparingly
- Implement Intersection Observer for scroll-triggered animations

## Development Progress

### ✅ Completed Features
- [x] Project initialization and setup
- [x] PRD documentation created
- [x] CLAUDE.md documentation created

### 🚧 In Progress
- [ ] .claude directory setup with custom commands
- [ ] Dependency installation and configuration

### 📋 Pending Implementation
- [ ] Base layout and component structure
- [ ] Hero section with 3D animations
- [ ] About section with skills showcase
- [ ] Projects section framework
- [ ] Contact section with 3D Earth
- [ ] Scroll animations and performance features
- [ ] Theme switching system
- [ ] Accessibility enhancements
- [ ] Performance optimization

## Performance Targets

### Lighthouse Score Goals
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

### Core Web Vitals Targets
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

## Design System

### Color Palette (Tailwind CSS v4)
```css
/* Primary colors */
--color-primary: #3b82f6;
--color-primary-dark: #1d4ed8;

/* Neon accents */
--color-neon: #06ffa5;
--color-neon-glow: #06ffa540;

/* Neutral scale */
--color-background: #ffffff;
--color-background-dark: #0f172a;
--color-text: #1e293b;
--color-text-dark: #f8fafc;
```

### Typography Scale
- Headings: Geist Sans
- Body: Geist Sans
- Code: Geist Mono

### Spacing System
- Base unit: 4px (Tailwind's default)
- Section padding: 96px (py-24)
- Component padding: 32px (p-8)
- Element spacing: 16px (gap-4)

## Known Issues & Solutions

### Issue Tracking
*No known issues at initialization*

### Common Pitfalls to Avoid
1. **Missing unique IDs**: Always add unique `id` to every `div` element
2. **Animation performance**: Use `transform` and `opacity` for animations
3. **Accessibility**: Don't forget `aria-label` for interactive elements
4. **Bundle size**: Lazy load Three.js components to avoid large initial bundle

## Testing Strategy

### Testing Checklist
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness (iOS Safari, Chrome Mobile)
- [ ] Keyboard navigation testing
- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Performance testing with Lighthouse
- [ ] Accessibility testing with axe-core

### Manual Testing Requirements
1. Test all animations with `prefers-reduced-motion: reduce`
2. Verify form submissions work correctly
3. Test theme switching functionality
4. Validate all external links open in new tabs
5. Ensure smooth scrolling works across devices

## Deployment Configuration

### Environment Variables
```bash
# Email.js configuration (to be added)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Build optimization enabled
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics integration
- [ ] SEO metadata complete

## Maintenance Guidelines

### Regular Tasks
- Update dependencies monthly
- Run performance audits quarterly
- Review and update project content as needed
- Monitor Core Web Vitals through Google Search Console

### Adding New Projects
1. Add project data to projects configuration
2. Include project images in `/public/projects/`
3. Update project filtering categories if needed
4. Test responsive layout with new content
5. Update sitemap and metadata

## Contact & Support

For technical issues or questions about this implementation:
- Check the PRD.md for comprehensive requirements
- Review component documentation in `/src/components/`
- Test changes thoroughly before deployment
- Follow the established naming conventions and patterns

---

**Last Updated**: Initial Creation  
**Next Review**: After dependency installation  
**Development Status**: Foundation Setup Phase