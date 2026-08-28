import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public/brand')
const rawVideo = join(outDir, 'webrunner-scroll-raw.webm')
const outputVideo = join(outDir, 'webrunner-website-commercial-v3.mp4')

const require = createRequire(import.meta.url)
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
  recordVideo: {
    dir: outDir,
    size: { width: 1080, height: 1920 },
  },
})
const page = await context.newPage()

await page.goto('https://www.webrunneragency.com/', { waitUntil: 'networkidle' })

const skip = page.getByRole('button', { name: /skip and show the site/i })
if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) {
  await skip.click()
  await page.waitForTimeout(800)
}

const accept = page.getByRole('button', { name: /^accept$/i })
if (await accept.isVisible({ timeout: 2000 }).catch(() => false)) {
  await accept.click()
  await page.waitForTimeout(500)
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(900)

const totalScroll = await page.evaluate(() => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return Math.max(0, max)
})

const durationMs = 12000
const start = Date.now()

while (Date.now() - start < durationMs) {
  const elapsed = Date.now() - start
  const t = elapsed / durationMs
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  const y = Math.round(totalScroll * eased)
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), y)
  await page.waitForTimeout(40)
}

await page.waitForTimeout(1200)
const recordedPath = await page.video().path()
await context.close()
await browser.close()

execFileSync(
  ffmpegPath,
  [
    '-i',
    recordedPath,
    '-vf',
    'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,eq=brightness=0.02:saturation=1.08,unsharp=3:3:0.4,fade=t=in:st=0:d=0.5,fade=t=out:st=14.2:d=0.8',
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
  ],
  { stdio: 'inherit' },
)

console.log(`\nVideo saved: ${outputVideo}`)
