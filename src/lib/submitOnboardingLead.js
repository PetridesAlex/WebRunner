import { formatOnboardingSummary } from '../data/onboarding'
import { site } from '../data/site'

const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`

/**
 * Sends onboarding quiz answers + contact details to the agency inbox via FormSubmit (same as contact form).
 */
export async function submitOnboardingLead({ answers, name, phone, email }) {
  const summary = formatOnboardingSummary({ ...answers })
  const pageUrl = `${site.canonicalUrl}/`
  const message = [
    'New lead from the website onboarding experience.',
    '',
    '— Contact (from onboarding form) —',
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : 'Email: (not provided)',
    '',
    '— What they selected —',
    summary || '(no preferences captured)',
  ].join('\n')

  const replyEmail = email?.trim() || site.email

  const res = await fetch(formSubmitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email: replyEmail,
      phone: phone || '—',
      message,
      Website: `${site.agencyName} · Onboarding quiz`,
      _subject: `${site.agencyName} · Onboarding lead — ${name}`,
      _template: 'box',
      _replyto: replyEmail,
      _url: pageUrl,
      _gotcha: '',
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok || data.success === false) {
    throw new Error(
      typeof data.message === 'string' ? data.message : 'Could not send your details. Please try again.',
    )
  }
}
