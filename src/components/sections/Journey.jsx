import { journey } from '../../data/journey'
import { SectionHeader } from '../ui/SectionHeader'

export function Journey() {
  return (
    <section id="journey" className="journey section" aria-labelledby="journey-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="journey-heading"
          eyebrow="Experience"
          title="My journey"
          subtitle="A path shaped by curiosity, client work, and a growing studio practice focused on quality."
        />
        <ol className="journey__timeline">
          {journey.map((step, i) => (
            <li key={step.year} className="journey__step" data-reveal>
              <div className="journey__dot-wrap">
                <span className="journey__dot" />
                {i < journey.length - 1 && <span className="journey__line" aria-hidden />}
              </div>
              <div className="journey__content">
                <span className="journey__year">{step.year}</span>
                <h3 className="journey__title">{step.title}</h3>
                <p className="journey__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
