import { useEffect } from 'react'
import { pageUrl } from '../data/seo'

const STRUCTURED_DATA_ID = 'webrunner-structured-data'

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return
  const selector = Object.entries(extra).reduce(
    (acc, [k, v]) => `${acc}[${k}="${v}"]`,
    `link[rel="${rel}"]`,
  )
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertStructuredData(data) {
  let el = document.getElementById(STRUCTURED_DATA_ID)
  if (!el) {
    el = document.createElement('script')
    el.id = STRUCTURED_DATA_ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * @param {{
 *   title: string
 *   description: string
 *   path?: string
 *   image?: string
 *   keywords?: string
 *   noindex?: boolean
 *   structuredData?: object
 * }} props
 */
export function Seo({ title, description, path = '/', image, keywords, noindex = false, structuredData }) {
  const canonical = pageUrl(path)
  const ogImage = image || `${pageUrl('/').replace(/\/$/, '')}/brand/webrunner-hero-screenshot.png`

  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)
    if (keywords) upsertMeta('name', 'keywords', keywords)

    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    upsertMeta('name', 'googlebot', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('name', 'geo.region', 'CY')
    upsertMeta('name', 'geo.placename', 'Cyprus')

    upsertLink('canonical', canonical)
    upsertLink('alternate', canonical, { hreflang: 'en' })
    upsertLink('alternate', canonical, { hreflang: 'en-CY' })
    upsertLink('alternate', pageUrl('/'), { hreflang: 'x-default' })

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'WebRunner')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:image:alt', 'WebRunner — web design and development agency in Cyprus')
    upsertMeta('property', 'og:locale', 'en_CY')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    if (structuredData) upsertStructuredData(structuredData)
  }, [title, description, canonical, ogImage, keywords, noindex, structuredData])

  return null
}
