import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { Footer } from '../components/layout/Footer'
import './cookiesPage.css'

const docTitle = 'Cookie policy — WebRunner'

export function CookiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const prev = document.title
    document.title = docTitle
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="cookies-page">
      <a href="#main" className="cookies-page__skip">
        Skip to content
      </a>
      <header className="cookies-page__header">
        <Link to="/" className="cookies-page__brand">
          <img
            className="cookies-page__brand-icon"
            src="/webrunner-icon.svg"
            alt=""
            width={40}
            height={40}
            decoding="async"
          />
          <span className="cookies-page__brand-name">{site.brand}</span>
        </Link>
        <Link to="/" className="cookies-page__back">
          ← Back to site
        </Link>
      </header>

      <main id="main" className="cookies-page__main">
        <article className="cookies-page__article">
          <h1 className="cookies-page__h1">Cookie policy</h1>
          <p className="cookies-page__meta">Last updated: April 23, 2026</p>

          <p className="cookies-page__lead">
            This page explains how {site.brand} (“we”, “us”) uses cookies and similar technologies on
            this website, and the choices you can make.
          </p>

          <h2 className="cookies-page__h2">What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a site. They help the
            site work properly, remember preferences, and (where allowed) understand how the site is
            used.
          </p>

          <h2 className="cookies-page__h2">How we use cookies</h2>
          <p>We use the following on this site:</p>
          <ul className="cookies-page__list">
            <li>
              <strong>Strictly necessary / functional.</strong> For example, remembering your theme
              (light or dark) and whether you have responded to the cookie notice. These are needed
              for the site to work as you expect.
            </li>
            <li>
              <strong>Local storage.</strong> We may use browser storage (such as <code>localStorage</code>)
              for the same purposes as the cookies above—theme preference and your cookie choice.
            </li>
          </ul>

          <h2 className="cookies-page__h2">Third parties</h2>
          <p>
            This site may load fonts from Google Fonts and images from services such as Unsplash. Those
            providers may process technical data (for example, your IP address) under their own
            policies. We do not use third-party advertising or analytics cookies on this site by
            default; if that changes, we will update this policy and, where required, ask for your
            consent before non-essential cookies are set.
          </p>

          <h2 className="cookies-page__h2">Your choices</h2>
          <p>
            When you first visit, you can accept or decline non-essential use via our banner. You can
            also clear site data in your browser settings at any time; note that this may reset your
            theme and the cookie notice may appear again.
          </p>

          <h2 className="cookies-page__h2">Contact</h2>
          <p>
            Questions about this policy? Write to us at{' '}
            <a className="cookies-page__a" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
