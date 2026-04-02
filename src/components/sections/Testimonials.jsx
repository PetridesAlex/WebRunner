import { testimonials } from '../../data/testimonials'
import { SectionHeader } from '../ui/SectionHeader'

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="testimonials section"
      aria-labelledby="testimonials-heading"
      data-reveal-section
    >
      <div className="section__container">
        <SectionHeader
          titleId="testimonials-heading"
          eyebrow="Trust"
          title="What clients say"
          subtitle="Placeholder testimonials — swap in real quotes as projects wrap."
        />
        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="testimonial-card" data-reveal>
              <p className="testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
              <footer className="testimonial-card__footer">
                <span className="testimonial-card__avatar" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
                  </svg>
                </span>
                <span className="testimonial-card__meta">
                  <cite className="testimonial-card__name">{t.name}</cite>
                  <span className="testimonial-card__role">{t.role}</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
