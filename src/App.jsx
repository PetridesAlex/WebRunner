import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader'
import { HomePage } from './pages/HomePage'
import { CookiesPage } from './pages/CookiesPage'
import { CookieBanner } from './components/CookieBanner'

const THEME_STORAGE_KEY = 'webrunner-theme'
/** Time on the preloader before stair exit runs (keeps the intro + load text readable, then exits fast). */
const PRELOADER_HOLD_MS = 2200

function AppRoutes() {
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)
  const location = useLocation()

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
    const timer = setTimeout(() => setLoading(false), PRELOADER_HOLD_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <Preloader
      loading={loading}
      variant="stairs"
      position="fixed"
      duration={PRELOADER_HOLD_MS}
      loadingText="Crafting your first impression"
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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
