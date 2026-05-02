const envUrl =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? String(import.meta.env.VITE_SITE_URL).replace(/\/$/, '')
    : ''

export const site = {
  brand: 'WebRunner',
  /** Legal / marketing name — used in FormSubmit notification emails */
  agencyName: 'Webrunner Agency',
  /** Live site URL, no trailing slash (fixes “localhost” in submission emails when testing locally). Override with VITE_SITE_URL if needed */
  canonicalUrl: envUrl || 'https://webrunneragency.com',
  name: 'Alex Petrides',
  role: 'Web Designer & Frontend Developer',
  titleLine: 'Websites Built to\nScale.',
  tagline:
    'We design and build modern websites that help your business grow and stand out online.',
  /** Short line under Skills — how you work */
  skillsVoice: 'Your site, built right — together.',
  heroBanner: {
    text: 'Looking for a website?',
    cta: 'Get in touch',
    href: '#contact',
  },
  /** Hero visual — abstract, keeps focus on headline */
  heroImage: {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=480&h=800&q=80',
    alt: '',
    width: 260,
    height: 433,
  },
  email: 'info@webrunneragency.com',
  phone: '',
  location: 'Based in Cyprus · Available worldwide',
  responseTime: 'Usually replies within 24 hours',
  year: new Date().getFullYear(),
  socials: [{ label: 'GitHub', id: 'github', href: 'https://github.com/PetridesAlex' }],
  /** Mobile drawer — set your real profile URLs */
  messengerLinks: [
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/+35797866884' },
    { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/35797866884' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/webrunner_agency/' },
  ],
}
