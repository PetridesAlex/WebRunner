import { useState, useEffect } from 'react'
import { site } from '../../data/site'
import { Button } from '../ui/Button'
import { TelegramIcon } from '../icons/TelegramIcon'

function MessengerIcon({ id }) {
  const cls = 'nav__drawer-social-icon'
  const props = { className: cls, width: 22, height: 22, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (id === 'telegram') {
    return <TelegramIcon className={cls} size={22} />
  }
  if (id === 'whatsapp') {
    return (
      <svg {...props} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )
  }
  if (id === 'instagram') {
    return (
      <svg {...props} fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  return null
}

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'solutions', label: 'Packages' },
  { id: 'portfolio', label: 'Work' },
  { id: 'testimonials', label: 'Clients' },
  { id: 'contact', label: 'Contact' },
]

function ThemeIcon({ theme }) {
  if (theme === 'light') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm0 2a7 7 0 010 14V5z" />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path
        fillRule="evenodd"
        d="M12 0a1 1 0 011 1v2a1 1 0 01-2 0V1a1 1 0 011-1zm0 20a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zM0 12a1 1 0 011-1h2a1 1 0 010 2H1a1 1 0 01-1-1zm20 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM3.515 3.515a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L3.515 4.93a1 1 0 010-1.415zm14.143 14.143a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM3.515 20.485a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414L4.93 20.485a1 1 0 01-1.415 0zM17.657 6.343a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414 0z"
      />
    </svg>
  )
}

export function Navbar({ activeId, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isLight = theme === 'light'

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={`nav-wrap${menuOpen ? ' nav-wrap--menu-open' : ''}`}>
      <nav className="nav" aria-label="Primary">
        <a className="nav__brand" href="#hero" aria-label={`${site.brand} home`} onClick={closeMenu}>
          <img
            className="nav__brand-icon"
            src="/webrunner-icon.svg"
            alt=""
            width={48}
            height={48}
            decoding="async"
          />
          <span className="nav__brand-wordmark">
            <span className="nav__brand-name">{site.brand}</span>
            <span className="nav__brand-badge">Agency</span>
          </span>
        </a>

        <button
          type="button"
          className="nav__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="nav__menu-bars" aria-hidden>
            <span className="nav__menu-bar" />
            <span className="nav__menu-bar" />
            <span className="nav__menu-bar" />
          </span>
        </button>

        <div
          className="nav__backdrop"
          aria-hidden="true"
          onClick={closeMenu}
        />

        <ul id="primary-navigation" className="nav__links">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeId === id ? 'nav__link nav__link--active' : 'nav__link'}
                onClick={closeMenu}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="nav__links-theme">
            <button
              type="button"
              className="nav__theme-toggle nav__theme-toggle--drawer"
              onClick={onToggleTheme}
              aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              <span className="nav__theme-icon">
                <ThemeIcon theme={theme} />
              </span>
              <span className="nav__theme-label">{isLight ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </li>
          <li className="nav__links-cta">
            <Button href="#contact" className="btn--sm nav__drawer-cta" onClick={closeMenu}>
              Start a project
            </Button>
          </li>
          <li className="nav__links-social">
            <p className="nav__drawer-social-label">Quick chat</p>
            <div className="nav__drawer-socials">
              {site.messengerLinks.map(({ id, label, href }) => (
                <a
                  key={id}
                  href={href}
                  className={`nav__drawer-social-link nav__drawer-social-link--${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  <MessengerIcon id={id} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </li>
        </ul>

        <button
          type="button"
          className="nav__theme-toggle"
          onClick={onToggleTheme}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          <ThemeIcon theme={theme} />
        </button>
        <Button href="#contact" className="nav__cta btn--sm">
          Start a project
        </Button>
      </nav>
    </header>
  )
}
