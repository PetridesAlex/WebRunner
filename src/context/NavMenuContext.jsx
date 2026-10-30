import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NavMenuContext = createContext(null)

export function NavMenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [])

  const value = useMemo(
    () => ({ menuOpen, setMenuOpen, openMenu, closeMenu, toggleMenu }),
    [menuOpen, openMenu, closeMenu, toggleMenu],
  )

  return <NavMenuContext.Provider value={value}>{children}</NavMenuContext.Provider>
}

export function useNavMenu() {
  const ctx = useContext(NavMenuContext)
  if (!ctx) {
    throw new Error('useNavMenu must be used within NavMenuProvider')
  }
  return ctx
}
