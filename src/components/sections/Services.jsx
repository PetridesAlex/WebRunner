import { services } from '../../data/services'
import { SectionHeader } from '../ui/SectionHeader'

export function Services() {
  return (
    <section
      id="services"
      className="services section section--services section--editorial"
      aria-labelledby="services-heading"
      data-reveal-section
    >
      <div className="section__container">
        <SectionHeader
          titleId="services-heading"
          eyebrow="Services"
          title="What we build"
          subtitle="Web, commerce, and mobile — engineered for clarity, speed, and growth."
        />
        <ol className="services__strip">
          {services.map((s) => (
            <li key={s.id} className="services__strip-item" data-reveal>
              <span className="services__strip-index">{s.id}</span>
              <div className="services__strip-body">
                <h3 className="services__strip-title">{s.title}</h3>
                <p className="services__strip-desc">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
