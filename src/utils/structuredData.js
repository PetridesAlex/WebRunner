import { seo, faqItems, services } from '../data/seo'
import { site } from '../data/site'

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
      name: 'Web design & development services',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
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
