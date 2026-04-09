import { useEffect, useState } from 'react'
import { useActiveSection } from './hooks/useActiveSection'
import { useReveal } from './hooks/useReveal'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { BackToTop } from './components/layout/BackToTop'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Services } from './components/sections/Services'
import { WebsiteSolutions } from './components/sections/WebsiteSolutions'
import { Portfolio } from './components/sections/Portfolio'
import { Testimonials } from './components/sections/Testimonials'
import { Contact } from './components/sections/Contact'
import Preloader from './components/Preloader'
import { TopTicker } from './components/layout/TopTicker'

const THEME_STORAGE_KEY = 'webrunner-theme'

export default function App() {
  const activeId = useActiveSection()
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)
  useReveal()

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return (
    <Preloader
      loading={loading}
      variant="stairs"
      position="fixed"
      duration={2200}
      loadingText="Building your experience"
      stairCount={10}
      stairsRevealFrom="left"
      stairsRevealDirection="up"
    >
      <div className="noise-overlay" aria-hidden />
      <TopTicker />
      <Navbar activeId={activeId} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <WebsiteSolutions />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </Preloader>
  )
}
