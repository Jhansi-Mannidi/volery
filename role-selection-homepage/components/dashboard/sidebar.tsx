"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Building2, ChevronDown, ChevronRight, Circle, LogOut, Search, Settings, User } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

function getInitials(name?: string) {
  if (!name) return "U"
  const names = name.split(" ")
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return names[0].substring(0, 2).toUpperCase()
}

export function DashboardSidebar({ role, userRole, persist }: SidebarProps = {}) {
  const inAppChrome = useAppChrome()
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
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

  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0]
  const mobilePanelOpen = isMobile && isSidebarOpen

  const filteredMenus = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q || !activeModule) return activeModule?.menus ?? []
    return activeModule.menus.filter((menu) => {
      const menuMatch = menu.name.toLowerCase().includes(q)
      const subMatch = menu.subMenus?.some((sub) => sub.name.toLowerCase().includes(q))
      return menuMatch || subMatch
    })
  }, [activeModule, searchTerm])

  const closeMobilePanel = () => {
    if (isMobile) setIsSidebarOpen(false)
  }

  const selectModule = (module: AppModule) => {
    pendingModuleId.current = module.id
    setActiveModuleId(module.id)
    setIsSidebarOpen(true)
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

  const initials = getInitials(user?.name)

  const profileMenu = (
    <DropdownMenuContent side="right" align="end" className="w-64">
      <div className="px-2 py-1.5">
        <p className="text-[13px] font-medium">{user?.name || "User"}</p>
        <p className="truncate text-[13px] text-muted-foreground">{user?.email || ""}</p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/profile" onClick={closeMobilePanel}>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/organization" onClick={closeMobilePanel}>
          <Building2 className="mr-2 h-4 w-4" />
          Organization Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/settings" onClick={closeMobilePanel}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  const renderSubMenu = (sub: AppSubMenu) => {
    const active = isPathActive(pathname, sub.href)
    return (
      <Link
        key={sub.id}
        href={sub.href}
        onClick={closeMobilePanel}
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
          <Link href={menu.href} onClick={closeMobilePanel} data-active={leafActive ? "true" : "false"} className={rowClass}>
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

  return (
    <TooltipProvider>
      <div className="relative flex h-full bg-background">
        <div className="flex h-full w-[80px] shrink-0 flex-col items-center border-r bg-background">
          <div className="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto overflow-x-hidden px-2 py-2">
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
                        "flex h-[62px] w-[64px] shrink-0 flex-col items-center justify-center gap-1 rounded-[6px] px-1 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/5 text-foreground hover:bg-primary/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span
                        className={cn(
                          "max-w-full break-words text-center text-[9.5px] font-normal leading-[1.15] line-clamp-2",
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

          <div className="flex w-full shrink-0 justify-center border-t border-border px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-[11px] font-medium text-primary-foreground ring-1 ring-border/60 hover:ring-primary/50"
                  aria-label="Account menu"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              {profileMenu}
            </DropdownMenu>
          </div>
        </div>

        {activeModule && (
          <>
            {mobilePanelOpen && (
              <button
                type="button"
                className="absolute inset-y-0 left-[80px] right-0 z-40 bg-black/40 min-[756px]:hidden"
                aria-label="Close navigation"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div
              data-open={mobilePanelOpen ? "true" : "false"}
              className={cn(
                "relative h-full flex-col border-r bg-background",
                "flex max-[755px]:hidden",
                !isSidebarOpen && !isMobile && "min-[756px]:hidden",
                "data-[open=true]:max-[755px]:flex data-[open=true]:max-[755px]:absolute data-[open=true]:max-[755px]:inset-y-0 data-[open=true]:max-[755px]:left-[80px] data-[open=true]:max-[755px]:z-50 data-[open=true]:max-[755px]:shadow-xl"
              )}
              style={{ width: isMobile ? 225 : sidebarWidth }}
            >
              <div className="shrink-0 border-b bg-background p-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="h-8 pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-background p-2">
                {filteredMenus.length === 0 ? (
                  <div className="flex justify-center p-8 text-sm text-muted-foreground">
                    No Menu Screens Found
                  </div>
                ) : (
                  filteredMenus.map(renderMenu)
                )}
              </div>

              <div className="w-full shrink-0 border-t border-border bg-background p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-muted/70"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-medium text-primary-foreground ring-1 ring-border/60">
                        {initials}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-[13px] font-medium text-foreground">
                          {user?.name || "User"}
                        </span>
                        <span className="block truncate text-[13px] text-muted-foreground">
                          {user?.email || ""}
                        </span>
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  {profileMenu}
                </DropdownMenu>
              </div>

              {!isMobile && (
                <div
                  className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-border"
                  onMouseDown={onResizeStart}
                />
              )}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
