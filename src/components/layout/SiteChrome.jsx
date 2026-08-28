import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { BackToTop } from './BackToTop'

/**
 * Shared chrome for SEO / secondary pages (not the homepage one-pager).
 */
export function SiteChrome({ children, activeId }) {
  return (
    <>
      <div className="noise-overlay" aria-hidden />
      <Navbar activeId={activeId} />
      {children}
      <Footer />
      <BackToTop />
    </>
  )
}
