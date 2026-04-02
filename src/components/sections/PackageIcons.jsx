const icons = {
  starter: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 4l12 8v14H4V12l12-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11 22h10M16 18v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  business: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M6 28V14l10-6 10 6v14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 28V18h8v10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  premium: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 4l3 3 4-3 2 8-9 18L7 12l2-8 4 3 3-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function PackageIcon({ name }) {
  return <span className="solutions-card__icon-wrap">{icons[name] || icons.starter}</span>
}
