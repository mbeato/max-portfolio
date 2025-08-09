# Add New Project Command

## Purpose
Quickly add a new project to the portfolio website with proper structure and formatting.

## Instructions
When adding a new project to the portfolio, follow these steps:

### 1. Project Data Structure
Add the project to the projects configuration with this structure:

```typescript
{
  id: "unique-project-id",
  title: "Project Name",
  description: "Brief project description for cards",
  longDescription: "Detailed project description for modal/detail view",
  technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  category: "web-app" | "mobile-app" | "tool" | "experiment",
  status: "completed" | "in-progress" | "concept",
  featured: boolean,
  image: "/projects/project-name.png",
  gallery: ["/projects/project-name-1.png", "/projects/project-name-2.png"],
  links: {
    demo: "https://project-demo.com",
    github: "https://github.com/username/repo",
    article: "https://blog.com/project-article" // optional
  },
  createdDate: "2024-MM-DD",
  updatedDate: "2024-MM-DD"
}
```

### 2. Required Assets
- Main project image: 800x600px, WebP format preferred
- Gallery images: 1200x900px, WebP format preferred
- All images should be optimized for web

### 3. File Placement
- Images go in `/public/projects/[project-id]/`
- Project data goes in `/src/lib/projects.ts`

### 4. Testing Checklist
- [ ] Project displays correctly in grid layout
- [ ] Modal/detail view opens properly
- [ ] All links work correctly
- [ ] Images load optimally
- [ ] Technology badges display correctly
- [ ] Responsive layout works on mobile

### 5. SEO Considerations
- Update sitemap if project has dedicated page
- Add project to structured data
- Optimize images with proper alt text

## Usage
Run this command when you need to add a new project to showcase your latest work.