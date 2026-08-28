import { seo, faqItems } from '../data/seo'
import { site } from '../data/site'
import { getServicePages } from '../data/seoPages'
import { pageUrl } from '../data/seo'

const CATALOG_SERVICES = [
  {
    name: 'Web Development',
    description:
      'Custom websites and web applications for businesses in Cyprus and internationally.',
    url: '/web-development',
  },
  {
    name: 'Mobile App Development',
    description: 'iOS, Android and React Native mobile applications with premium UI.',
    url: '/mobile-app-development',
  },
  {
    name: 'E-commerce Development',
    description: 'Custom online stores with conversion-focused design and scalable structure.',
    url: '/ecommerce-development',
  },
  {
    name: 'CRM Development',
    description: 'Custom CRM platforms for leads, bookings and team workflows.',
    url: '/crm-development',
  },
  {
    name: 'Custom Software Development',
    description: 'Tailored web platforms and internal tools for growing businesses.',
    url: '/custom-software-development',
  },
  {
    name: 'Business Automation',
    description: 'Workflow automation that reduces manual work across tools and teams.',
    url: '/business-automation',
  },
  {
    name: 'API Integrations',
    description: 'Reliable integrations between products, payments, CRMs and third-party APIs.',
    url: '/api-integrations',
  },
]

function orgNode() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${seo.siteUrl}/#organization`,
    name: seo.legalName,
    alternateName: seo.siteName,
    url: seo.siteUrl,
    logo: `${seo.siteUrl}/webrunner-logo.png`,
    image: seo.defaultImage,
    description: seo.home.description,
    email: seo.business.email,
    telephone: seo.business.phone,
    priceRange: seo.business.priceRange,
    foundingDate: seo.business.foundingDate,
    address: {
      '@type': 'PostalAddress',
      addressLocality: seo.business.addressLocality,
      addressCountry: seo.business.addressCountry,
    },
    areaServed: seo.business.areaServed.map((name) => {
      if (name === 'Cyprus') return { '@type': 'Country', name }
      if (name === 'Europe' || name === 'Worldwide') return { '@type': 'Place', name }
      return { '@type': 'City', name }
    }),
    knowsAbout: seo.business.serviceTypes,
    sameAs: seo.socialProfiles,
    founder: {
      '@type': 'Person',
      name: site.name,
      jobTitle: site.role,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web design & software development services',
      itemListElement: CATALOG_SERVICES.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: pageUrl(service.url),
          provider: { '@id': `${seo.siteUrl}/#organization` },
          areaServed: seo.business.areaServed,
        },
      })),
    },
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${seo.siteUrl}/#website`,
    url: seo.siteUrl,
    name: seo.siteName,
    description: seo.home.description,
    publisher: { '@id': `${seo.siteUrl}/#organization` },
    inLanguage: seo.language,
  }
}

function faqNode() {
  return {
    '@type': 'FAQPage',
    '@id': `${seo.siteUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function breadcrumbNode(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildHomeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      orgNode(),
      faqNode(),
      breadcrumbNode([{ name: 'Home', url: `${seo.siteUrl}/` }]),
    ],
  }
}

export function buildCookiesStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      orgNode(),
      breadcrumbNode([
        { name: 'Home', url: `${seo.siteUrl}/` },
        { name: 'Cookie Policy', url: `${seo.siteUrl}/cookies` },
      ]),
    ],
  }
}

export function buildServicePageSchema(page) {
  const url = pageUrl(page.path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      orgNode(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${seo.siteUrl}/#website` },
        about: { '@id': `${url}#service` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.serviceName || page.h1,
        description: page.description,
        url,
        provider: { '@id': `${seo.siteUrl}/#organization` },
        areaServed: seo.business.areaServed,
      },
      breadcrumbNode([
        { name: 'Home', url: `${seo.siteUrl}/` },
        { name: page.serviceName || page.h1, url },
      ]),
    ],
  }
}

export function buildCompositePageSchema(page) {
  const url = pageUrl(page.path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      orgNode(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${seo.siteUrl}/#website` },
      },
      breadcrumbNode([
        { name: 'Home', url: `${seo.siteUrl}/` },
        { name: page.h1, url },
      ]),
    ],
  }
}

export { getServicePages, CATALOG_SERVICES }
