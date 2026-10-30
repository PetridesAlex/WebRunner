/**
 * A full-bleed editorial hero driven by a filmstrip.
 *
 * Every card shares one top edge. The focused card unfurls to full height while
 * its neighbours stay clipped to half. Changing the focus re-grades the whole
 * background to that image.
 *
 * Geometry is measured via ResizeObserver — ratios of the stage box.
 */
import * as React from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'

import { cn } from '@/lib/utils'
import NeonReveal from '@/components/ui/neon-reveal'

/* Ratios lifted from the reference layout, all relative to the stage box. */
const CARD_H = 0.264
const CARD_AR = 0.75
const GAP = 0.038
const STRIP_TOP = 0.5
const TITLE = 0.067
const LABEL = 0.0103
const PAD = 0.017
const RAIL = 0.2

const WHEEL_THRESHOLD = 60
const WHEEL_COOLDOWN = 420

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  menuLabel = 'Menu',
  contactHref,
  contactLabel = 'Get an offer now',
  onContactClick,
  autoplay = false,
  autoplayDelay = 4000,
  className,
}) {
  const stageRef = React.useRef(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex)
  const [dragging, setDragging] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  const reduced = useReducedMotion()

  const last = items.length - 1
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last))

  const go = React.useCallback(
    (next) => {
      const clamped = clamp(next, 0, Math.max(0, last))
      if (controlled === undefined) setUncontrolled(clamped)
      if (clamped !== index) onIndexChange?.(clamped)
    },
    [controlled, index, last, onIndexChange],
  )

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  const fullH = clamp(box.h * CARD_H, 96, 360)
  const halfH = fullH / 2
  const cardW = fullH * CARD_AR
  const gap = Math.max(4, Math.round(cardW * GAP))
  const step = cardW + gap
  const pad = Math.max(16, Math.round(box.w * PAD))
  const label = Math.max(9, Math.round(box.h * LABEL))

  const xFor = React.useCallback(
    (i) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  )
  const x = useMotionValue(0)
  const target = xFor(index)

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }

  React.useEffect(() => {
    if (dragging) return undefined
    const run = animate(x, target, spring)
    return () => run.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- spring derives from reduced
  }, [target, dragging, reduced, x])

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    let acc = 0
    let until = 0

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0)
      if (stuck) {
        acc = 0
        return
      }
      e.preventDefault()
      const now = e.timeStamp
      if (now < until) return
      acc += delta
      if (Math.abs(acc) < WHEEL_THRESHOLD) return
      go(index + Math.sign(acc))
      acc = 0
      until = now + WHEEL_COOLDOWN
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [go, index, last])

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return undefined
    const id = window.setTimeout(() => go(index === last ? 0 : index + 1), autoplayDelay)
    return () => window.clearTimeout(id)
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused])

  const active = items[index]
  if (!active) return null

  const lines = active.title.split('\n')
  const neonColors = [active.accent ?? '#E4CFAE', '#C9A87C']

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured work"
      onKeyDown={(e) => {
        const keys = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        }
        if (!(e.key in keys)) return
        e.preventDefault()
        go(keys[e.key])
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        'relative h-full min-h-[24rem] w-full overflow-hidden bg-[#0a0a0a] text-white select-none',
        'outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <NeonReveal
          colors={neonColors}
          backgroundColor="#0a0a0a"
          direction="down"
          expandFrom="center"
          trigger="mount"
          revealDelay={180}
          revealDuration={2600}
          easing="gentle"
          /* Keep the neon tube below brand + category chrome */
          inset={
            box.w > 0 && box.w < 900
              ? Math.max(150, Math.round(box.h * 0.2))
              : Math.max(220, Math.round(box.h * 0.28))
          }
          length={box.w > 0 && box.w < 900 ? 0.86 : 0.68}
          thickness={2.4}
          glow={1.15}
          spill={0.85}
          reach={1.05}
          hum={0.45}
          flicker={0.9}
          interactive={false}
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />

      <div
        className="work-chrome absolute inset-x-0 z-20 flex items-center justify-center"
        style={{
          top: Math.max(22, box.h * 0.028),
          gap: `${Math.max(36, box.w * 0.08)}px`,
          paddingLeft: pad,
          paddingRight: pad,
        }}
      >
        {onBack ? (
          <button type="button" onClick={onBack} className="work-chrome__action">
            <span aria-hidden>↖</span> Back
          </button>
        ) : (
          <span className="work-chrome__spacer" aria-hidden />
        )}
        {brand ? <div className="work-chrome__brand-slot">{brand}</div> : null}
        {onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            className="work-chrome__action work-chrome__menu"
            aria-controls="landing-navigation"
            aria-haspopup="dialog"
          >
            <span>{menuLabel}</span>
            <span className="work-chrome__menu-icon" aria-hidden>
              <span />
              <span />
            </span>
          </button>
        ) : (
          <span className="work-chrome__spacer" aria-hidden />
        )}
      </div>

      <div
        className="work-carousel__headline absolute inset-x-0 top-0 z-10 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        <div className="flex w-full flex-wrap items-end gap-x-[6vw] gap-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2
              key={index}
              className="font-semibold leading-[0.88] tracking-[-0.03em]"
              style={{
                fontSize: Math.max(
                  box.w > 0 && box.w < 640 ? 28 : 24,
                  Math.round(box.h * (box.w > 0 && box.w < 900 ? TITLE * 0.85 : TITLE)),
                ),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </AnimatePresence>

          <motion.div
            key={`credit-${index}`}
            className="work-chrome__meta flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {active.credit ? (
              <p
                className="work-chrome__credit uppercase tracking-[0.16em]"
                style={{ fontSize: label }}
              >
                {active.credit}
              </p>
            ) : null}
            <div className="work-chrome__ctas">
              {active.href ? (
                <a
                  href={active.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-chrome__cta work-chrome__cta--ghost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="work-chrome__cta-label">View live</span>
                  <span className="work-chrome__cta-icon" aria-hidden>
                    ↗
                  </span>
                </a>
              ) : null}
              {onContactClick || contactHref ? (
                onContactClick ? (
                  <button
                    type="button"
                    className="work-chrome__cta work-chrome__cta--solid"
                    onClick={(e) => {
                      e.stopPropagation()
                      onContactClick()
                    }}
                  >
                    <span className="work-chrome__cta-sheen" aria-hidden />
                    <span className="work-chrome__cta-label">{contactLabel}</span>
                    <span className="work-chrome__cta-icon" aria-hidden>
                      →
                    </span>
                  </button>
                ) : (
                  <a
                    href={contactHref}
                    className="work-chrome__cta work-chrome__cta--solid"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="work-chrome__cta-sheen" aria-hidden />
                    <span className="work-chrome__cta-label">{contactLabel}</span>
                    <span className="work-chrome__cta-icon" aria-hidden>
                      →
                    </span>
                  </a>
                )
              ) : null}
            </div>
          </motion.div>

          {active.meta?.length ? (
            <div
              className="work-carousel__facts ml-auto flex flex-wrap items-end"
              style={{ gap: `${Math.max(16, box.w * 0.055)}px` }}
            >
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="whitespace-nowrap uppercase tracking-[0.14em] opacity-80"
                  style={{ fontSize: label, fontFamily: 'var(--font-mono)' }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.45, delay: 0.12 + i * 0.06 }
                  }
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="absolute inset-x-0 z-10"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? 'grabbing' : 'grab' }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false)
            const thrown = x.get() + info.velocity.x * 0.12
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step))
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title.replace(/\n/g, ' ')}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
              className="relative shrink-0 overflow-hidden rounded-none bg-white/5"
              style={{ width: cardW }}
              animate={{ height: i === index ? fullH : halfH }}
              transition={spring}
            >
              <img
                src={item.image}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: '50% 26%' }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: i === index ? 0 : 0.12 }}
                transition={spring}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div
        className="absolute z-10"
        style={{ left: pad, bottom: Math.max(14, box.h * 0.022), width: box.w * RAIL }}
      >
        <div
          className="flex justify-between tabular-nums opacity-80"
          style={{ fontSize: label, fontFamily: 'var(--font-mono)' }}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{String(items.length).padStart(2, '0')}</span>
        </div>
        <div className="relative mt-2 h-px w-full bg-white/25">
          <motion.div
            className="absolute inset-y-0 bg-white"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>
    </div>
  )
}
