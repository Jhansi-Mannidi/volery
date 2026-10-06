"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, Circle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"
import {
  getModuleRailMeta,
  getRoleModules,
  type AppMenu,
  type AppModule,
  type AppSubMenu,
} from "@/TenantsComponents/Volery/appModules"
import { useAppChrome } from "@/components/dashboard/app-chrome-context"
import { useSidebarNav } from "@/components/dashboard/mobile-nav-context"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  exactMatchPaths,
  expandedMenusForPath,
  findModuleForPath,
  firstHref,
  isPathActive,
  pathOnly,
} from "@/components/dashboard/nav-utils"

type SidebarProps = {
  role?: UserRole
  userRole?: UserRole
  persist?: boolean
}

export function DashboardSidebar({ role, userRole, persist }: SidebarProps = {}) {
  const inAppChrome = useAppChrome()
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = useSidebarNav()
  const currentRole = role || userRole || user?.activeRole || "investment-banker"
  const modules = useMemo(() => getRoleModules(currentRole), [currentRole])

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarWidth, setSidebarWidth] = useState(225)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(225)
  const resizing = useRef(false)
  const pendingModuleId = useRef<string | null>(null)

  useEffect(() => {
    const match = findModuleForPath(modules, pathname)
    if (pendingModuleId.current) {
      if (match?.id === pendingModuleId.current) {
        pendingModuleId.current = null
      } else {
        return
      }
    }
    if (match) setActiveModuleId(match.id)
  }, [pathname, modules])

  useEffect(() => {
    const menusToOpen = expandedMenusForPath(modules, pathname)
    if (menusToOpen.length) {
      setExpandedMenus((prev) => [...new Set([...prev, ...menusToOpen])])
    }
  }, [pathname, modules])

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobile, isSidebarOpen])

  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0]
  const showMenuPanel = Boolean(activeModule) && (isMobile || isSidebarOpen)

  const filteredMenus = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q || !activeModule) return activeModule?.menus ?? []
    return activeModule.menus.filter((menu) => {
      const menuMatch = menu.name.toLowerCase().includes(q)
      const subMatch = menu.subMenus?.some((sub) => sub.name.toLowerCase().includes(q))
      return menuMatch || subMatch
    })
  }, [activeModule, searchTerm])

  const closeMobileDrawer = () => {
    if (isMobile) setIsSidebarOpen(false)
  }

  const selectModule = (module: AppModule) => {
    pendingModuleId.current = module.id
    setActiveModuleId(module.id)
    if (!isMobile) setIsSidebarOpen(true)
    setSearchTerm("")
    const href = firstHref(module)
    if (pathOnly(href) !== pathname) {
      router.push(href)
    }
  }

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    )
  }

  const onResizeStart = (e: React.MouseEvent) => {
    if (isMobile) return
    e.preventDefault()
    resizing.current = true
    dragStartX.current = e.clientX
    dragStartWidth.current = sidebarWidth
    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      setSidebarWidth(Math.min(400, Math.max(180, dragStartWidth.current + (ev.clientX - dragStartX.current))))
    }
    const onUp = () => {
      resizing.current = false
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }

  if (inAppChrome && !persist) return null

  const renderSubMenu = (sub: AppSubMenu) => {
    const active = isPathActive(pathname, sub.href)
    return (
      <Link
        key={sub.id}
        href={sub.href}
        onClick={closeMobileDrawer}
        data-active={active ? "true" : "false"}
        className={cn(
          "flex items-center px-3 rounded-md h-[34px] text-[12.5px] transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-primary/5 text-foreground"
        )}
      >
        <Circle className="h-2.5 w-2.5 mr-2.5 shrink-0" />
        <span className="flex-1 min-w-0 truncate" title={sub.name}>
          {sub.name}
        </span>
      </Link>
    )
  }

  const renderMenu = (menu: AppMenu) => {
    const hasSubMenus = Boolean(menu.subMenus?.length)
    const expanded = expandedMenus.includes(menu.id)
    const subActive = Boolean(menu.subMenus?.some((sub) => isPathActive(pathname, sub.href)))
    const leafActive = !hasSubMenus && isPathActive(pathname, menu.href, exactMatchPaths.includes(pathOnly(menu.href)))
    const Icon = menu.icon

    const rowClass = cn(
      "flex items-center px-2 py-1.5 rounded-md h-[34px] cursor-pointer",
      leafActive && "bg-primary text-primary-foreground",
      hasSubMenus && (expanded || subActive) && "bg-primary/10",
      !leafActive && "hover:bg-primary/5"
    )

    const rowInner = (
      <>
        <Icon className="h-[13px] w-[13px] mr-2.5 shrink-0" />
        <span className="flex-1 min-w-0 truncate text-[13px]" title={menu.name}>
          {menu.name}
        </span>
        {menu.badge && !hasSubMenus && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0 rounded-full mr-1",
              leafActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
            )}
          >
            {menu.badge}
          </span>
        )}
        {hasSubMenus && (
          <span className="ml-1 mr-0.5 text-muted-foreground">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
      </>
    )

    return (
      <div key={menu.id} className="mb-1">
        {hasSubMenus ? (
          <button type="button" onClick={() => toggleMenu(menu.id)} className={cn(rowClass, "w-full text-left")}>
            {rowInner}
          </button>
        ) : (
          <Link href={menu.href} onClick={closeMobileDrawer} data-active={leafActive ? "true" : "false"} className={rowClass}>
            {rowInner}
          </Link>
        )}
        {hasSubMenus && expanded && menu.subMenus && (
          <div className="ml-4 mt-1 space-y-1">
            {menu.subMenus
              .filter((sub) => {
                const q = searchTerm.trim().toLowerCase()
                if (!q) return true
                return menu.name.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q)
              })
              .map(renderSubMenu)}
          </div>
        )}
      </div>
    )
  }

  const renderCascadingNav = () => (
    <>
      <div className="flex flex-col items-center bg-background border-r px-2 py-2 w-[80px] gap-1 overflow-y-auto overflow-x-hidden shrink-0">
        {modules.map((module) => {
          const meta = getModuleRailMeta(module)
          const Icon = meta.icon
          const isActive = activeModule?.id === module.id
          return (
            <Tooltip key={module.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => selectModule(module)}
                  title={meta.label}
                  className={cn(
                    "flex flex-col items-center justify-center w-[64px] h-[62px] rounded-[6px] transition-colors gap-1 px-1 shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 bg-primary/5 text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span
                    className={cn(
                      "text-[9.5px] font-normal leading-[1.15] text-center break-words max-w-full line-clamp-2",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {meta.label}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{meta.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {showMenuPanel && activeModule && (
        <div
          className="flex flex-col h-full bg-background border-r relative"
          style={{ width: isMobile ? 225 : sidebarWidth }}
        >
          <div className="p-2 border-b bg-background">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 bg-background min-h-0">
            {filteredMenus.length === 0 ? (
              <div className="flex justify-center text-muted-foreground text-sm p-8">
                No Menu Screens Found
              </div>
            ) : (
              filteredMenus.map(renderMenu)
            )}
          </div>

          {!isMobile && (
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-border"
              onMouseDown={onResizeStart}
            />
          )}
        </div>
      )}
    </>
  )

  return (
    <TooltipProvider>
      <div className="hidden h-full bg-background min-[756px]:flex">{renderCascadingNav()}</div>

      {isMobile && isSidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[43px] z-40 bg-black/40"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed top-[43px] bottom-0 left-0 z-50 flex bg-background shadow-xl">
            {renderCascadingNav()}
          </div>
        </>
      )}
    </TooltipProvider>
  )
}
