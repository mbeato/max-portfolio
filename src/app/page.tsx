import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import PerformanceProvider from '@/components/ui/PerformanceProvider'
import AccessibilityProvider from '@/components/ui/AccessibilityProvider'
import AccessibilityMenu from '@/components/ui/AccessibilityMenu'
import TopoSvgDivider from '@/components/dividers/TopoSvgDivider'
import { DIVIDER_PATHS } from '@/lib/topo-paths'

export default function Home() {
  return (
    <PerformanceProvider>
      <AccessibilityProvider>
        <main id="portfolio-main-page" className="relative">
          <Navigation id="portfolio-navigation" />
          <Hero id="portfolio-hero-section" />
          <TopoSvgDivider
            id="divider-hero-about"
            paths={DIVIDER_PATHS.heroToAbout}
            className="w-full -my-1"
          />
          <About id="portfolio-about-section" />
          <TopoSvgDivider
            id="divider-about-experience"
            paths={DIVIDER_PATHS.aboutToExperience}
            className="w-full -my-1"
          />
          <Experience id="portfolio-experience-section" />
          <TopoSvgDivider
            id="divider-experience-projects"
            paths={DIVIDER_PATHS.experienceToProjects}
            className="w-full -my-1"
          />
          <Projects id="portfolio-projects-section" />
          <Contact id="portfolio-contact-section" />
          <AccessibilityMenu id="portfolio-accessibility-menu" />
        </main>
      </AccessibilityProvider>
    </PerformanceProvider>
  )
}
