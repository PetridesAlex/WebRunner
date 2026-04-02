import { site } from '../../data/site'
import { skillGroups } from '../../data/skills'
import { SectionHeader } from '../ui/SectionHeader'

export function Skills() {
  return (
    <section id="skills" className="skills section section--band" aria-labelledby="skills-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="skills-heading"
          eyebrow="Capabilities"
          title="Skills that stack"
          subtitle="Build, design, and deliver — so you always know what happens next."
          align="center"
        />

        <div className="skills__board" data-reveal>
          {skillGroups.map((group, i) => (
            <div key={group.label} className="skills__column">
              <div className="skills__column-head">
                <span className="skills__column-index" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="skills__group-title">{group.label}</h3>
              </div>
              <ul className="skills__pills">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="skill-pill">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="skills__voice">{site.skillsVoice}</p>
      </div>
    </section>
  )
}
