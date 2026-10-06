"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { getModuleRailMeta, getRoleModules } from "@/TenantsComponents/Volery/appModules"
import { useMobileNav } from "@/components/dashboard/mobile-nav-context"
import { findModuleForPath, firstHref, getBottomNavModules } from "@/components/dashboard/nav-utils"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { setOpen } = useMobileNav()
  const modules = getRoleModules(user?.activeRole || "investment-banker")
  const items = getBottomNavModules(modules)
  const activeModule = findModuleForPath(modules, pathname)

  return (
    <nav
      className="safe-area-pb fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background px-1 md:hidden"
      aria-label="Mobile navigation"
    >
      {items.map((module) => {
        const meta = getModuleRailMeta(module)
        const Icon = meta.icon
        const href = firstHref(module)
        const isActive = activeModule?.id === module.id
        return (
          <Link
            key={module.id}
            href={href}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate px-0.5 text-center text-[10px] font-medium">{meta.label}</span>
          </Link>
        )
      })}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </nav>
  )
}
