import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { PortalGate } from './components/PortalGate'
import { VisitorProvider, useVisitor, getInitialWelcomePhase } from './context/VisitorContext'
import { SeoLandingPage } from './components/seo/SeoLandingPage'
import { HomePage } from './pages/HomePage'
import { CookiesPage } from './pages/CookiesPage'
import { WorkPage } from './pages/WorkPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { CookieBanner } from './components/CookieBanner'
import { getServicePages } from './data/seoPages'

const THEME_STORAGE_KEY = 'webrunner-theme'
const servicePages = getServicePages()

function AppRoutes() {
  const [theme, setTheme] = useState('dark')
  const location = useLocation()
  const { unlockPortal } = useVisitor()
  const [phase, setPhase] = useState(() => getInitialWelcomePhase(location.pathname))

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
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  useEffect(() => {
    if (phase !== 'site') return
    const hash = sessionStorage.getItem('webrunner-post-load-hash')
    if (!hash) return
    sessionStorage.removeItem('webrunner-post-load-hash')
    const id = hash.replace(/^#/, '')
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 280)
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === 'portal') {
    return (
      <PortalGate
        onUnlock={() => {
          unlockPortal()
          setPhase('site')
        }}
      />
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {servicePages.map((page) => (
          <Route key={page.path} path={page.path} element={<SeoLandingPage page={page} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieBanner visibleAfterPreload />
    </>
  )
}

export default function App() {
  return (
    <VisitorProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </VisitorProvider>
  )
}
