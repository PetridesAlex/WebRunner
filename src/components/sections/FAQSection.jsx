import { faqItems } from '../../data/faq'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

export function FAQSection() {
  return (
    <section id="faq" className="faq section" aria-labelledby="faq-heading" data-reveal-section>
      <div className="faq__bg" aria-hidden />
      <div className="section__container faq__container">
        <SectionHeader
          titleId="faq-heading"
          eyebrow="FAQ"
          title="Answers, clearly stated."
          subtitle="Straight talk on how we work, what you get, and how we keep your site fast, findable, and easy to own."
        />

        <div className="faq__list">
          {faqItems.map((item) => (
            <details
              key={item.id}
              name="webrunner-faq"
              className="faq-item"
              data-reveal
            >
              <summary className="faq-item__summary">
                <span className="faq-item__question">{item.question}</span>
                <span className="faq-item__icon-wrap" aria-hidden>
                  <span className="faq-item__icon">
                    <span className="faq-item__icon-bar faq-item__icon-bar--h" />
                    <span className="faq-item__icon-bar faq-item__icon-bar--v" />
                  </span>
                </span>
              </summary>
              <div className="faq-item__panel-inner">
                <p className="faq-item__answer">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <footer className="faq__cta" data-reveal>
          <p className="faq__cta-text">Still have questions? Let’s talk.</p>
          <Button href="#contact" className="faq__cta-btn btn--sm">
            Contact Us
          </Button>
        </footer>
      </div>
    </section>
  )
}
