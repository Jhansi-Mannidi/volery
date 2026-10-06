"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

type SidebarNavContextValue = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarNavContext = createContext<SidebarNavContextValue | null>(null)

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile()
  const [desktopPanelOpen, setDesktopPanelOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setMobileDrawerOpen(false)
    } else {
      setDesktopPanelOpen(true)
    }
  }, [isMobile])

  const isSidebarOpen = isMobile ? mobileDrawerOpen : desktopPanelOpen

  const setIsSidebarOpen = useCallback(
    (open: boolean) => {
      if (isMobile) setMobileDrawerOpen(open)
      else setDesktopPanelOpen(open)
    },
    [isMobile]
  )

  const toggleSidebar = useCallback(() => {
    if (isMobile) setMobileDrawerOpen((open) => !open)
    else setDesktopPanelOpen((open) => !open)
  }, [isMobile])

  const value = useMemo(
    () => ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobile }),
    [isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobile]
  )

  return <SidebarNavContext.Provider value={value}>{children}</SidebarNavContext.Provider>
}

export function useSidebarNav() {
  const context = useContext(SidebarNavContext)
  if (!context) {
    return {
      isSidebarOpen: false,
      setIsSidebarOpen: () => {},
      toggleSidebar: () => {},
      isMobile: false,
    }
  }
  return context
}

export function useMobileNav() {
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobile } = useSidebarNav()
  return {
    open: isSidebarOpen,
    setOpen: setIsSidebarOpen,
    toggle: toggleSidebar,
    isMobile,
  }
}
