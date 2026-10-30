import { projects } from './projects'

/** Filter tabs on the work carousel landing page. */
export const workCategories = [
  { id: 'all', label: 'All', shortLabel: 'All' },
  { id: 'websites', label: 'Websites', shortLabel: 'Websites' },
  { id: 'web-applications', label: 'Web applications', shortLabel: 'Web apps' },
  { id: 'mobile-applications', label: 'Mobile applications', shortLabel: 'Mobile' },
  { id: 'crm-systems', label: 'CRM systems', shortLabel: 'CRM' },
]

/** Editorial slide accents — warm brand-adjacent hues, no purple glow. */
const SLIDE_META = {
  'honeywell-travel': {
    title: 'Honeywell\nTravel',
    accent: '#c47a3a',
    groups: ['websites'],
  },
  'united-properties': {
    title: 'United\nProperties',
    accent: '#5a6b7a',
    groups: ['websites'],
  },
  'kaja-management': {
    title: 'Kaja\nManagement',
    accent: '#a38458',
    groups: ['websites'],
  },
  'komodromos-group': {
    title: 'Komodromos\nGroup',
    accent: '#6e7580',
    groups: ['websites'],
  },
  'travel-hub-crm': {
    title: 'Travel-Hub\nCRM',
    accent: '#2f6f6a',
    groups: ['crm-systems', 'web-applications'],
  },
  'reforge-website': {
    title: 'Reforge\nWebsite',
    accent: '#c94b2a',
    groups: ['websites'],
  },
  'reforge-mobile': {
    title: 'Reforge\nApp',
    accent: '#8a3220',
    groups: ['mobile-applications'],
  },
}

const GROUP_LABEL = {
  websites: 'Website',
  'web-applications': 'Web application',
  'mobile-applications': 'Mobile application',
  'crm-systems': 'CRM system',
}

/**
 * Map portfolio projects into HeroCarousel slides.
 */
export function getHeroCarouselItems(categoryId = 'all') {
  return projects
    .map((project) => {
      const slide = SLIDE_META[project.id] ?? {
        title: project.title.replace(' ', '\n'),
        accent: '#c9a87c',
        groups: ['websites'],
      }

      return {
        id: project.id,
        title: slide.title,
        image: project.image,
        credit: 'BY WEBRUNNER.',
        meta: [
          String(project.year),
          (GROUP_LABEL[slide.groups[0]] ?? project.category).toUpperCase(),
          'CYPRUS',
        ],
        accent: slide.accent,
        href: project.live,
        groups: slide.groups,
      }
    })
    .filter((item) => categoryId === 'all' || item.groups.includes(categoryId))
}
