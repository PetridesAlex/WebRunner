import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { projects } from '../../data/projects'
import './ProjectTicker.css'

function externalLinkProps(href) {
  if (typeof href === 'string' && href.startsWith('http')) {
    return { target: '_blank', rel: 'noopener noreferrer' }
  }
  return {}
}

const CARD_W = 340
const GAP = 20
const STEP = CARD_W + GAP
const SPEED = 0.55 // px per frame

export function ProjectTicker() {
  // Triple the list so we always have cards visible
  const items = [...projects, ...projects, ...projects]
  const total = projects.length * STEP
  const x = useMotionValue(0)
  const pausedRef = useRef(false)

  useAnimationFrame(() => {
    if (pausedRef.current) return
    let next = x.get() - SPEED
    if (Math.abs(next) >= total) next = 0
    x.set(next)
  })

  return (
    <div
      className="ticker-wrap"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      aria-label="Selected work"
    >
      <motion.div className="ticker-track" style={{ x }}>
        {items.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={p.live}
            className="ticker-card"
            {...externalLinkProps(p.live)}
            tabIndex={i < projects.length ? 0 : -1}
            aria-label={`View ${p.title}`}
          >
            <div className="ticker-card__media">
              <img src={p.image} alt="" loading="lazy" />
              <div className="ticker-card__overlay" />
            </div>
            <div className="ticker-card__body">
              <span className="ticker-card__cat">{p.category}</span>
              <span className="ticker-card__title">{p.title}</span>
              <span className="ticker-card__arrow" aria-hidden>↗</span>
            </div>
          </a>
        ))}
      </motion.div>
      <div className="ticker-fade ticker-fade--left" aria-hidden />
      <div className="ticker-fade ticker-fade--right" aria-hidden />
    </div>
  )
}
