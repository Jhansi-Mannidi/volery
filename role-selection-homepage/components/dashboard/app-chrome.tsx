"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppChromeContext } from "@/components/dashboard/app-chrome-context"
import { MobileNavProvider } from "@/components/dashboard/mobile-nav-context"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

const CHROMELESS_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/privacy-policy",
  "/role-selection",
  "/home",
]

const CHROMELESS_PREFIXES = ["/onboarding"]

function shouldHideChrome(pathname: string, hasActiveRole: boolean) {
  if (!hasActiveRole) return true
  if (CHROMELESS_ROUTES.includes(pathname)) return true
  return CHROMELESS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const hideChrome = shouldHideChrome(pathname, Boolean(user?.activeRole))

  if (hideChrome) {
    return <AppChromeContext.Provider value={false}>{children}</AppChromeContext.Provider>
  }

  return (
    <AppChromeContext.Provider value={true}>
      <MobileNavProvider>
        <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
          <DashboardHeader persist title="" />
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <DashboardSidebar persist />
            <main className="volery-shell-main min-h-0 flex-1 overflow-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </MobileNavProvider>
    </AppChromeContext.Provider>
  )
}
