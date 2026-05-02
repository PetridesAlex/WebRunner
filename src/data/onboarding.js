/** Lead onboarding — option ids → display labels (also used in emails / contact prefill). */
export const ONBOARDING = [
  {
    id: 'need',
    question: 'What do you need a website for?',
    microcopy: 'Pick what matters most right now — we’ll tailor everything around it.',
    options: [
      { id: 'launch-new-business', label: 'Launch a new business' },
      { id: 'redesign-website', label: 'Redesign my current website' },
      { id: 'more-leads', label: 'Get more clients / leads' },
      { id: 'sell-online', label: 'Sell products online' },
      { id: 'portfolio-brand', label: 'Portfolio / personal brand' },
    ],
  },
  {
    id: 'business',
    question: 'What best describes your business?',
    microcopy: 'So I can speak your industry’s language from day one.',
    options: [
      { id: 'real-estate', label: 'Real Estate' },
      { id: 'travel-tourism', label: 'Travel / Tourism' },
      { id: 'ecommerce', label: 'eCommerce' },
      { id: 'corporate', label: 'Corporate / Business' },
      { id: 'personal-brand', label: 'Personal Brand / Portfolio' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    id: 'level',
    question: 'What level of website are you looking for?',
    microcopy: 'From lean launches to fully bespoke builds — all in.',
    options: [
      { id: 'simple-clean', label: 'Simple & clean' },
      { id: 'professional-modern', label: 'Professional & modern' },
      { id: 'high-end-custom', label: 'High-end & fully custom' },
    ],
  },
  {
    id: 'timeline',
    question: 'How soon do you need your website?',
    microcopy: 'No pressure — just so I know how to prioritise your roadmap.',
    options: [
      { id: 'asap', label: 'As soon as possible' },
      { id: 'two-three-weeks', label: 'Within 2–3 weeks' },
      { id: 'exploring', label: 'Just exploring ideas' },
    ],
  },
]

export const RESULTS_CARDS = [
  {
    id: 'design',
    title: 'Custom Design',
    text: 'On-brand visuals and layout built around your goals — not a generic template.',
  },
  {
    id: 'speed',
    title: 'Fast Performance',
    text: 'Lean code and assets so your site feels instant on every device.',
  },
  {
    id: 'convert',
    title: 'Built to Convert',
    text: 'Structure and messaging shaped to turn visitors into enquiries and sales.',
  },
]

export function labelFor(stepId, optionId) {
  const step = ONBOARDING.find((s) => s.id === stepId)
  const opt = step?.options.find((o) => o.id === optionId)
  return opt?.label ?? ''
}

/** Line shown under the stair preloader after onboarding. */
export function preloaderLineFromVisitor(v) {
  if (!v?.need) return 'Crafting your first impression'
  const line = labelFor('need', v.need)
  return line ? `Aligned with your goal: ${line}` : 'Crafting your first impression'
}

/** Short hero line after onboarding (no name collected in quiz). */
export function heroCaptionFromVisitor(v) {
  if (!v?.need) return null
  const line = labelFor('need', v.need)
  return line ? `Your focus: ${line}.` : null
}

/** Human-readable block for contact form / emails */
export function formatOnboardingSummary(v) {
  if (!v || typeof v !== 'object') return ''
  const need = v.need ? labelFor('need', v.need) : ''
  const business = v.business ? labelFor('business', v.business) : ''
  const level = v.level ? labelFor('level', v.level) : ''
  const timeline = v.timeline ? labelFor('timeline', v.timeline) : ''
  const lines = [
    need && `Website goal: ${need}`,
    business && `Business type: ${business}`,
    level && `Desired level: ${level}`,
    timeline && `Timeline: ${timeline}`,
  ].filter(Boolean)
  if (lines.length === 0) return ''
  return ['[From your website preferences]', ...lines].join('\n')
}
