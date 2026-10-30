import { Seo } from '../components/Seo'
import { seo } from '../data/seo'
import { buildHomeStructuredData } from '../utils/structuredData'
import { WorkCarousel } from '../components/sections/WorkCarousel'
import { LandingMenu } from '../components/layout/LandingMenu'
import { TelegramFloat } from '../components/layout/TelegramFloat'
import { OfferModal } from '../components/ui/OfferModal'
import { OfferModalProvider } from '../context/OfferModalContext'

export function HomePage() {
  return (
    <OfferModalProvider>
      <Seo
        title={seo.home.title}
        description={seo.home.description}
        path={seo.home.path}
        keywords={seo.home.keywords}
        structuredData={buildHomeStructuredData()}
      />
      <div className="noise-overlay" aria-hidden />
      <LandingMenu />
      <main className="landing-main">
        <WorkCarousel />
      </main>
      <TelegramFloat />
      <OfferModal />
    </OfferModalProvider>
  )
}
