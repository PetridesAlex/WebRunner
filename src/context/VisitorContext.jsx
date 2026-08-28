import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_PORTAL = 'webrunner-portal-v1'
const STORAGE_VISITOR = 'webrunner-visitor'
/** @deprecated legacy key — treated as portal unlocked */
const STORAGE_ONBOARDING_LEGACY = 'webrunner-onboarding-v1'

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
    sessionStorage.setItem(STORAGE_PORTAL, '1')
    sessionStorage.removeItem(STORAGE_ONBOARDING_LEGACY)
    sessionStorage.setItem(STORAGE_VISITOR, JSON.stringify(payload))
    setVisitor(payload)
  }, [])

  const unlockPortal = useCallback(() => {
    sessionStorage.setItem(STORAGE_PORTAL, '1')
    sessionStorage.removeItem(STORAGE_ONBOARDING_LEGACY)
    sessionStorage.removeItem(STORAGE_VISITOR)
    setVisitor(null)
  }, [])

  const value = useMemo(
    () => ({ visitor, completeOnboarding, unlockPortal }),
    [visitor, completeOnboarding, unlockPortal],
  )

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
}

export function useVisitor() {
  const ctx = useContext(VisitorContext)
  if (!ctx) {
    throw new Error('useVisitor must be used within VisitorProvider')
  }
  return ctx
}

/** Session gate for portal (works before React hydration context updates). */
export function hasSessionPortalUnlocked() {
  if (typeof sessionStorage === 'undefined') return false
  return (
    sessionStorage.getItem(STORAGE_PORTAL) === '1' ||
    sessionStorage.getItem(STORAGE_ONBOARDING_LEGACY) === '1'
  )
}

export function getInitialWelcomePhase(pathname) {
  if (typeof window === 'undefined') return 'site'
  const p = pathname || window.location.pathname
  if (p !== '/' && p !== '') return 'site'
  if (hasSessionPortalUnlocked()) return 'site'
  return 'portal'
}
