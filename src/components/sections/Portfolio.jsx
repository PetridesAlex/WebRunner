import { projects } from '../../data/projects'
import { SectionHeader } from '../ui/SectionHeader'

function externalLinkProps(href) {
  if (typeof href === 'string' && href.startsWith('http')) {
    return { target: '_blank', rel: 'noopener noreferrer' }
  }
  return {}
}

export function Portfolio() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="portfolio" className="portfolio section section--spotlight" aria-labelledby="portfolio-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="portfolio-heading"
          eyebrow="Selected work"
          title="Projects that carry the brand"
          subtitle="A snapshot of recent directions — travel, property, launches, and studio sites. Each build balances clarity, performance, and a distinctive visual voice."
        />

        {featured.map((p) => (
          <article key={p.id} className="project-card project-card--featured" data-reveal>
            <a
              href={p.live}
              className="project-card__media"
              aria-label={`${p.title} live demo`}
              {...externalLinkProps(p.live)}
            >
              <img src={p.image} alt="" width={1200} height={750} loading="lazy" />
            </a>
            <div className="project-card__body">
              <div className="project-card__header-band">
                <span className="project-card__header-tag">
                  <span className="project-card__header-dot" aria-hidden />
                  Featured Project
                </span>
                <span className="project-card__header-year">2024</span>
              </div>
              <p className="project-card__category">{p.category}</p>
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__desc">{p.description}</p>
              <ul className="project-card__tech">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="project-card__links">
                <a href={p.live} className="project-card__btn" {...externalLinkProps(p.live)}>
                  Live demo
                </a>
              </div>
            </div>
          </article>
        ))}

        <div className="portfolio__grid">
          {rest.map((p) => (
            <article key={p.id} className="project-card project-card--compact" data-reveal>
              <a
                href={p.live}
                className="project-card__media"
                aria-label={`${p.title} live demo`}
                {...externalLinkProps(p.live)}
              >
                <img src={p.image} alt="" width={800} height={500} loading="lazy" />
              </a>
              <div className="project-card__body">
                <p className="project-card__category">{p.category}</p>
                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
                <ul className="project-card__tech">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="project-card__links">
                  <a href={p.live} className="project-card__btn" {...externalLinkProps(p.live)}>
                    Live demo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
