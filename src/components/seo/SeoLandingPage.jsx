import { Link } from 'react-router-dom'
import { Seo } from '../Seo'
import { Button } from '../ui/Button'
import { SiteChrome } from '../layout/SiteChrome'
import { getRelatedPages } from '../../data/seoPages'
import { buildServicePageSchema } from '../../utils/structuredData'
import '../../pages/seoPage.css'

export function SeoLandingPage({ page }) {
  const related = getRelatedPages(page)

  return (
    <SiteChrome>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={buildServicePageSchema(page)}
      />
      <main className="seo-page">
        <header className="seo-page__hero">
          <div className="seo-page__container">
            {page.eyebrow ? <p className="seo-page__eyebrow">{page.eyebrow}</p> : null}
            <h1 className="seo-page__h1">{page.h1}</h1>
            {page.lead ? <p className="seo-page__lead">{page.lead}</p> : null}
            <div className="seo-page__actions">
              <Button href="/contact" variant="primary">
                Start a project
              </Button>
              <Button href="/contact" variant="ghost">
                Let&apos;s talk
              </Button>
              <Button href="/contact" variant="ghost" className="seo-page__cta-quote">
                Get a quote
              </Button>
            </div>
          </div>
        </header>

        <div className="seo-page__body">
          <div className="seo-page__container seo-page__grid">
            <div className="seo-page__content">
              {page.sections?.map((section) => (
                <section key={section.heading} className="seo-page__section">
                  <h2 className="seo-page__h2">{section.heading}</h2>
                  {section.body.map((para) => (
                    <p key={para.slice(0, 48)} className="seo-page__p">
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <aside className="seo-page__aside">
              <div className="seo-page__card">
                <h2 className="seo-page__card-title">Based in Limassol</h2>
                <p className="seo-page__card-text">
                  Serving clients across Cyprus, Europe and internationally — premium design and development
                  without the big-agency overhead.
                </p>
                <Button href="/contact" variant="primary" className="btn--sm">
                  Get a quote
                </Button>
              </div>

              {page.homeAnchors?.length ? (
                <div className="seo-page__card seo-page__card--muted">
                  <h2 className="seo-page__card-title">On the main site</h2>
                  <ul className="seo-page__link-list">
                    {page.homeAnchors.map((a) => (
                      <li key={a.href}>
                        <a href={a.href}>{a.label}</a>
                      </li>
                    ))}
                    <li>
                      <Link to="/">Back to homepage</Link>
                    </li>
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="seo-page__related" aria-labelledby="related-services-heading">
            <div className="seo-page__container">
              <h2 id="related-services-heading" className="seo-page__h2">
                Related services
              </h2>
              <div className="seo-page__related-grid">
                {related.map((r) => (
                  <Link key={r.path} to={r.path} className="seo-page__related-card">
                    <span className="seo-page__related-eyebrow">{r.eyebrow}</span>
                    <span className="seo-page__related-title">{r.serviceName || r.h1}</span>
                    <span className="seo-page__related-cta">Learn more →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </SiteChrome>
  )
}
