import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { site } from '../../data/site'
import { useOfferModal } from '../../context/OfferModalContext'

const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`

export function OfferModal() {
  const { open, closeOffer } = useOfferModal()
  const reduced = useReducedMotion()
  const titleId = useId()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') closeOffer()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeOffer])

  useEffect(() => {
    if (!open) {
      setSent(false)
      setError(null)
      setSending(false)
    }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const phone = String(fd.get('phone') ?? '').trim()
    const gotcha = fd.get('_gotcha')

    if (!name || !email || !phone) {
      setError('Please fill in your name, email, and contact number.')
      return
    }

    setSending(true)
    setError(null)

    try {
      const pageUrl = `${site.canonicalUrl}/`
      const res = await fetch(formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: 'Offer request from landing carousel — please send a website offer.',
          Website: `${site.agencyName} · Offer modal · ${pageUrl}`,
          _subject: `${site.agencyName} · Offer request from ${name}`,
          _template: 'box',
          _replyto: email,
          _url: pageUrl,
          _gotcha: gotcha ?? '',
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === false) {
        throw new Error(
          typeof data.message === 'string' ? data.message : 'Could not send your request.',
        )
      }

      setSent(true)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="offer-modal" role="presentation">
          <motion.button
            type="button"
            className="offer-modal__backdrop"
            aria-label="Close offer form"
            onClick={closeOffer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28 }}
          />
          <motion.div
            className="offer-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 30, mass: 0.85 }
            }
          >
            <div className="offer-modal__glow" aria-hidden />
            <button type="button" className="offer-modal__close" onClick={closeOffer}>
              Close <span aria-hidden>×</span>
            </button>

            {sent ? (
              <div className="offer-modal__success">
                <p className="offer-modal__eyebrow">Request received</p>
                <h2 id={titleId} className="offer-modal__title">
                  Thank you.
                </h2>
                <p className="offer-modal__copy">
                  Your details are in — I&apos;ll reply with a clear offer, usually within 24 hours.
                </p>
                <button type="button" className="offer-modal__submit" onClick={closeOffer}>
                  Back to work
                </button>
              </div>
            ) : (
              <>
                <p className="offer-modal__eyebrow">Get an offer</p>
                <h2 id={titleId} className="offer-modal__title">
                  Get an offer now
                </h2>
                <p className="offer-modal__copy">
                  Share your name, email, and number — I&apos;ll come back with a tailored website offer.
                </p>

                <form className="offer-modal__form" onSubmit={handleSubmit} noValidate>
                  <label className="offer-modal__field">
                    <span>Name</span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="offer-modal__field">
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                    />
                  </label>
                  <label className="offer-modal__field">
                    <span>Contact number</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="+357 …"
                    />
                  </label>
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                    aria-hidden
                  />

                  {error ? <p className="offer-modal__error">{error}</p> : null}

                  <button type="submit" className="offer-modal__submit" disabled={sending}>
                    <span className="offer-modal__submit-sheen" aria-hidden />
                    <span>{sending ? 'Sending…' : 'Submit request'}</span>
                    {!sending ? <span aria-hidden>→</span> : null}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
