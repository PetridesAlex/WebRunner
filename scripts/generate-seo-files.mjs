import { writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const base = (process.env.VITE_SITE_URL || 'https://www.webrunneragency.com').replace(/\/$/, '')

const { getSitemapEntries, SPA_ROUTES, REDIRECT_TO_HOME_ROUTES } = await import(
  pathToFileURL(join(root, 'src/data/seoPages.js')).href
)

const entries = getSitemapEntries()
const seen = new Set()
const urlBlocks = []

for (const page of entries) {
  const loc = page.path === '/' ? `${base}/` : `${base}${page.path}`
  if (seen.has(loc)) continue
  if (loc.includes('#')) continue
  if (/localhost|127\.0\.0\.1/i.test(loc)) continue
  seen.add(loc)
  urlBlocks.push(`  <url>
    <loc>${loc}</loc>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>`)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(root, 'public/robots.txt'), robots, 'utf8')

const vercelPath = join(root, 'vercel.json')
const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'))

// Google-indexed subpaths permanently redirect to the homepage.
vercel.redirects = REDIRECT_TO_HOME_ROUTES.flatMap((path) => [
  { source: path, destination: '/', permanent: true },
  { source: `${path}/`, destination: '/', permanent: true },
])

// Cookies stays as a real page (noindex).
vercel.rewrites = SPA_ROUTES.map((path) => ({
  source: path,
  destination: '/index.html',
}))

writeFileSync(vercelPath, `${JSON.stringify(vercel, null, 2)}\n`, 'utf8')

console.log(
  `SEO files generated for ${base} (${urlBlocks.length} sitemap URLs, ${REDIRECT_TO_HOME_ROUTES.length} home redirects, ${SPA_ROUTES.length} SPA rewrites)`,
)
