import { Link } from 'react-router-dom'
import { services } from '../../data/services'
import { SectionHeader } from '../ui/SectionHeader'
import { ServiceIcon } from './ServiceIcon'

/** Optional SEO landing link for homepage service cards (minimal, non-layout-breaking). */
const serviceSeoLinks = {
  '06': { to: '/ecommerce-development', label: 'E-commerce development' },
  '01': { to: '/web-development', label: 'Web development' },
  '05': { to: '/web-development', label: 'Web development' },
}

export function Services() {
  return (
    <section id="services" className="services section section--services" aria-labelledby="services-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="services-heading"
          eyebrow="Services"
          title="Web solutions built for real growth"
          subtitle="Web design and development for Cyprus businesses and global brands — from strategic business sites to high-performance stores built to attract, convert, and scale."
        />
        <div className="services__grid">
          {services.map((s) => {
            const seoLink = serviceSeoLinks[s.id]
            return (
              <article key={s.id} className="service-card" data-reveal>
                <div className="service-card__top">
                  <span className="service-card__index">{s.id}</span>
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.description}</p>
                {seoLink ? (
                  <Link to={seoLink.to} className="service-card__more">
                    Learn more →
                  </Link>
                ) : null}
              </article>
            )
          })}
        </div>
        <p className="services__seo-links" data-reveal>
          Explore:{' '}
          <Link to="/web-development">Web development</Link>
          {' · '}
          <Link to="/mobile-app-development">Mobile apps</Link>
          {' · '}
          <Link to="/ecommerce-development">E-commerce</Link>
          {' · '}
          <Link to="/crm-development">CRM</Link>
          {' · '}
          <Link to="/custom-software-development">Custom software</Link>
          {' · '}
          <Link to="/business-automation">Automation</Link>
          {' · '}
          <Link to="/api-integrations">API integrations</Link>
        </p>
      </div>
    </section>
  )
}
