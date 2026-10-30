import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const OfferModalContext = createContext(null)

export function OfferModalProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openOffer = useCallback(() => setOpen(true), [])
  const closeOffer = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openOffer, closeOffer, setOpen }),
    [open, openOffer, closeOffer],
  )

  return <OfferModalContext.Provider value={value}>{children}</OfferModalContext.Provider>
}

export function useOfferModal() {
  const ctx = useContext(OfferModalContext)
  if (!ctx) {
    throw new Error('useOfferModal must be used within OfferModalProvider')
  }
  return ctx
}
