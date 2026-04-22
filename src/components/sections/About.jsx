import { SectionHeader } from '../ui/SectionHeader'

export function About() {
  return (
    <section id="about" className="about section" aria-labelledby="about-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="about-heading"
          eyebrow="About"
          title="Design with intent. Build with precision."
        />
        <div className="about__grid">
          <div className="about__prose" data-reveal>
            <p>
              I don&apos;t build &ldquo;just websites.&rdquo; I create digital experiences that reflect your
              brand at its best.
            </p>
            <p>
              I work closely with each project from start to finish — shaping the structure, refining the
              design, and building everything with precision. Every detail matters, from typography and
              layout to motion and performance.
            </p>
            <p className="about__prose-pull">
              My approach is simple: <strong>no detail is accidental.</strong>
            </p>
            <p>
              I design and develop each website from the ground up using modern technologies like React and
              Next.js, focusing on clean UI, smooth interactions, and fast, reliable performance.
            </p>
            <p>
              You work directly with me throughout the process — from the first idea to the final result.
              This allows me to stay focused on what matters most: delivering a website that feels right,
              looks premium, and works exactly as it should.
            </p>
            <p className="about__prose-closing">
              WebRunner is built around clarity, precision, and execution. Every project is crafted with
              care, attention to detail, and a clear goal — to create something that truly represents your
              brand.
            </p>
          </div>
          <aside className="about__aside" data-reveal>
            <div className="about__stats-row">
              <div className="about__stat">
                <span className="about__stat-num">
                  5<span className="about__stat-plus">+</span>
                </span>
                <span className="about__stat-label">Years crafting interfaces</span>
              </div>
              <div className="about__stat-divider" aria-hidden />
              <div className="about__stat">
                <span className="about__stat-num about__stat-num--symbol">∞</span>
                <span className="about__stat-label">Attention to the last pixel</span>
              </div>
            </div>
            <blockquote className="about__quote">
              <span className="about__quote-mark" aria-hidden>
                &ldquo;
              </span>
              <p className="about__quote-text">
                Trust is designed in the details — load time, copy rhythm, and calm interactions.
              </p>
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  )
}
