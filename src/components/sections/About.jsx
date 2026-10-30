import { SectionHeader } from '../ui/SectionHeader'

export function About() {
  return (
    <section id="about" className="about section section--editorial" aria-labelledby="about-heading" data-reveal-section>
      <div className="section__container">
        <SectionHeader
          titleId="about-heading"
          eyebrow="About"
          title="Design with intent. Build with precision."
          subtitle="A Cyprus studio crafting premium, SEO-ready websites and apps for local brands and international clients."
        />
        <div className="about__editorial" data-reveal>
          <p className="about__lede">
            Based in Cyprus, I don&apos;t build &ldquo;just websites.&rdquo; I create digital experiences
            that reflect your brand at its best — from Limassol and Nicosia to clients worldwide.
          </p>
          <p>
            You work directly with me from first idea to final ship — structure, design, and engineering
            with modern React and Next.js, focused on clean UI, calm motion, and reliable performance.
          </p>
          <p className="about__pull">
            No detail is accidental.
          </p>
        </div>
      </div>
    </section>
  )
}
