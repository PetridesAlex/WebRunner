import { useState } from 'react'
import { motion } from 'motion/react'
import './portal-gate.css'

const LOGO_SRC = '/webrunner-logo.png'
const UNLOCK_MS = 1180
const EASE = [0.16, 1, 0.3, 1]

export function PortalGate({ onUnlock }) {
  const [unlocking, setUnlocking] = useState(false)
  const [exiting, setExiting] = useState(false)

  function handleUnlock() {
    if (unlocking) return
    setUnlocking(true)
    window.setTimeout(() => setExiting(true), UNLOCK_MS - 300)
    window.setTimeout(() => onUnlock?.(), UNLOCK_MS)
  }

  return (
    <motion.div
      className="portal-gate"
      role="dialog"
      aria-modal="true"
      aria-label="WebRunner portal"
      animate={
        exiting
          ? { opacity: 0, scale: 1.03, filter: 'blur(10px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.48, ease: EASE }}
    >
      <div className="portal-gate__bg" aria-hidden />
      <div className="portal-gate__orb portal-gate__orb--a" aria-hidden />
      <div className="portal-gate__orb portal-gate__orb--b" aria-hidden />
      <div className="portal-gate__grid" aria-hidden />
      <div className="portal-gate__noise" aria-hidden />
      <div className="portal-gate__vignette" aria-hidden />

      <main className="portal-gate__stage">
        <motion.button
          type="button"
          className={`portal-gate__unlock ${unlocking ? 'is-unlocking' : ''}`}
          onClick={handleUnlock}
          disabled={unlocking}
          aria-label="Unlock portal and enter website"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={unlocking ? undefined : { y: -2 }}
          whileTap={unlocking ? undefined : { y: 1, scale: 0.995 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="portal-gate__stack">
            <div className="portal-gate__logo-block">
              <span className="portal-gate__pulse" aria-hidden />
              <span className="portal-gate__pulse portal-gate__pulse--delayed" aria-hidden />
              <span className="portal-gate__button-shell" aria-hidden>
                <span className="portal-gate__button-ring" />
                <span className="portal-gate__button-glow" />
              </span>

              <motion.span
                className="portal-gate__logo-wrap"
                animate={
                  unlocking
                    ? { scale: 1.05, filter: 'brightness(1.1) saturate(1.04)' }
                    : { scale: 1, filter: 'brightness(1) saturate(1)' }
                }
                transition={{ duration: 0.6, ease: EASE, delay: unlocking ? 0.35 : 0 }}
              >
                <span className="portal-gate__logo-frame">
                  <img src={LOGO_SRC} alt="" width={160} height={160} className="portal-gate__logo" decoding="async" />
                  <span className="portal-gate__logo-shine" aria-hidden />
                </span>
              </motion.span>

              <motion.span
                className="portal-gate__burst"
                aria-hidden
                initial={false}
                animate={unlocking ? { opacity: 1, scale: 1.25 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: EASE, delay: unlocking ? 0.42 : 0 }}
              />
            </div>

            <div className="portal-gate__lock-scene" aria-hidden>
              <div className="portal-gate__lock-track">
                <motion.span
                  className="portal-gate__key"
                  initial={false}
                  animate={
                    unlocking
                      ? { x: 38, rotate: 78, opacity: 1, scale: 1 }
                      : { x: 0, rotate: -18, opacity: 0.82, scale: 1 }
                  }
                  transition={{
                    duration: 0.88,
                    ease: EASE,
                    delay: unlocking ? 0.08 : 0,
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 56 56" fill="none">
                    <defs>
                      <linearGradient id="portal-key-metal" x1="8" y1="8" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffe8cc" />
                        <stop offset="45%" stopColor="#ffb066" />
                        <stop offset="100%" stopColor="#ff6a00" />
                      </linearGradient>
                    </defs>
                    <circle cx="18" cy="18" r="11" stroke="url(#portal-key-metal)" strokeWidth="2.8" />
                    <circle cx="18" cy="18" r="5" stroke="url(#portal-key-metal)" strokeWidth="2" opacity="0.7" />
                    <path
                      d="M18 29v16M18 36h14M32 36v8"
                      stroke="url(#portal-key-metal)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect x="29.5" y="42" width="5" height="5" rx="1.2" fill="url(#portal-key-metal)" />
                  </svg>
                </motion.span>

                <span className={`portal-gate__lock ${unlocking ? 'is-open' : ''}`}>
                  <svg className="portal-gate__lock-svg" viewBox="0 0 120 120" fill="none">
                    <defs>
                      <linearGradient id="portal-lock-metal" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffd4a8" />
                        <stop offset="38%" stopColor="#ff9a4d" />
                        <stop offset="72%" stopColor="#ff6a00" />
                        <stop offset="100%" stopColor="#c44a00" />
                      </linearGradient>
                      <linearGradient id="portal-lock-body" x1="30" y1="52" x2="90" y2="108" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="rgba(255, 190, 130, 0.95)" />
                        <stop offset="100%" stopColor="rgba(255, 106, 0, 0.55)" />
                      </linearGradient>
                      <filter id="portal-lock-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ff6a00" floodOpacity="0.28" />
                      </filter>
                    </defs>
                    <motion.g
                      className="portal-gate__lock-shackle"
                      filter="url(#portal-lock-shadow)"
                      initial={false}
                      animate={
                        unlocking
                          ? { y: -11, rotate: -16, opacity: 0.45 }
                          : { y: 0, rotate: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.58, ease: EASE, delay: unlocking ? 0.52 : 0 }}
                      style={{ transformOrigin: '60px 52px', transformBox: 'fill-box' }}
                    >
                      <path
                        d="M38 52V38a22 22 0 0 1 44 0v14"
                        stroke="url(#portal-lock-metal)"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />
                    </motion.g>
                    <motion.g
                      className="portal-gate__lock-body"
                      filter="url(#portal-lock-shadow)"
                      initial={false}
                      animate={unlocking ? { scale: 1.03 } : { scale: 1 }}
                      transition={{ duration: 0.45, ease: EASE, delay: unlocking ? 0.48 : 0 }}
                      style={{ transformOrigin: '60px 78px', transformBox: 'fill-box' }}
                    >
                      <rect x="28" y="52" width="64" height="52" rx="14" fill="url(#portal-lock-body)" />
                      <rect
                        x="28"
                        y="52"
                        width="64"
                        height="52"
                        rx="14"
                        stroke="url(#portal-lock-metal)"
                        strokeWidth="2.5"
                      />
                      <circle cx="60" cy="72" r="5.5" fill="#1a0f08" opacity="0.85" />
                      <path d="M60 77v12" stroke="#1a0f08" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                    </motion.g>
                  </svg>
                </span>
              </div>

              <motion.span
                className="portal-gate__key-glint"
                aria-hidden
                initial={false}
                animate={unlocking ? { opacity: [0, 1, 0], scale: [0.8, 1.2, 1] } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.55, ease: EASE, delay: unlocking ? 0.5 : 0 }}
              />
            </div>

            <motion.span
              className="portal-gate__label"
              aria-hidden
              initial={false}
              animate={
                unlocking
                  ? { opacity: 0.55, y: 2, letterSpacing: '0.42em' }
                  : { opacity: 1, y: 0, letterSpacing: '0.34em' }
              }
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="portal-gate__label-text">{unlocking ? 'Opening' : 'Unlock'}</span>
              <span className="portal-gate__label-line" aria-hidden />
            </motion.span>
          </div>
        </motion.button>
      </main>
    </motion.div>
  )
}
