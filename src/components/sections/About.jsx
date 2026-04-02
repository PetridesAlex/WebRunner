import { SectionHeader } from '../ui/SectionHeader'

export function About() {
  return (
    <section id="about" className="about section" aria-labelledby="about-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="about-heading"
          eyebrow="About"
          title="Design with intent. Build with precision."
          subtitle="I partner with founders and teams who want a digital presence that feels considered — not generic. Every layout, interaction, and line of code serves the story you need to tell."
        />
        <div className="about__grid">
          <div className="about__prose" data-reveal>
            <p>
              WebRunner is where layout meets logic: thoughtful UI, crisp typography, and motion
              that feels intentional — backed by fast loads, solid accessibility, and React
              codebases you can extend without pain.
            </p>
            <p>
              I started this studio after too many projects where “good enough” shipped by default.
              Here you get direct access, realistic timelines, and a handoff you can stand behind:
              the same polish you&apos;d expect from a larger shop, without the layers in between.
            </p>
          </div>
          <aside className="about__aside" data-reveal>
            <div className="about__stats-row">
              <div className="about__stat">
                <span className="about__stat-num">5<span className="about__stat-plus">+</span></span>
                <span className="about__stat-label">Years crafting interfaces</span>
              </div>
              <div className="about__stat-divider" aria-hidden />
              <div className="about__stat">
                <span className="about__stat-num about__stat-num--symbol">∞</span>
                <span className="about__stat-label">Attention to the last pixel</span>
              </div>
            </div>
            <blockquote className="about__quote">
              <span className="about__quote-mark" aria-hidden>"</span>
              <p className="about__quote-text">Trust is designed in the details — load time, copy rhythm, and calm interactions.</p>
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  )
}
