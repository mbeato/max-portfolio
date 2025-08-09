import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'
import ScrollProgress from '@/components/ui/ScrollProgress'
import PerformanceProvider from '@/components/ui/PerformanceProvider'
import AccessibilityProvider from '@/components/ui/AccessibilityProvider'
import AccessibilityMenu from '@/components/ui/AccessibilityMenu'

export default function Home() {
  return (
    <PerformanceProvider>
      <AccessibilityProvider>
        <main id="portfolio-main-page" className="relative">
          <ScrollProgress id="portfolio-scroll-progress" />
          <Navigation id="portfolio-navigation" />
          <Hero id="portfolio-hero-section" />
          <About id="portfolio-about-section" />
          <Projects id="portfolio-projects-section" />
          <Contact id="portfolio-contact-section" />
          <AccessibilityMenu id="portfolio-accessibility-menu" />
        </main>
      </AccessibilityProvider>
    </PerformanceProvider>
  )
}
