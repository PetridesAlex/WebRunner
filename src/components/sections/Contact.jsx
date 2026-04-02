import { useState } from 'react'
import { site } from '../../data/site'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

export function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="contact section section--contact" aria-labelledby="contact-heading" data-reveal-section>
      <div className="section__container">
        <div className="contact__layout">
          <div className="contact__intro">
            <SectionHeader
              titleId="contact-heading"
              eyebrow="Contact"
              title="Let’s build something impressive together."
              subtitle="Tell me about your business, timeline, and what success looks like. I’ll reply with clear next steps."
            />
            <div className="contact__details" data-reveal>
              <a href={`mailto:${site.email}`} className="contact__link">
                {site.email}
              </a>
              <div className="contact__meta">
                {site.phone && (
                  <div className="contact__meta-block">
                    <span className="contact__meta-label">Phone</span>
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="contact__meta-phone">
                      {site.phone}
                    </a>
                  </div>
                )}
                <div className="contact__meta-block">
                  <span className="contact__meta-label">Location</span>
                  <span className="contact__meta-location">{site.location}</span>
                </div>
                <div className="contact__meta-block">
                  <span className="contact__meta-label">Response time</span>
                  <span className="contact__meta-response">{site.responseTime}</span>
                </div>
              </div>
              <div className="contact__info-row">
                <div className="contact__info-badge">
                  <span className="contact__info-dot" aria-hidden />
                  Available for new projects
                </div>
              </div>
              <div className="contact__socials">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="contact__form-wrap" data-reveal>
            <form className="contact__form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                autoComplete="name"
              />
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
              />
              <label className="sr-only" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number (optional)"
                autoComplete="tel"
              />
              <label className="sr-only" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Project goals, links, timeline…"
              />
              <Button type="submit" variant="primary">
                Send message
              </Button>
              {sent && (
                <p className="contact__thanks" role="status">
                  Thanks — your message is ready to send. Connect this form to your backend or email
                  service.
                </p>
              )}
            </form>
            <div className="contact__form-info">
              <div className="contact__form-info-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href={`mailto:${site.email}`} className="contact__form-info-link">{site.email}</a>
              </div>
              <div className="contact__form-info-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{site.location}</span>
              </div>
              <div className="contact__form-info-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>{site.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
