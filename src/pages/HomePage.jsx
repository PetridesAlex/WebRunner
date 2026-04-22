import { useActiveSection } from '../hooks/useActiveSection'
import { useReveal } from '../hooks/useReveal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Skills } from '../components/sections/Skills'
import { Services } from '../components/sections/Services'
import { WebsiteSolutions } from '../components/sections/WebsiteSolutions'
import { Portfolio } from '../components/sections/Portfolio'
import { FAQSection } from '../components/sections/FAQSection'
import { Contact } from '../components/sections/Contact'
import { TopTicker } from '../components/layout/TopTicker'

export function HomePage() {
  const activeId = useActiveSection()
  useReveal()

  return (
    <>
      <div className="noise-overlay" aria-hidden />
      <TopTicker />
      <Navbar activeId={activeId} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <WebsiteSolutions />
        <Portfolio />
        <FAQSection />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
