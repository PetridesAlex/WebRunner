import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_ONBOARDING = 'webrunner-onboarding-v1'
const STORAGE_VISITOR = 'webrunner-visitor'

function normalizeVisitor(o) {
  if (!o || typeof o !== 'object') return null
  if ('need' in o || 'business' in o || 'level' in o || 'timeline' in o) {
    return {
      need: typeof o.need === 'string' ? o.need : '',
      business: typeof o.business === 'string' ? o.business : '',
      level: typeof o.level === 'string' ? o.level : '',
      timeline: typeof o.timeline === 'string' ? o.timeline : '',
      name: typeof o.name === 'string' ? o.name : '',
      phone: typeof o.phone === 'string' ? o.phone : '',
      email: typeof o.email === 'string' ? o.email : '',
    }
  }
  return null
}

function readVisitor() {
  try {
    const raw = sessionStorage.getItem(STORAGE_VISITOR)
    if (!raw) return null
    const o = JSON.parse(raw)
    return normalizeVisitor(o)
  } catch {
    return null
  }
}

const VisitorContext = createContext(null)

export function VisitorProvider({ children }) {
  const [visitor, setVisitor] = useState(() => readVisitor())

  const completeOnboarding = useCallback((data) => {
    const payload = {
      need: typeof data?.need === 'string' ? data.need : '',
      business: typeof data?.business === 'string' ? data.business : '',
      level: typeof data?.level === 'string' ? data.level : '',
      timeline: typeof data?.timeline === 'string' ? data.timeline : '',
      name: typeof data?.name === 'string' ? data.name : '',
      phone: typeof data?.phone === 'string' ? data.phone : '',
      email: typeof data?.email === 'string' ? data.email : '',
    }
    sessionStorage.setItem(STORAGE_ONBOARDING, '1')
    sessionStorage.setItem(STORAGE_VISITOR, JSON.stringify(payload))
    setVisitor(payload)
  }, [])

  const value = useMemo(() => ({ visitor, completeOnboarding }), [visitor, completeOnboarding])

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
}

export function useVisitor() {
  const ctx = useContext(VisitorContext)
  if (!ctx) {
    throw new Error('useVisitor must be used within VisitorProvider')
  }
  return ctx
}

/** Session gate for welcome flow (works before React hydration context updates). */
export function hasSessionOnboardingDone() {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(STORAGE_ONBOARDING) === '1'
}

export function getInitialWelcomePhase(pathname) {
  if (typeof window === 'undefined') return 'loading'
  const p = pathname || window.location.pathname
  if (p !== '/' && p !== '') return 'loading'
  if (hasSessionOnboardingDone()) return 'loading'
  return 'welcome'
}
