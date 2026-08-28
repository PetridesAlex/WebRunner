import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public/brand/site-sections')
const outputVideo = join(root, 'public/brand/webrunner-website-commercial-v3.mp4')

const require = createRequire(import.meta.url)
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

const sections = [
  { id: 'hero', url: 'https://www.webrunneragency.com/#hero' },
  { id: 'services', url: 'https://www.webrunneragency.com/#services' },
  { id: 'packages', url: 'https://www.webrunneragency.com/#packages' },
  { id: 'portfolio', url: 'https://www.webrunneragency.com/#portfolio' },
]

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
})
const page = await context.newPage()

await page.goto('https://www.webrunneragency.com/', { waitUntil: 'networkidle' })

// Dismiss onboarding if present
const skip = page.getByRole('button', { name: /skip and show the site/i })
if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) {
  await skip.click()
  await page.waitForTimeout(800)
}

// Accept cookies if present
const accept = page.getByRole('button', { name: /^accept$/i })
if (await accept.isVisible({ timeout: 2000 }).catch(() => false)) {
  await accept.click()
  await page.waitForTimeout(400)
}

const captured = []

for (const section of sections) {
  await page.goto(section.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const file = join(outDir, `${section.id}.png`)
  await page.screenshot({ path: file, fullPage: false })
  captured.push({ ...section, file })
  console.log(`Captured ${section.id}`)
}

await browser.close()

// Build ffmpeg filter: 3.75s per section with smooth zoom/pan + crossfade
const listFile = join(outDir, 'ffmpeg-inputs.txt')
const filterParts = []
const inputs = []

captured.forEach((item, i) => {
  inputs.push('-loop', '1', '-t', '4', '-i', item.file)
  const inLabel = `[${i}:v]`
  const outLabel = `[v${i}]`
  filterParts.push(
    `${inLabel}scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,` +
      `zoompan=z='min(zoom+0.0012,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1080x1920:fps=30,` +
      `format=yuv420p${outLabel}`,
  )
})

let chain = filterParts.join(';')
let last = '[v0]'
for (let i = 1; i < captured.length; i += 1) {
  const next = `[x${i}]`
  chain += `;${last}[v${i}]xfade=transition=fade:duration=0.6:offset=${3.15 * i}${next}`
  last = next
}

const filterComplex = `${chain};${last}fade=t=in:st=0:d=0.4,fade=t=out:st=14.2:d=0.8[vout]`

const args = [
  ...inputs.flatMap((x) => x),
  '-filter_complex',
  filterComplex,
  '-map',
  '[vout]',
  '-t',
  '15',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  '-y',
  outputVideo,
]

execFileSync(ffmpegPath, args, { stdio: 'inherit' })
console.log(`\nVideo saved: ${outputVideo}`)
