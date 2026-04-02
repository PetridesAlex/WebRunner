import { site } from '../../data/site'
import { Button } from '../ui/Button'
import { TelegramIcon } from '../icons/TelegramIcon'

export function Hero() {
  const lines = site.titleLine.split('\n')
  const telegramHref = site.messengerLinks?.find((m) => m.id === 'telegram')?.href

  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="hero__top-bar" role="region" aria-label="Announcement">
        <div className="hero__top-bar-inner">
          <p className="hero__top-bar-text">
            <span className="hero__top-bar-dot" aria-hidden />
            {site.heroBanner.text}{' '}
            <a href={site.heroBanner.href} className="hero__top-bar-link">
              {site.heroBanner.cta}
            </a>
            {telegramHref ? (
              <a
                href={telegramHref}
                className="hero__top-bar-telegram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on Telegram"
              >
                <TelegramIcon className="hero__top-bar-telegram-icon" size={18} />
              </a>
            ) : null}
          </p>
        </div>
      </div>
      <div className="hero__glow hero__glow--1" aria-hidden />
      <div className="hero__glow hero__glow--2" aria-hidden />
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow" data-reveal>
            <span className="hero__eyebrow-line" />
            {site.brand} · Digital studio
          </p>
          <h1 id="hero-heading" className="hero__title" data-reveal>
            {lines.map((line, i) => (
              <span key={i} className="hero__title-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__lead" data-reveal>
            {site.tagline}
          </p>
          <div className="hero__actions" data-reveal>
            <Button href="#portfolio" variant="primary">
              View selected work
            </Button>
            <Button href="#contact" variant="ghost">
              Let&apos;s talk
            </Button>
          </div>
        </div>
        <div className="hero__visual" data-reveal>
          <div className="hero__frame">
            <div className="hero__frame-inner">
              <img
                src={site.heroImage.src}
                alt={site.heroImage.alt}
                className="hero__photo"
                width={site.heroImage.width}
                height={site.heroImage.height}
                loading="eager"
                decoding="async"
              />
              <div className="hero__photo-caption">
                <span className="hero__caption-label">Visual direction</span>
                <span className="hero__caption-value">Refined & modern</span>
              </div>
            </div>
            <div className="hero__floating-card">
              <span className="hero__fc-label">Recent launch</span>
              <span className="hero__fc-title">Premium web experiences</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
