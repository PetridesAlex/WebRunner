import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../data/site'
import { TelegramIcon } from '../icons/TelegramIcon'
import { WhatsAppIcon } from '../icons/WhatsAppIcon'
import { InstagramIcon } from '../icons/InstagramIcon'

const telegram = site.messengerLinks.find((m) => m.id === 'telegram')
const whatsapp = site.messengerLinks.find((m) => m.id === 'whatsapp')
const instagram = site.messengerLinks.find((m) => m.id === 'instagram')

const items = [
  telegram?.href
    ? {
        id: 'telegram',
        href: telegram.href,
        label: 'Telegram',
        className: 'telegram-float--telegram',
        icon: <TelegramIcon branded size={28} className="telegram-float__icon" />,
        float: { y: [0, -7, 0], duration: 2.6, delay: 0 },
      }
    : null,
  whatsapp?.href
    ? {
        id: 'whatsapp',
        href: whatsapp.href,
        label: 'WhatsApp',
        className: 'telegram-float--whatsapp',
        icon: <WhatsAppIcon branded size={28} className="telegram-float__icon" />,
        wrapClass: 'telegram-float__icon-wrap--whatsapp',
        float: { y: [0, -9, 0], duration: 3.1, delay: 0.45 },
      }
    : null,
  instagram?.href
    ? {
        id: 'instagram',
        href: instagram.href,
        label: 'Instagram',
        className: 'telegram-float--instagram',
        icon: <InstagramIcon branded size={26} className="telegram-float__icon" />,
        wrapClass: 'telegram-float__icon-wrap--instagram',
        float: { y: [0, -6, 0], duration: 2.85, delay: 0.9 },
      }
    : null,
].filter(Boolean)

/** Always-visible messenger row — Telegram, WhatsApp, Instagram. */
export function TelegramFloat() {
  const reduceMotion = useReducedMotion()

  if (items.length === 0) return null

  return (
    <motion.div
      className="messenger-floats"
      role="navigation"
      aria-label="Direct messages"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      {items.map((item, index) => (
        <motion.a
          key={item.id}
          href={item.href}
          className={`telegram-float telegram-float--icon ${item.className}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.72, y: 18 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1, y: 0 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: item.float.y,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : {
                  opacity: { duration: 0.4, delay: 0.45 + index * 0.12 },
                  scale: {
                    type: 'spring',
                    stiffness: 420,
                    damping: 22,
                    delay: 0.45 + index * 0.12,
                  },
                  y: {
                    duration: item.float.duration,
                    delay: 0.7 + item.float.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
          }
          whileHover={
            reduceMotion
              ? undefined
              : {
                  scale: 1.12,
                  y: -10,
                  transition: { type: 'spring', stiffness: 480, damping: 18 },
                }
          }
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        >
          <span className="telegram-float__pulse" aria-hidden="true" />
          <span className={`telegram-float__icon-wrap ${item.wrapClass || ''}`.trim()}>
            {item.icon}
          </span>
        </motion.a>
      ))}
    </motion.div>
  )
}
