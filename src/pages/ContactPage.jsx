import { Seo } from '../components/Seo'
import { SiteChrome } from '../components/layout/SiteChrome'
import { Button } from '../components/ui/Button'
import { Contact } from '../components/sections/Contact'
import { getPageBySlug } from '../data/seoPages'
import { buildCompositePageSchema } from '../utils/structuredData'
import './seoPage.css'

const page = getPageBySlug('contact')

export function ContactPage() {
  return (
    <SiteChrome>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={buildCompositePageSchema(page)}
      />
      <main className="seo-page seo-page--composite">
        <header className="seo-page__hero">
          <div className="seo-page__container">
            <p className="seo-page__eyebrow">{page.eyebrow}</p>
            <h1 className="seo-page__h1">{page.h1}</h1>
            <p className="seo-page__lead">{page.lead}</p>
            <div className="seo-page__actions">
              <Button href="#contact" variant="primary">
                Send a message
              </Button>
              <Button href="/work" variant="ghost">
                View selected work
              </Button>
            </div>
          </div>
        </header>
        <div className="seo-page__embed">
          <Contact />
        </div>
      </main>
    </SiteChrome>
  )
}
