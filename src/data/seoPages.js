/**
 * Single source of truth for indexable SEO routes.
 * Safe for Node (prebuild) — no Vite-only imports.
 */

export const INDEXABLE_PAGES = [
  {
    path: '/',
    slug: 'home',
    kind: 'home',
    title: 'WebRunner Agency | Web Design & Software Development Cyprus',
    description:
      'WebRunner Agency is a web and software development agency in Limassol, Cyprus, building modern websites, mobile apps, e-commerce platforms, CRM systems and custom business software.',
    h1: 'Websites Built to Scale.',
    changefreq: 'weekly',
    priority: '1.0',
    inSitemap: true,
  },
  {
    path: '/web-development',
    slug: 'web-development',
    kind: 'service',
    title: 'Web Development Cyprus | WebRunner Agency',
    description:
      'Custom web development in Limassol, Cyprus — fast, SEO-ready business websites, landing pages and web apps for brands across Cyprus, Europe and worldwide.',
    h1: 'Web Development in Cyprus',
    eyebrow: 'Web development',
    lead:
      'We design and build modern websites that help businesses in Limassol and beyond look premium, load fast, and convert visitors into clients.',
    serviceName: 'Web Development',
    changefreq: 'monthly',
    priority: '0.9',
    inSitemap: true,
    related: ['mobile-app-development', 'ecommerce-development', 'api-integrations'],
    homeAnchors: [
      { label: 'See packages', href: '/#solutions' },
      { label: 'Selected work', href: '/#portfolio' },
      { label: 'FAQ', href: '/#faq' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Business websites, marketing sites, and product pages built with modern front-end stacks — clean structure, strong typography, and performance that feels intentional.',
          'Whether you need a new presence from scratch or a redesign of an outdated site, we focus on clarity, speed, and a distinctive visual voice.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Agencies, studios, property firms, travel brands, and growing companies in Cyprus who need a website that represents them properly online.',
          'We also work with international clients who want a Cyprus-based partner for design and development without the agency overhead.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'Discovery, structure, design, and build — you work directly with WebRunner from the first idea through launch.',
          'Every site ships with SEO-friendly markup, responsive layouts, and a foundation ready for content and growth.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'Based in Limassol, we combine premium design with practical engineering — React, Next.js, and motion when it earns its place.',
          'No template farms. No hand-offs into a black box. Just precise execution for brands that care how they show up online.',
        ],
      },
    ],
  },
  {
    path: '/mobile-app-development',
    slug: 'mobile-app-development',
    kind: 'service',
    title: 'Mobile App Development Cyprus | WebRunner Agency',
    description:
      'Mobile app development in Cyprus — iOS, Android and React Native products with polished UI, performance-first architecture and clear product flows.',
    h1: 'Mobile App Development',
    eyebrow: 'Mobile apps',
    lead:
      'From concept to store-ready builds — native-feeling mobile experiences for iOS and Android, engineered for daily use and brand polish.',
    serviceName: 'Mobile App Development',
    changefreq: 'monthly',
    priority: '0.9',
    inSitemap: true,
    related: ['web-development', 'custom-software-development', 'api-integrations'],
    homeAnchors: [
      { label: 'Selected work', href: '/#portfolio' },
      { label: 'Contact us', href: '/contact' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Consumer and business apps with clear navigation, reliable performance, and interfaces that feel premium on every screen size.',
          'We favour React Native and modern mobile patterns when cross-platform speed matters — without sacrificing craft.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Founders and teams in Cyprus and abroad who need an app that matches their brand and supports real workflows — training, bookings, commerce, or internal tools.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We shape product flows first, then design and develop iteratively so you can validate direction before polishing every screen.',
          'Integrations, push-ready architecture, and clean APIs are planned early — not bolted on at the end.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'One studio for design and development — consistent UI language across web and mobile, with Limassol-based collaboration and international delivery.',
        ],
      },
    ],
  },
  {
    path: '/ecommerce-development',
    slug: 'ecommerce-development',
    kind: 'service',
    title: 'E-commerce Development Cyprus | WebRunner Agency',
    description:
      'E-commerce website development in Cyprus — custom online stores with modern design, conversion-focused structure and scalable shopping experiences.',
    h1: 'E-commerce Development',
    eyebrow: 'Online stores',
    lead:
      'High-performance online stores built to convert — seamless shopping flows, refined product presentation, and structure that scales with your catalogue.',
    serviceName: 'E-commerce Development',
    changefreq: 'monthly',
    priority: '0.9',
    inSitemap: true,
    related: ['web-development', 'business-automation', 'api-integrations'],
    homeAnchors: [
      { label: 'Packages', href: '/#solutions' },
      { label: 'Selected work', href: '/#portfolio' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Custom storefronts with clear product discovery, trusted checkout paths, and design that makes your catalogue feel premium.',
          'From boutique catalogues to multi-category stores — we focus on speed, clarity, and conversion-driven layout.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Retail and DTC brands in Cyprus and Europe who need more than a generic template — a store that matches their positioning and sells with confidence.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We map the shopping journey, refine information architecture, then build a front-end experience that stays fast as your catalogue grows.',
          'Payments, shipping logic, and third-party tools are integrated deliberately so operations stay predictable.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'Design and development in one place — your brand stays coherent from homepage to product page to checkout.',
        ],
      },
    ],
  },
  {
    path: '/custom-software-development',
    slug: 'custom-software-development',
    kind: 'service',
    title: 'Custom Software Development Cyprus | WebRunner Agency',
    description:
      'Custom software development in Limassol, Cyprus — tailored web platforms, internal tools and product experiences built for how your business actually works.',
    h1: 'Custom Software Development',
    eyebrow: 'Custom software',
    lead:
      'Software shaped around your process — not the other way around. We build tailored platforms and tools that remove friction and scale with your team.',
    serviceName: 'Custom Software Development',
    changefreq: 'monthly',
    priority: '0.85',
    inSitemap: true,
    related: ['crm-development', 'business-automation', 'api-integrations'],
    homeAnchors: [
      { label: 'Selected work', href: '/#portfolio' },
      { label: 'Start a project', href: '/contact' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Internal tools, client portals, multi-tenant platforms, and product UIs that need more control than off-the-shelf software allows.',
          'Clean interfaces, reliable data flows, and architecture that stays maintainable as requirements evolve.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Growing companies in Cyprus and internationally who have outgrown spreadsheets or generic tools — and need software that fits their operations.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We clarify workflows and edge cases first, then design interfaces and build iteratively with clear milestones.',
          'You stay close to decisions — so the product reflects real use, not assumptions.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'Premium UI craft backed by solid engineering — the same standard we apply to client-facing websites, applied to the tools your team uses every day.',
        ],
      },
    ],
  },
  {
    path: '/crm-development',
    slug: 'crm-development',
    kind: 'service',
    title: 'CRM Development Cyprus | WebRunner Agency',
    description:
      'CRM development in Cyprus — custom CRM platforms and lead management systems that unify bookings, follow-ups and team workflows.',
    h1: 'CRM Development',
    eyebrow: 'CRM systems',
    lead:
      'CRM systems built for how your team sells and serves — unified leads, clear pipelines, and interfaces your staff will actually use.',
    serviceName: 'CRM Development',
    changefreq: 'monthly',
    priority: '0.85',
    inSitemap: true,
    related: ['custom-software-development', 'business-automation', 'api-integrations'],
    homeAnchors: [
      { label: 'Selected work', href: '/#portfolio' },
      { label: 'Contact', href: '/contact' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Custom CRM workspaces for agencies and service businesses — leads, bookings, proposals, alerts, and team collaboration in one polished product.',
          'Multi-agency or multi-brand setups when you need secure separation without losing a unified experience.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Travel agencies, property teams, and service firms in Cyprus who need CRM that matches their process — not a bloated suite they will never configure.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We map your pipeline and handoffs, design the day-to-day screens, then implement with data models that stay clear as you grow.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'We have shipped CRM-style platforms for real operators — performance, clarity, and UX that feel intentional, not enterprise-by-default.',
        ],
      },
    ],
  },
  {
    path: '/business-automation',
    slug: 'business-automation',
    kind: 'service',
    title: 'Business Automation Cyprus | WebRunner Agency',
    description:
      'Business automation in Cyprus — streamline operations with custom workflows, notifications and systems that reduce manual work across your team.',
    h1: 'Business Automation',
    eyebrow: 'Automation',
    lead:
      'Less manual busywork. More reliable handoffs. We design automation that fits your stack and frees your team to focus on clients.',
    serviceName: 'Business Automation',
    changefreq: 'monthly',
    priority: '0.85',
    inSitemap: true,
    related: ['api-integrations', 'crm-development', 'custom-software-development'],
    homeAnchors: [
      { label: 'Services overview', href: '/#services' },
      { label: 'Get a quote', href: '/contact' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Workflow automation between forms, CRMs, messaging tools, and internal dashboards — alerts, syncs, and status updates that keep projects moving.',
          'Thoughtful UX around automation so people stay in control, with clear visibility when something needs attention.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Teams in Limassol and across Europe who lose time to copy-paste, follow-ups, and disconnected tools — and want systems that quietly do the repetitive work.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We identify high-friction steps, design a simple automation map, then implement with monitoring in mind so issues surface early.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'Automation only helps when the product around it is clear. We build both — the logic and the interface your team trusts.',
        ],
      },
    ],
  },
  {
    path: '/api-integrations',
    slug: 'api-integrations',
    kind: 'service',
    title: 'API Integration Services Cyprus | WebRunner Agency',
    description:
      'API integration services in Cyprus — connect payments, CRMs, booking engines and third-party platforms into one coherent product experience.',
    h1: 'API Integrations',
    eyebrow: 'Integrations',
    lead:
      'Connect the tools you already use — payments, CRMs, booking engines, messaging — into one coherent product experience.',
    serviceName: 'API Integrations',
    changefreq: 'monthly',
    priority: '0.85',
    inSitemap: true,
    related: ['web-development', 'business-automation', 'custom-software-development'],
    homeAnchors: [
      { label: 'Selected work', href: '/#portfolio' },
      { label: "Let's talk", href: '/contact' },
    ],
    sections: [
      {
        heading: 'What we build',
        body: [
          'Reliable integrations between your website or app and third-party APIs — authentication, webhooks, sync jobs, and error handling that holds up in production.',
          'Front-end and back-end work stay aligned so users see consistent data, not stale states.',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'Businesses that need their digital product to talk to payments, calendars, CRMs, or industry platforms — without fragile glue code.',
        ],
      },
      {
        heading: 'How we work',
        body: [
          'We review API docs and edge cases early, design the data contract, then implement with logging and clear failure modes.',
        ],
      },
      {
        heading: 'Why WebRunner',
        body: [
          'Integrations succeed when UX and engineering move together. We own both sides so the finished experience feels seamless.',
        ],
      },
    ],
  },
  {
    path: '/work',
    slug: 'work',
    kind: 'composite',
    title: 'Selected Work | WebRunner Agency',
    description:
      'Selected web and software projects by WebRunner Agency — travel, property, SaaS and studio builds for clients in Cyprus and beyond.',
    h1: 'Selected work',
    eyebrow: 'Portfolio',
    lead:
      'A snapshot of recent directions — travel, property, launches, and product experiences. Each build balances clarity, performance, and a distinctive visual voice.',
    changefreq: 'monthly',
    priority: '0.8',
    inSitemap: true,
  },
  {
    path: '/about',
    slug: 'about',
    kind: 'composite',
    title: 'About WebRunner Agency | Cyprus',
    description:
      'About WebRunner Agency — a Limassol, Cyprus web design and software studio crafting premium, SEO-ready websites and digital products for local and international clients.',
    h1: 'Design with intent. Build with precision.',
    eyebrow: 'About',
    lead:
      'WebRunner is a Cyprus-based studio crafting premium digital experiences — from Limassol and Nicosia to clients worldwide.',
    changefreq: 'monthly',
    priority: '0.8',
    inSitemap: true,
  },
  {
    path: '/contact',
    slug: 'contact',
    kind: 'composite',
    title: 'Contact WebRunner Agency | Limassol, Cyprus',
    description:
      'Contact WebRunner Agency in Limassol, Cyprus — start a web, mobile, or software project. Usually replies within 24 hours.',
    h1: "Let's build something impressive together.",
    eyebrow: 'Contact',
    lead:
      'Tell us about your project. Based in Limassol — available for clients across Cyprus, Europe and internationally.',
    changefreq: 'monthly',
    priority: '0.8',
    inSitemap: true,
  },
]

/** Routes that should SPA-rewrite to index.html on Vercel (utility pages only). */
export const SPA_ROUTES = ['/cookies']

/** Former SEO landing paths — permanently redirect to homepage so Google results land on `/`. */
export const REDIRECT_TO_HOME_ROUTES = INDEXABLE_PAGES.filter((p) => p.path !== '/').map((p) => p.path)

export function getPageBySlug(slug) {
  return INDEXABLE_PAGES.find((p) => p.slug === slug)
}

export function getPageByPath(path) {
  return INDEXABLE_PAGES.find((p) => p.path === path)
}

export function getRelatedPages(page) {
  if (!page?.related?.length) return []
  return page.related.map((slug) => getPageBySlug(slug)).filter(Boolean)
}

export function getServicePages() {
  return INDEXABLE_PAGES.filter((p) => p.kind === 'service')
}

/** Only the homepage is submitted in the sitemap (subpages redirect to `/`). */
export function getSitemapEntries() {
  return INDEXABLE_PAGES.filter((p) => p.path === '/')
}
