import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { HeroCarousel } from '../ui/hero-carousel'
import { getHeroCarouselItems, workCategories } from '../../data/heroCarousel'
import { useNavMenu } from '../../context/NavMenuContext'
import { useOfferModal } from '../../context/OfferModalContext'
import { site } from '../../data/site'

function BrandMark() {
  const reduced = useReducedMotion()

  return (
    <motion.span
      className="work-chrome__brand"
      initial={reduced ? false : { opacity: 0, y: -10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="work-chrome__mark-wrap" aria-hidden>
        <span className="work-chrome__mark-ring" />
        <motion.img
          className="work-chrome__mark"
          src="/webrunner-icon.svg"
          alt=""
          width={36}
          height={36}
          decoding="async"
          animate={reduced ? undefined : { rotate: [0, 8, 0] }}
          transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <span className="work-chrome__wordmark">
        <span className="work-chrome__name">{site.brand}</span>
        <span className="work-chrome__agency">Agency</span>
      </span>
    </motion.span>
  )
}

function WorkCategoryTabs({ category, onCategoryChange }) {
  return (
    <div className="work-categories__bar work-categories__bar--desktop" role="tablist" aria-label="Project categories">
      {workCategories.map((tab) => {
        const active = tab.id === category
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`work-categories__tab${active ? ' is-active' : ''}`}
            onClick={() => onCategoryChange(tab.id)}
          >
            <span className="work-categories__label-full">{tab.label}</span>
            <span className="work-categories__label-short">{tab.shortLabel}</span>
          </button>
        )
      })}
    </div>
  )
}

function WorkCategoryFilter({ category, onCategoryChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const active = workCategories.find((tab) => tab.id === category) ?? workCategories[0]

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (id) => {
    onCategoryChange(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="work-categories__bar work-categories__bar--mobile">
      <button
        type="button"
        className="work-categories__filter"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="work-category-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="work-categories__filter-kicker">Browse work</span>
        <span className="work-categories__filter-value">{active.label}</span>
        <span className="work-categories__filter-chevron" aria-hidden>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <ul id="work-category-menu" className="work-categories__menu" role="listbox" aria-label="Project categories">
          {workCategories.map((tab) => {
            const selected = tab.id === category
            return (
              <li key={tab.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`work-categories__menu-item${selected ? ' is-active' : ''}`}
                  onClick={() => pick(tab.id)}
                >
                  <span>{tab.label}</span>
                  {selected ? (
                    <span className="work-categories__menu-check" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export function WorkCarousel() {
  const { toggleMenu } = useNavMenu()
  const { openOffer } = useOfferModal()
  const [category, setCategory] = useState('all')
  const items = useMemo(() => getHeroCarouselItems(category), [category])

  return (
    <section id="work" className="work-carousel" aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">
        Selected work
      </h2>

      <div className="work-categories">
        <WorkCategoryTabs category={category} onCategoryChange={setCategory} />
        <WorkCategoryFilter category={category} onCategoryChange={setCategory} />
      </div>

      <HeroCarousel
        key={category}
        items={items}
        defaultIndex={0}
        brand={<BrandMark />}
        onMenu={toggleMenu}
        menuLabel="Menu"
        contactLabel="Get an offer now"
        onContactClick={openOffer}
        autoplay
        autoplayDelay={4500}
        className="work-carousel__stage"
      />
    </section>
  )
}
