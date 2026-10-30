import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { site } from '../../data/site'
import { useNavMenu } from '../../context/NavMenuContext'
import { useOfferModal } from '../../context/OfferModalContext'
import { TelegramIcon } from '../icons/TelegramIcon'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import { InstagramIcon } from '../icons/InstagramIcon'

function MessengerIcon({ id }) {
  const cls = 'landing-menu__social-icon'
  const props = { className: cls, width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (id === 'telegram') return <TelegramIcon className={cls} size={20} branded />
  if (id === 'whatsapp') return <WhatsAppIcon className={cls} size={20} branded />
  if (id === 'instagram') return <InstagramIcon className={cls} size={20} branded />
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
