"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Circle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  getModuleRailMeta,
  getRoleModules,
  type AppMenu,
  type AppSubMenu,
} from "@/TenantsComponents/Volery/appModules"
import { Input } from "@/ShadcnComponents/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ShadcnComponents/ui/sheet"
import { useMobileNav } from "@/components/dashboard/mobile-nav-context"
import {
  exactMatchPaths,
  expandedMenusForPath,
  findModuleForPath,
  isPathActive,
  pathOnly,
} from "@/components/dashboard/nav-utils"

export function MobileMenu() {
  const pathname = usePathname()
  const { open, setOpen } = useMobileNav()
  const { user } = useAuth()
  const modules = useMemo(
    () => getRoleModules(user?.activeRole || "investment-banker"),
    [user?.activeRole]
  )
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const match = findModuleForPath(modules, pathname)
    if (match) setActiveModuleId(match.id)
    setExpandedMenus((prev) => [...new Set([...prev, ...expandedMenusForPath(modules, pathname)])])
  }, [pathname, modules])

  useEffect(() => {
    if (!open) setSearchTerm("")
  }, [open])

  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0]

  const filteredMenus = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q || !activeModule) return activeModule?.menus ?? []
    return activeModule.menus.filter((menu) => {
      const menuMatch = menu.name.toLowerCase().includes(q)
      const subMatch = menu.subMenus?.some((sub) => sub.name.toLowerCase().includes(q))
      return menuMatch || subMatch
    })
  }, [activeModule, searchTerm])

  const close = () => setOpen(false)

  const renderSubMenu = (sub: AppSubMenu) => {
    const active = isPathActive(pathname, sub.href)
    return (
      <Link
        key={sub.id}
        href={sub.href}
        onClick={close}
        className={cn(
          "flex min-h-11 items-center rounded-md px-3 text-[13px]",
          active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-primary/5"
        )}
      >
        <Circle className="mr-2.5 h-2.5 w-2.5 shrink-0" />
        <span className="truncate">{sub.name}</span>
      </Link>
    )
  }

  const renderMenu = (menu: AppMenu) => {
    const hasSubMenus = Boolean(menu.subMenus?.length)
    const expanded = expandedMenus.includes(menu.id)
    const subActive = Boolean(menu.subMenus?.some((sub) => isPathActive(pathname, sub.href)))
    const leafActive =
      !hasSubMenus && isPathActive(pathname, menu.href, exactMatchPaths.includes(pathOnly(menu.href)))
    const Icon = menu.icon

    const rowClass = cn(
      "flex min-h-11 w-full items-center rounded-md px-2 text-left",
      leafActive && "bg-primary text-primary-foreground",
      hasSubMenus && (expanded || subActive) && "bg-primary/10",
      !leafActive && "hover:bg-primary/5"
    )

    return (
      <div key={menu.id} className="mb-1">
        {hasSubMenus ? (
          <button
            type="button"
            onClick={() =>
              setExpandedMenus((prev) =>
                prev.includes(menu.id) ? prev.filter((id) => id !== menu.id) : [...prev, menu.id]
              )
            }
            className={rowClass}
          >
            <Icon className="mr-2.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-[13px]">{menu.name}</span>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <Link href={menu.href} onClick={close} className={rowClass}>
            <Icon className="mr-2.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-[13px]">{menu.name}</span>
          </Link>
        )}
        {hasSubMenus && expanded && menu.subMenus && (
          <div className="mt-1 ml-4 space-y-1">{menu.subMenus.map(renderSubMenu)}</div>
        )}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[360px]">
        <SheetHeader className="space-y-0 border-b px-4 py-3 pr-12 text-left">
          <SheetTitle className="text-[15px] font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b p-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menus..."
                className="h-9 pl-8"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-b px-2 py-2">
            {modules.map((module) => {
              const meta = getModuleRailMeta(module)
              const Icon = meta.icon
              const isActive = activeModule?.id === module.id
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModuleId(module.id)}
                  className={cn(
                    "flex h-[58px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-md px-1",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/5 text-foreground hover:bg-primary/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="line-clamp-2 text-center text-[9.5px] leading-tight">{meta.label}</span>
                </button>
              )
            })}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {filteredMenus.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No Menu Screens Found</p>
            ) : (
              filteredMenus.map(renderMenu)
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
