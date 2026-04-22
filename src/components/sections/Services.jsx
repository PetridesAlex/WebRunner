import { services } from '../../data/services'
import { SectionHeader } from '../ui/SectionHeader'
import { ServiceIcon } from './ServiceIcon'

export function Services() {
  return (
    <section id="services" className="services section section--services" aria-labelledby="services-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="services-heading"
          eyebrow="Services"
          title="Web solutions built for real growth"
          subtitle="From strategic business sites to high-performance stores - modern websites designed to attract, convert, and scale."
        />
        <div className="services__grid">
          {services.map((s) => (
            <article key={s.id} className="service-card" data-reveal>
              <div className="service-card__top">
                <span className="service-card__index">{s.id}</span>
                <ServiceIcon name={s.icon} />
              </div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
