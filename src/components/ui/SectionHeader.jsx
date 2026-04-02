export const SectionHeader = ({ eyebrow, title, subtitle, align = 'left', titleId }) => (
  <header className={`section-header section-header--${align}`} data-reveal>
    {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
    <h2 id={titleId} className="section-header__title">
      {title}
    </h2>
    {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
  </header>
)
