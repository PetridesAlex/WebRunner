import { site } from './site'
import { faqItems } from './faq'
import { services } from './services'

export const seo = {
  siteUrl: site.canonicalUrl,
  siteName: site.brand,
  legalName: site.agencyName,
  locale: 'en_CY',
  language: 'en',
  defaultImage: `${site.canonicalUrl}/brand/webrunner-hero-screenshot.png`,
  twitterHandle: '@webrunner_agency',

  home: {
    title: 'Web Design & Web Development Agency Cyprus | WebRunner',
    description:
      'WebRunner is a Cyprus web design and web development agency building fast, SEO-optimized websites for businesses in Limassol, Nicosia, and worldwide. Custom business sites, landing pages, and eCommerce.',
    keywords: [
      'web design Cyprus',
      'web development agency Cyprus',
      'website designer Cyprus',
      'web developer Limassol',
      'web design Nicosia',
      'website development Cyprus',
      'custom website Cyprus',
      'professional web design',
      'React web development',
      'WebRunner',
    ].join(', '),
    path: '/',
  },

  cookies: {
    title: 'Cookie Policy | WebRunner — Web Design Agency Cyprus',
    description:
      'How WebRunner uses cookies on webrunneragency.com. Learn about analytics, preferences, and your privacy choices.',
    path: '/cookies',
  },

  business: {
    email: site.email,
    phone: '+35797866884',
    addressLocality: 'Limassol',
    addressCountry: 'CY',
    addressCountryName: 'Cyprus',
    areaServed: ['Cyprus', 'Limassol', 'Nicosia', 'Larnaca', 'Paphos', 'Europe', 'Worldwide'],
    serviceTypes: [
      'Web Design',
      'Web Development',
      'Website Design',
      'Landing Page Design',
      'eCommerce Development',
      'Website Redesign',
      'SEO-Friendly Website Development',
    ],
    priceRange: '€€',
    foundingDate: '2020',
  },

  socialProfiles: [
    site.socials.find((s) => s.id === 'github')?.href,
    site.messengerLinks?.find((m) => m.id === 'instagram')?.href,
  ].filter(Boolean),
}

export function pageUrl(path = '/') {
  if (path === '/') return `${seo.siteUrl}/`
  return `${seo.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export { faqItems, services }
