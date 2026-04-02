import { useState, useEffect } from 'react'

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'services',
  'solutions',
  'portfolio',
  'journey',
  'testimonials',
  'contact',
]

export function useActiveSection() {
  const [activeId, setActiveId] = useState('hero')

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-42% 0px -42% 0px',
        threshold: 0,
      },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return activeId
}
