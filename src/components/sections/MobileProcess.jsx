import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { mobileProcess } from '../../data/mobileProcess'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

const CYCLE_MS = 3200
const EASE = [0.22, 1, 0.36, 1]

function PhoneStatusBar() {
  return (
    <div className="mobile-phone__status" aria-hidden>
      <span className="mobile-phone__time">9:41</span>
      <span className="mobile-phone__island" />
      <span className="mobile-phone__status-icons">
        <span className="mobile-phone__signal" />
        <span className="mobile-phone__battery" />
      </span>
    </div>
  )
}

function ScreenDiscover() {
  return (
    <div className="mobile-screen mobile-screen--discover">
      <p className="mobile-screen__eyebrow">Discovery</p>
      <h3 className="mobile-screen__title">Product map</h3>
      <div className="mobile-screen__flow">
        <span className="mobile-screen__node">Idea</span>
        <span className="mobile-screen__flow-line" />
        <span className="mobile-screen__node mobile-screen__node--accent">Users</span>
        <span className="mobile-screen__flow-line" />
        <span className="mobile-screen__node">Flows</span>
      </div>
      <ul className="mobile-screen__sketch">
        <li />
        <li />
        <li />
      </ul>
    </div>
  )
}

function ScreenDesign() {
  return (
    <div className="mobile-screen mobile-screen--design">
      <p className="mobile-screen__eyebrow">UI design</p>
      <h3 className="mobile-screen__title">Interface</h3>
      <div className="mobile-screen__cards">
        <article className="mobile-screen__card mobile-screen__card--hero">
          <span className="mobile-screen__card-label">Hero</span>
          <span className="mobile-screen__card-bar" />
        </article>
        <article className="mobile-screen__card">
          <span className="mobile-screen__card-dot" />
          <span className="mobile-screen__card-bar mobile-screen__card-bar--sm" />
        </article>
        <article className="mobile-screen__card">
          <span className="mobile-screen__card-dot" />
          <span className="mobile-screen__card-bar mobile-screen__card-bar--sm" />
        </article>
      </div>
    </div>
  )
}

function ScreenBuild() {
  return (
    <div className="mobile-screen mobile-screen--build">
      <p className="mobile-screen__eyebrow">Engineering</p>
      <h3 className="mobile-screen__title">Build</h3>
      <div className="mobile-screen__chips">
        <span>React Native</span>
        <span>iOS</span>
        <span>Android</span>
      </div>
      <div className="mobile-screen__progress" aria-hidden>
        <span className="mobile-screen__progress-track">
          <span className="mobile-screen__progress-fill" />
        </span>
        <span className="mobile-screen__progress-label">Shipping modules</span>
      </div>
    </div>
  )
}

function ScreenTest() {
  return (
    <div className="mobile-screen mobile-screen--test">
      <p className="mobile-screen__eyebrow">QA</p>
      <h3 className="mobile-screen__title">Checks</h3>
      <ul className="mobile-screen__checks">
        <li className="is-pass">
          <span /> Performance
        </li>
        <li className="is-pass">
          <span /> Device suite
        </li>
        <li className="is-pass">
          <span /> Edge cases
        </li>
      </ul>
    </div>
  )
}

function ScreenLaunch() {
  return (
    <div className="mobile-screen mobile-screen--launch">
      <p className="mobile-screen__eyebrow">Release</p>
      <h3 className="mobile-screen__title">Launch</h3>
      <div className="mobile-screen__launch-badge" aria-hidden>
        <span className="mobile-screen__launch-pulse" />
        <span className="mobile-screen__launch-mark">✓</span>
      </div>
      <p className="mobile-screen__launch-copy">Store-ready</p>
    </div>
  )
}

const SCREENS = {
  discover: ScreenDiscover,
  design: ScreenDesign,
  build: ScreenBuild,
  test: ScreenTest,
  launch: ScreenLaunch,
}

function PhoneDevice({ activeStep, reduceMotion }) {
  const Screen = SCREENS[activeStep.screen] || ScreenDiscover

  return (
    <motion.div
      className="mobile-phone"
      aria-hidden
      animate={reduceMotion ? { y: 0 } : { y: [0, -8, 0] }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <div className="mobile-phone__glow" />
      <div className="mobile-phone__frame">
        <div className="mobile-phone__bezel">
          <PhoneStatusBar />
          <div className="mobile-phone__viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                className="mobile-phone__screen-layer"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="mobile-phone__home" />
        </div>
      </div>
    </motion.div>
  )
}

export function MobileProcess() {
  const { eyebrow, title, subtitle, platforms, cta, steps } = mobileProcess
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduceMotion || paused) return undefined
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % steps.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, paused, steps.length])

  const activeStep = steps[activeIndex]

  return (
    <section
      id="mobile"
      className="mobile-process section section--mobile"
      aria-labelledby="mobile-heading"
      data-reveal-section
    >
      <div className="mobile-process__ambient" aria-hidden />
      <div className="section__container mobile-process__layout">
        <div className="mobile-process__copy">
          <SectionHeader
            titleId="mobile-heading"
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
          <p className="mobile-process__platforms" data-reveal>
            {platforms}
          </p>

          <ol
            className="mobile-process__steps"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {steps.map((step, index) => {
              const isActive = index === activeIndex
              return (
                <li key={step.id} data-reveal>
                  <button
                    type="button"
                    className={`mobile-process__step${isActive ? ' is-active' : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                    onClick={() => {
                      setActiveIndex(index)
                      setPaused(true)
                    }}
                  >
                    <span className="mobile-process__step-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="mobile-process__step-body">
                      <span className="mobile-process__step-label">{step.label}</span>
                      <span className="mobile-process__step-title">{step.title}</span>
                      <span className="mobile-process__step-text">{step.body}</span>
                    </span>
                    <span className="mobile-process__step-rail" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mobile-process__cta" data-reveal>
            <Button href={cta.href} variant="primary">
              {cta.label}
            </Button>
          </div>
        </div>

        <div className="mobile-process__stage" data-reveal>
          <PhoneDevice activeStep={activeStep} reduceMotion={!!reduceMotion} />
        </div>
      </div>
    </section>
  )
}
