import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import './TopTicker.css'

const MESSAGES = [
  { icon: '⚡', text: 'Website live in under 7 days' },
  { icon: '✦', text: 'Custom design — no templates' },
  { icon: '🚀', text: 'Deploy your website now' },
  { icon: '✦', text: 'Built for speed & conversions' },
  { icon: '🎯', text: 'SEO-ready from day one' },
  { icon: '✦', text: 'Mobile-first, pixel-perfect' },
  { icon: '💎', text: 'Premium quality, fixed price' },
  { icon: '🔥', text: 'Deploy now — go live today' },
  { icon: '✦', text: 'Direct access, zero middlemen' },
  { icon: '🌐', text: 'Your website, deployed in days' },
  { icon: '✦', text: 'Full ownership of your code' },
  { icon: '💥', text: 'Turn visitors into clients' },
]

const SPEED = 0.55
const SEP = <span className="top-ticker__sep" aria-hidden>◆</span>

export function TopTicker() {
  const items = [...MESSAGES, ...MESSAGES, ...MESSAGES]
  const x = useMotionValue(0)
  const trackRef = useRef(null)
  const pausedRef = useRef(false)

  useAnimationFrame(() => {
    if (pausedRef.current || !trackRef.current) return
    const trackW = trackRef.current.scrollWidth / 3
    let next = x.get() - SPEED
    if (Math.abs(next) >= trackW) next = 0
    x.set(next)
  })

  return (
    <div
      className="top-ticker"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      aria-label="Services announcement"
      role="marquee"
    >
      <div className="top-ticker__fade top-ticker__fade--left" aria-hidden />
      <div className="top-ticker__fade top-ticker__fade--right" aria-hidden />
      <motion.div ref={trackRef} className="top-ticker__track" style={{ x }}>
        {items.map((item, i) => (
          <span key={i} className="top-ticker__item">
            <span className="top-ticker__icon" aria-hidden>{item.icon}</span>
            <span className="top-ticker__text">{item.text}</span>
            {SEP}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
