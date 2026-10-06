"use client"

import React, { createContext, useContext, useMemo, useState } from "react"

type MobileNavContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null)

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open, setOpen }), [open])
  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>
}

export function useMobileNav() {
  const context = useContext(MobileNavContext)
  if (!context) {
    return {
      open: false,
      setOpen: () => {},
    }
  }
  return context
}
