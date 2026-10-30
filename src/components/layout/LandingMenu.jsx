import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { site } from '../../data/site'
import { useNavMenu } from '../../context/NavMenuContext'
import { useOfferModal } from '../../context/OfferModalContext'
import { TelegramIcon } from '../icons/TelegramIcon'

function MessengerIcon({ id }) {
  const cls = 'landing-menu__social-icon'
  const props = { className: cls, width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (id === 'telegram') return <TelegramIcon className={cls} size={20} />
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

const links = [
  { label: 'Email', href: `mailto:${site.email}` },
  ...site.socials.map((s) => ({ label: s.label, href: s.href })),
]

const ease = [0.22, 1, 0.36, 1]

/** Full-screen drawer for the carousel-only landing page. */
export function LandingMenu() {
  const { menuOpen, setMenuOpen, closeMenu } = useNavMenu()
  const { openOffer } = useOfferModal()
  const reduced = useReducedMotion()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setMenuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const itemAnim = (i) =>
    reduced
      ? { initial: false, animate: { opacity: 1, x: 0 } }
      : {
          initial: { opacity: 0, x: 28 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.45, delay: 0.12 + i * 0.06, ease },
        }

  return (
    <div className={`landing-menu${menuOpen ? ' is-open' : ''}`}>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="backdrop"
            className="landing-menu__backdrop"
            aria-hidden
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            key="panel"
            id="landing-navigation"
            className="landing-menu__panel"
            aria-label="Site menu"
            initial={reduced ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduced ? undefined : { x: '100%' }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }}
          >
            <div className="landing-menu__glow" aria-hidden />
            <div className="landing-menu__grain" aria-hidden />

            <button
              type="button"
              className="landing-menu__close"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              Close <span aria-hidden>×</span>
            </button>

            <motion.div className="landing-menu__brand" {...itemAnim(0)}>
              <img
                className="landing-menu__brand-mark"
                src="/webrunner-icon.svg"
                alt=""
                width={28}
                height={28}
                decoding="async"
              />
              <div>
                <p className="landing-menu__eyebrow">WebRunner</p>
                <p className="landing-menu__brand-sub">Agency · Cyprus</p>
              </div>
            </motion.div>

            <ul className="landing-menu__list">
              <motion.li {...itemAnim(1)}>
                <button
                  type="button"
                  className="landing-menu__link landing-menu__link--primary"
                  onClick={() => {
                    closeMenu()
                    openOffer()
                  }}
                >
                  <span>Get an offer now</span>
                  <span className="landing-menu__link-arrow" aria-hidden>
                    →
                  </span>
                </button>
              </motion.li>
              {links.map((item, i) => (
                <motion.li key={item.href} {...itemAnim(i + 2)}>
                  <a
                    href={item.href}
                    className="landing-menu__link"
                    onClick={closeMenu}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>{item.label}</span>
                    <span className="landing-menu__link-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.p className="landing-menu__eyebrow landing-menu__eyebrow--chat" {...itemAnim(links.length + 1)}>
              Quick chat
            </motion.p>
            <div className="landing-menu__socials">
              {site.messengerLinks.map(({ id, label, href }, i) => (
                <motion.a
                  key={id}
                  href={href}
                  className={`landing-menu__social landing-menu__social--${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  {...itemAnim(links.length + 2 + i)}
                >
                  <span className="landing-menu__social-orb">
                    <MessengerIcon id={id} />
                  </span>
                  <span>{label}</span>
                </motion.a>
              ))}
            </div>

            <motion.p className="landing-menu__meta" {...itemAnim(links.length + 5)}>
              {site.location}
            </motion.p>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
