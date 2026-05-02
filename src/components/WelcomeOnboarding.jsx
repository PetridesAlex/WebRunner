import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { site } from '../data/site'
import { ONBOARDING, RESULTS_CARDS } from '../data/onboarding'
import { submitOnboardingLead } from '../lib/submitOnboardingLead'
import './welcome-onboarding.css'

const WHATSAPP_FALLBACK = 'https://wa.me/YOURNUMBER'

function getWhatsAppUrl() {
  return site.messengerLinks?.find((m) => m.id === 'whatsapp')?.href || WHATSAPP_FALLBACK
}

const emptyAnswers = () => ({ need: '', business: '', level: '', timeline: '' })

export function WelcomeOnboarding({ onComplete, onSkip }) {
  const [view, setView] = useState('quiz')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(emptyAnswers)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadSending, setLeadSending] = useState(false)
  const [leadError, setLeadError] = useState(null)

  const current = ONBOARDING[step]
  const fieldKey = current?.id
  const selected = answers[fieldKey] || ''
  const isLastQuestion = step === ONBOARDING.length - 1
  const canContinue = Boolean(selected)

  function selectOption(id) {
    setAnswers((a) => ({ ...a, [fieldKey]: id }))
  }

  function goNext() {
    if (!canContinue) return
    if (isLastQuestion) {
      setView('results')
      return
    }
    setStep((s) => s + 1)
  }

  function goBack() {
    if (view === 'results') {
      setView('quiz')
      setStep(ONBOARDING.length - 1)
      return
    }
    if (step > 0) setStep((s) => s - 1)
  }

  async function handleStartProject() {
    const name = leadName.trim()
    const phone = leadPhone.trim()
    const email = leadEmail.trim()
    if (!name || !phone) {
      setLeadError('Please add your name and phone number so I know who to follow up with.')
      return
    }
    setLeadError(null)
    setLeadSending(true)
    try {
      await submitOnboardingLead({ answers, name, phone, email })
      onComplete({ ...answers, name, phone, email }, { scrollToContact: true })
    } catch (err) {
      setLeadError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLeadSending(false)
    }
  }

  function handleEnterSiteWithoutEmail() {
    onComplete(
      {
        ...answers,
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim(),
      },
      { scrollToContact: true },
    )
  }

  function handleSkip() {
    onSkip?.()
  }

  function openWhatsApp() {
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="welcome-onboarding" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-onboarding__bg" aria-hidden />
      <div className="welcome-onboarding__bg-gradient" aria-hidden />
      <div className="welcome-onboarding__noise" aria-hidden />
      <div className="welcome-onboarding__vignette" aria-hidden />

      <header className="welcome-onboarding__top">
        <div className="welcome-onboarding__brand">
          <img src="/webrunner-icon.svg" alt="" width={40} height={40} decoding="async" />
          <span className="welcome-onboarding__brand-name">{site.brand}</span>
          <span className="nav__brand-badge welcome-onboarding__badge">Agency</span>
        </div>
        {view === 'quiz' ? (
          <nav className="welcome-onboarding__steps" aria-label="Question progress">
            {ONBOARDING.map((s, i) => (
              <span
                key={s.id}
                className={`welcome-onboarding__dot ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                aria-current={i === step ? 'step' : undefined}
              />
            ))}
          </nav>
        ) : (
          <p className="welcome-onboarding__results-pill" aria-hidden>
            Your direction
          </p>
        )}
      </header>

      <div className="welcome-onboarding__main">
        <AnimatePresence mode="wait">
          {view === 'quiz' ? (
            <motion.div
              key={`q-${step}`}
              className="welcome-onboarding__panel"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="welcome-onboarding__kicker">
                Step {step + 1} of {ONBOARDING.length}
              </p>
              <h1 id="welcome-title" className="welcome-onboarding__title">
                {current.question}
              </h1>
              <p className="welcome-onboarding__microcopy">{current.microcopy}</p>

              <div className="welcome-onboarding__options" role="group" aria-labelledby="welcome-title">
                {current.options.map((opt, i) => (
                  <motion.button
                    key={opt.id}
                    type="button"
                    className={`welcome-onboarding__card ${selected === opt.id ? 'is-selected' : ''}`}
                    onClick={() => selectOption(opt.id)}
                    aria-pressed={selected === opt.id}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.072,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="welcome-onboarding__card-edge" aria-hidden />
                    <span className="welcome-onboarding__card-glow" aria-hidden />
                    <span className="welcome-onboarding__card-shine" aria-hidden />
                    <span className="welcome-onboarding__card-rail" aria-hidden />
                    <span className="welcome-onboarding__card-body">
                      <span className="welcome-onboarding__card-label">{opt.label}</span>
                    </span>
                    <span className="welcome-onboarding__card-check" aria-hidden>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="welcome-onboarding__panel welcome-onboarding__panel--results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="welcome-onboarding__kicker welcome-onboarding__kicker--muted">All set</p>
              <h1 className="welcome-onboarding__title welcome-onboarding__title--results">Your website direction is ready.</h1>
              <p className="welcome-onboarding__results-lede">
                Based on your answers, I can help you build a modern, fast, and conversion-focused website tailored to
                your business goals.
              </p>

              <ul className="welcome-onboarding__result-cards">
                {RESULTS_CARDS.map((card) => (
                  <li key={card.id} className="welcome-onboarding__result-card">
                    <span className="welcome-onboarding__result-card-title">{card.title}</span>
                    <span className="welcome-onboarding__result-card-text">{card.text}</span>
                  </li>
                ))}
              </ul>

              <div className="welcome-onboarding__lead">
                <h2 className="welcome-onboarding__lead-title">Where should I reach you?</h2>
                <p className="welcome-onboarding__lead-hint">
                  I&apos;ll email you a copy of your answers plus these details so nothing gets lost.
                </p>
                <div className="welcome-onboarding__lead-fields">
                  <label className="welcome-onboarding__lead-field">
                    <span className="welcome-onboarding__lead-label">Name</span>
                    <input
                      type="text"
                      name="lead-name"
                      className="welcome-onboarding__lead-input"
                      placeholder="Your full name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      autoComplete="name"
                    />
                  </label>
                  <label className="welcome-onboarding__lead-field">
                    <span className="welcome-onboarding__lead-label">Phone</span>
                    <input
                      type="tel"
                      name="lead-phone"
                      className="welcome-onboarding__lead-input"
                      placeholder="Mobile or WhatsApp number"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </label>
                  <label className="welcome-onboarding__lead-field welcome-onboarding__lead-field--full">
                    <span className="welcome-onboarding__lead-label">Email (optional)</span>
                    <input
                      type="email"
                      name="lead-email"
                      className="welcome-onboarding__lead-input"
                      placeholder="For my reply (optional)"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                </div>
                {leadError ? (
                  <p className="welcome-onboarding__lead-error" role="alert">
                    {leadError}
                  </p>
                ) : null}
                <p className="welcome-onboarding__lead-fallback">
                  <button type="button" className="welcome-onboarding__lead-fallback-btn" onClick={handleEnterSiteWithoutEmail}>
                    Enter the site without sending an email
                  </button>
                  <span className="welcome-onboarding__lead-fallback-note"> — your choices are still saved for the contact form.</span>
                </p>
              </div>

              <div className="welcome-onboarding__results-cta">
                <button
                  type="button"
                  className="welcome-onboarding__btn welcome-onboarding__btn--primary"
                  onClick={handleStartProject}
                  disabled={leadSending}
                >
                  {leadSending ? 'Sending…' : 'Start Your Project'}
                </button>
                <button type="button" className="welcome-onboarding__btn welcome-onboarding__btn--ghost-accent" onClick={openWhatsApp}>
                  <span className="welcome-onboarding__wa-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  Contact on WhatsApp
                </button>
              </div>

              <button type="button" className="welcome-onboarding__back-link" onClick={goBack}>
                ← Edit answers
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'quiz' ? (
          <>
            <div className="welcome-onboarding__actions">
              {step > 0 ? (
                <button type="button" className="welcome-onboarding__btn welcome-onboarding__btn--ghost" onClick={goBack}>
                  Back
                </button>
              ) : (
                <span className="welcome-onboarding__spacer" />
              )}
              <button
                type="button"
                className="welcome-onboarding__btn welcome-onboarding__btn--primary"
                onClick={goNext}
                disabled={!canContinue}
              >
                {isLastQuestion ? 'See my direction' : 'Continue'}
              </button>
            </div>
            <button type="button" className="welcome-onboarding__skip" onClick={handleSkip}>
              Skip and show the site
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
