import { websiteSolutions } from '../../data/websiteSolutions'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { PackageIcon } from './PackageIcons'

export function WebsiteSolutions() {
  const { eyebrow, title, subtitle, packages, footnote, footnoteCta } = websiteSolutions
  const [footnoteLead, ...footnoteRest] = footnote.split('\n')
  const footnoteBody = footnoteRest.join('\n')

  return (
    <section id="solutions" className="solutions section section--solutions" aria-labelledby="solutions-heading" data-reveal-section>
      <div className="solutions__ambient" aria-hidden />
      <div className="section__container">
        <SectionHeader
          titleId="solutions-heading"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className="solutions__grid">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              data-tier={pkg.id}
              className={
                pkg.featured
                  ? 'solutions-card solutions-card--featured'
                  : 'solutions-card'
              }
              data-reveal
            >
              <span className="solutions-card__shine" aria-hidden />
              {pkg.featured && (
                <span className="solutions-card__badge">Most popular</span>
              )}
              <div className="solutions-card__top">
                <PackageIcon name={pkg.icon} />
                <span className="solutions-card__tier">{pkg.tierLabel}</span>
              </div>
              <div className="solutions-card__main">
                <h3 className="solutions-card__title">{pkg.title}</h3>
                <p className="solutions-card__desc">{pkg.description}</p>
              </div>
              <div className="solutions-card__includes">
                <p className="solutions-card__includes-label">Includes</p>
                <ul className="solutions-card__features">
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="solutions-card__action">
                <Button href="#contact" variant={pkg.featured ? 'primary' : 'ghost'}>
                  {pkg.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="solutions__footnote" data-reveal>
          <div className="solutions__footnote-panel">
            <p className="solutions__footnote-text">
              <span className="solutions__footnote-lead">{footnoteLead}</span>
              {footnoteBody ? (
                <>
                  <br />
                  <span className="solutions__footnote-support">{footnoteBody}</span>
                </>
              ) : null}
            </p>
            <Button href="#contact" variant="primary">
              {footnoteCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
