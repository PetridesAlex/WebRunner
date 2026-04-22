import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import './cookieBanner.css'

const STORAGE_KEY = 'webrunner-cookie-consent'

function getStoredConsent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function CookieBanner({ visibleAfterPreload }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visibleAfterPreload) return
    if (getStoredConsent() !== null) return
    const t = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(t)
  }, [visibleAfterPreload])

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  const decline = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'declined')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="cookie-banner__inner">
        <div className="cookie-banner__text">
          <h2 id="cookie-banner-title" className="cookie-banner__title">
            Cookies &amp; privacy
          </h2>
          <p id="cookie-banner-desc" className="cookie-banner__desc">
            We use essential cookies to run this site (for example, to remember your theme and this
            choice). See our cookie policy for details.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <Link to="/cookies" className="cookie-banner__link">
            Cookie policy
          </Link>
          <div className="cookie-banner__buttons">
            <Button type="button" variant="ghost" className="btn--sm" onClick={decline}>
              Decline
            </Button>
            <Button type="button" variant="primary" className="btn--sm" onClick={accept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
