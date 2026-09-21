/**
 * Post-build: emit a real HTML document per indexable route so crawlers
 * (and Google "About this result") receive correct meta + body content
 * instead of an empty SPA shell that always looks like the homepage.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const base = (process.env.VITE_SITE_URL || 'https://www.webrunneragency.com').replace(/\/$/, '')
const defaultImage = `${base}/brand/webrunner-hero-screenshot.png`

const { INDEXABLE_PAGES } = await import(pathToFileURL(join(root, 'src/data/seoPages.js')).href)

// Only homepage (+ cookies) get static HTML. Other SEO paths 301 to `/` on Vercel.
const pagesToRender = INDEXABLE_PAGES.filter((p) => p.path === '/')

const EXTRA_PAGES = [
  {
    path: '/cookies',
    title: 'Cookie Policy | WebRunner — Web Design Agency Cyprus',
    description:
      'How WebRunner uses cookies on webrunneragency.com. Learn about analytics, preferences, and your privacy choices.',
    h1: 'Cookie Policy',
    lead: 'Essential cookies help WebRunner remember your theme and privacy choice.',
    noindex: true,
  },
]

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pageUrl(path = '/') {
  if (path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function replaceAttrContent(html, tag, attrName, attrValue, contentAttr, nextContent) {
  const re = new RegExp(
    `(<${tag}\\b(?=[^>]*\\b${attrName}=["']${attrValue}["'])[^>]*\\b${contentAttr}=["'])([^"']*)(["'])`,
    'is',
  )
  if (re.test(html)) return html.replace(re, `$1${escapeHtml(nextContent)}$3`)

  const reReverse = new RegExp(
    `(<${tag}\\b(?=[^>]*\\b${contentAttr}=["'])[^>]*\\b${contentAttr}=["'])([^"']*)(["'][^>]*\\b${attrName}=["']${attrValue}["'])`,
    'is',
  )
  if (reReverse.test(html)) return html.replace(reReverse, `$1${escapeHtml(nextContent)}$3`)

  return html
}

function replaceTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
}

function replaceCanonical(html, href) {
  const re = /(<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["'])([^"']*)(["'])/is
  if (re.test(html)) return html.replace(re, `$1${escapeHtml(href)}$3`)
  return html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(href)}" />\n  </head>`)
}

function replaceHreflang(html, href) {
  return html
    .replace(
      /(<link\b[^>]*\brel=["']alternate["'][^>]*\bhreflang=["']en["'][^>]*\bhref=["'])([^"']*)(["'])/is,
      `$1${escapeHtml(href)}$3`,
    )
    .replace(
      /(<link\b[^>]*\brel=["']alternate["'][^>]*\bhreflang=["']en-CY["'][^>]*\bhref=["'])([^"']*)(["'])/is,
      `$1${escapeHtml(href)}$3`,
    )
}

function buildCrawlableBody(page) {
  const sections = Array.isArray(page.sections)
    ? page.sections
        .map((section) => {
          const paragraphs = (section.body || [])
            .map((p) => `<p>${escapeHtml(p)}</p>`)
            .join('\n')
          return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}</section>`
        })
        .join('\n')
    : ''

  const eyebrow = page.eyebrow ? `<p>${escapeHtml(page.eyebrow)}</p>` : ''
  const lead = page.lead ? `<p>${escapeHtml(page.lead)}</p>` : ''
  const h1 = page.h1 ? `<h1>${escapeHtml(page.h1)}</h1>` : `<h1>${escapeHtml(page.title)}</h1>`

  return `<main>
${eyebrow}
${h1}
${lead}
<p>${escapeHtml(page.description)}</p>
${sections}
<p><a href="/#contact">Start a project</a> · <a href="/">WebRunner Agency home</a> · <a href="/#portfolio">Selected work</a></p>
<p>WebRunner Agency · Limassol, Cyprus · <a href="mailto:info@webrunneragency.com">info@webrunneragency.com</a></p>
</main>`
}

function buildWebPageJsonLd(page, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'WebRunner',
      url: `${base}/`,
    },
    about: {
      '@type': 'Organization',
      name: 'Webrunner Agency',
      url: `${base}/`,
    },
  }
}

function applyPageMeta(html, page) {
  const canonical = pageUrl(page.path)
  const robots = page.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const googlebot = page.noindex ? 'noindex, nofollow' : 'index, follow'

  let next = replaceTitle(html, page.title)
  next = replaceAttrContent(next, 'meta', 'name', 'description', 'content', page.description)
  next = replaceAttrContent(next, 'meta', 'name', 'robots', 'content', robots)
  next = replaceAttrContent(next, 'meta', 'name', 'googlebot', 'content', googlebot)
  next = replaceCanonical(next, canonical)
  next = replaceHreflang(next, canonical)
  next = replaceAttrContent(next, 'meta', 'property', 'og:title', 'content', page.title)
  next = replaceAttrContent(next, 'meta', 'property', 'og:description', 'content', page.description)
  next = replaceAttrContent(next, 'meta', 'property', 'og:url', 'content', canonical)
  next = replaceAttrContent(next, 'meta', 'property', 'og:image', 'content', defaultImage)
  next = replaceAttrContent(next, 'meta', 'name', 'twitter:title', 'content', page.title)
  next = replaceAttrContent(next, 'meta', 'name', 'twitter:description', 'content', page.description)
  next = replaceAttrContent(next, 'meta', 'name', 'twitter:image', 'content', defaultImage)

  const jsonLd = JSON.stringify(buildWebPageJsonLd(page, canonical))
  if (next.includes('id="webrunner-route-structured-data"')) {
    next = next.replace(
      /<script id="webrunner-route-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="webrunner-route-structured-data" type="application/ld+json">${jsonLd}</script>`,
    )
  } else {
    next = next.replace(
      '</head>',
      `    <script id="webrunner-route-structured-data" type="application/ld+json">${jsonLd}</script>\n  </head>`,
    )
  }

  const body = buildCrawlableBody(page)
  // Keep #root empty so first paint is the dark boot shell / React portal — not unstyled SEO HTML.
  next = next.replace(/<div id="root">[\s\S]*?<\/div>/i, '<div id="root"></div>')
  next = next.replace(/<noscript id="webrunner-seo-fallback">[\s\S]*?<\/noscript>\s*/i, '')
  next = next.replace(
    /(<div id="root"><\/div>)/i,
    `$1\n    <noscript id="webrunner-seo-fallback">${body}</noscript>`,
  )

  return next
}

function writeRouteHtml(page, template) {
  const html = applyPageMeta(template, page)
  if (page.path === '/') {
    writeFileSync(join(dist, 'index.html'), html, 'utf8')
    return join(dist, 'index.html')
  }
  const dir = join(dist, page.path.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  const out = join(dir, 'index.html')
  writeFileSync(out, html, 'utf8')
  return out
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const pages = [...pagesToRender, ...EXTRA_PAGES]
const written = pages.map((page) => writeRouteHtml(page, template))

console.log(`Generated ${written.length} crawlable HTML routes in dist/`)
