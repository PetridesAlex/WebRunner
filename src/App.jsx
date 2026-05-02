import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader'
import { WelcomeOnboarding } from './components/WelcomeOnboarding'
import { VisitorProvider, useVisitor, getInitialWelcomePhase } from './context/VisitorContext'
import { preloaderLineFromVisitor } from './data/onboarding'
import { HomePage } from './pages/HomePage'
import { CookiesPage } from './pages/CookiesPage'
import { CookieBanner } from './components/CookieBanner'

const THEME_STORAGE_KEY = 'webrunner-theme'
/** Time on the preloader before stair exit runs (keeps the intro + load text readable, then exits fast). */
const PRELOADER_HOLD_MS = 2200

function AppRoutes() {
  const [theme, setTheme] = useState('dark')
  const location = useLocation()
  const { completeOnboarding, visitor } = useVisitor()

  const [phase, setPhase] = useState(() => getInitialWelcomePhase(location.pathname))
  const [loading, setLoading] = useState(() => getInitialWelcomePhase(location.pathname) === 'loading')

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
    if (phase !== 'loading') return
    const timer = setTimeout(() => setLoading(false), PRELOADER_HOLD_MS)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  /** After preload, scroll to #contact when user chose “Start Your Project”. */
  useEffect(() => {
    if (loading) return
    const hash = sessionStorage.getItem('webrunner-post-load-hash')
    if (!hash) return
    sessionStorage.removeItem('webrunner-post-load-hash')
    const id = hash.replace(/^#/, '')
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 280)
    return () => clearTimeout(timer)
  }, [loading])

  const loadingText = useMemo(() => preloaderLineFromVisitor(visitor), [visitor])

  if (phase === 'welcome') {
    return (
      <WelcomeOnboarding
        onComplete={(data, options) => {
          completeOnboarding(data)
          if (options?.scrollToContact) {
            sessionStorage.setItem('webrunner-post-load-hash', '#contact')
          }
          setLoading(true)
          setPhase('loading')
        }}
        onSkip={() => {
          completeOnboarding({
            need: '',
            business: '',
            level: '',
            timeline: '',
            name: '',
            phone: '',
            email: '',
          })
          setLoading(true)
          setPhase('loading')
        }}
      />
    )
  }

  return (
    <Preloader
      loading={loading}
      variant="stairs"
      position="fixed"
      duration={PRELOADER_HOLD_MS}
      loadingText={loadingText}
      stairCount={10}
      stairsEntrance="fromBottom"
      stairsRevealFrom="left"
      stairsRevealDirection="up"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
      <CookieBanner visibleAfterPreload={!loading} />
    </Preloader>
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
