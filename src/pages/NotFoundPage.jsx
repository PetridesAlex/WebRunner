import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SiteChrome } from '../components/layout/SiteChrome'
import { Button } from '../components/ui/Button'
import './seoPage.css'

export function NotFoundPage() {
  return (
    <SiteChrome>
      <Seo
        title="Page not found | WebRunner Agency"
        description="The page you requested could not be found on WebRunner Agency."
        path="/404"
        noindex
      />
      <main className="seo-page seo-page--404">
        <header className="seo-page__hero">
          <div className="seo-page__container">
            <p className="seo-page__eyebrow">404</p>
            <h1 className="seo-page__h1">Page not found</h1>
            <p className="seo-page__lead">
              That URL does not exist. Head back to the homepage or explore our services.
            </p>
            <div className="seo-page__actions">
              <Button href="/" variant="primary">
                Back to homepage
              </Button>
              <Button href="/contact" variant="ghost">
                Contact us
              </Button>
              <Link to="/web-development" className="btn btn--ghost">
                Web development
              </Link>
            </div>
          </div>
        </header>
      </main>
    </SiteChrome>
  )
}
