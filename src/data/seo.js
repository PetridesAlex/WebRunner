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
    title: 'WebRunner Agency | Web Design & Software Development Cyprus',
    description:
      'WebRunner Agency is a web and software development agency in Limassol, Cyprus, building modern websites, mobile apps, e-commerce platforms, CRM systems and custom business software.',
    keywords: [
      'web design Cyprus',
      'web development agency Cyprus',
      'website designer Cyprus',
      'web developer Limassol',
      'software development Cyprus',
      'mobile app development Cyprus',
      'e-commerce Cyprus',
      'CRM development Cyprus',
      'WebRunner',
    ].join(', '),
    path: '/',
  },

  cookies: {
    title: 'Cookie Policy | WebRunner — Web Design Agency Cyprus',
    description:
      'How WebRunner uses cookies on webrunneragency.com. Learn about analytics, preferences, and your privacy choices.',
    path: '/cookies',
    noindex: true,
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
      'Mobile App Development',
      'E-commerce Development',
      'CRM Development',
      'Custom Software Development',
      'Business Automation',
      'API Integrations',
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
