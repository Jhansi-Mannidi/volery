"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Building2, Users, CheckSquare, Menu, Home, Compass, Bell, Sparkles, FileText, LogOut, ChevronDown, Briefcase, User, Rocket, BarChart3, Factory, Building, Check, Settings, LayoutGrid } from "lucide-react"
import { useAuth, AVAILABLE_ROLES, type UserRole } from "@/lib/auth-context"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { ThemeSettingsDropdown } from "@/components/theme-settings-dropdown"
import { ThemeToggleSimple } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { CreateTaskModal } from "@/components/tasks/create-task-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { QuickAddModal } from "@/components/startup/quick-add-modal"
import { AddEditInvestorModal } from "@/components/investor/add-edit-investor-modal"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { getRoleNavigation } from "@/lib/navigation"
import { MobileMenu } from "@/components/dashboard/mobile-menu"
import { useAppChrome } from "@/components/dashboard/app-chrome-context"

interface BreadcrumbItemType {
  label: string
  href?: string
}

interface HeaderProps {
  title?: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItemType[]
  persist?: boolean
}

// Icon map for role icons
const roleIconMap: Record<string, React.ElementType> = {
  Building2,
  Briefcase,
  User,
  Rocket,
  BarChart3,
  Factory,
}

// Role-specific configuration including add menu items
interface AddMenuItem {
  label: string
  icon: React.ElementType
  action: "quick-add" | "add-investor" | "create-task" | "generate-match" | "upload-document"
}

const roleConfig: Record<string, { 
  homeUrl: string
  searchPlaceholder: string
  searchScopes: string[]
  badgeColor: string
  shortLabel: string
  addMenuItems: AddMenuItem[]
}> = {
  "investment-banker": {
    homeUrl: "/",
    searchPlaceholder: "Search startups, investors, documents...",
    searchScopes: ["startups", "investors", "documents", "deals"],
    badgeColor: "bg-primary/10 text-primary",
    shortLabel: "Banker",
    addMenuItems: [
      { label: "Add Startup", icon: Building2, action: "quick-add" },
      { label: "Add Investor", icon: Users, action: "add-investor" },
      { label: "Generate Match", icon: Sparkles, action: "generate-match" },
      { label: "Upload Document", icon: FileText, action: "upload-document" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
  "institutional-investor": {
    homeUrl: "/",
    searchPlaceholder: "Search startups, portfolio, documents...",
    searchScopes: ["startups", "portfolio", "documents"],
    badgeColor: "bg-primary/10 text-primary",
    shortLabel: "Investor",
    addMenuItems: [
      { label: "Add to Portfolio", icon: Building2, action: "quick-add" },
      { label: "Generate Match", icon: Sparkles, action: "generate-match" },
      { label: "Upload Document", icon: FileText, action: "upload-document" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
  "angel-investor": {
    homeUrl: "/",
    searchPlaceholder: "Search startups, syndicates, portfolio...",
    searchScopes: ["startups", "syndicates", "portfolio"],
    badgeColor: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
    shortLabel: "Angel",
    addMenuItems: [
      { label: "Join Syndicate", icon: Users, action: "add-investor" },
      { label: "Add to Portfolio", icon: Building2, action: "quick-add" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
  "startup-founder": {
    homeUrl: "/",
    searchPlaceholder: "Search investors, documents, my raises...",
    searchScopes: ["investors", "documents", "raises"],
    badgeColor: "bg-primary/10 text-primary",
    shortLabel: "Founder",
    addMenuItems: [
      { label: "Create Campaign", icon: Rocket, action: "quick-add" },
      { label: "Upload Pitch Deck", icon: FileText, action: "upload-document" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
  "research-analyst": {
    homeUrl: "/",
    searchPlaceholder: "Search reports, startups, market data...",
    searchScopes: ["reports", "startups", "market-data"],
    badgeColor: "bg-primary/10 text-primary",
    shortLabel: "Analyst",
    addMenuItems: [
      { label: "Generate Report", icon: FileText, action: "upload-document" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
  "corporate-development": {
    homeUrl: "/",
    searchPlaceholder: "Search targets, deals, M&A pipeline...",
    searchScopes: ["targets", "deals", "pipeline"],
    badgeColor: "bg-primary/10 text-primary",
    shortLabel: "Corp Dev",
    addMenuItems: [
      { label: "Add Target", icon: Building2, action: "quick-add" },
      { label: "Upload Document", icon: FileText, action: "upload-document" },
      { label: "Add Task", icon: CheckSquare, action: "create-task" }
    ]
  },
}

export function DashboardHeader({ title, subtitle, breadcrumbs, persist }: HeaderProps) {
  const inAppChrome = useAppChrome()
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [addInvestorOpen, setAddInvestorOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const { user, logout, setActiveRole } = useAuth()
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U"
    const names = user.name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  // Get active role info
  const activeRoleInfo = user?.activeRole 
    ? AVAILABLE_ROLES.find(r => r.id === user.activeRole)
    : null

  // Get role config for current role
  const currentRoleConfig = user?.activeRole 
    ? roleConfig[user.activeRole] 
    : roleConfig["investment-banker"]

  // Get available roles for the user
  const userRoles = user?.roles?.map(roleId => 
    AVAILABLE_ROLES.find(r => r.id === roleId)
  ).filter(Boolean) || []

  const hasMultipleRoles = userRoles.length > 1
  const hasRole = userRoles.length > 0

  if (inAppChrome && !persist) return null

  return (
    <>
      {/* Desktop Header — platform chrome (43px) */}
      <header className="hidden md:flex items-center justify-between h-[43px] px-3 py-2 border-b border-border bg-background">
        <div className="flex items-center space-x-2 min-w-0">
          <Link
            href="/role-selection"
            className="flex items-center gap-2"
            aria-label="Go to apps"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-md shrink-0">
              <span className="text-primary-foreground font-semibold text-[11px]">V</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Volery</span>
          </Link>
          <div className="h-6 w-[2px] bg-border mx-2 hidden md:block ml-6" />
          <Link
            href="/role-selection"
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-md text-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium hidden lg:inline">Home</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden lg:flex items-center gap-2 h-7 max-w-xs flex-1 mx-4 px-2 rounded-[5px] border border-border bg-transparent text-muted-foreground hover:text-foreground text-left text-xs"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 truncate">{currentRoleConfig.searchPlaceholder}</span>
        </button>

        <div className="flex items-center space-x-2 ml-auto">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 gap-1.5 px-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline text-xs">Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {currentRoleConfig.addMenuItems.map((item, index) => {
                  const IconComponent = item.icon
                  const isLastItem = index === currentRoleConfig.addMenuItems.length - 1
                  
                  return (
                    <div key={item.action}>
                      <DropdownMenuItem 
                        onClick={() => {
                          if (item.action === "quick-add") setQuickAddOpen(true)
                          else if (item.action === "add-investor") setAddInvestorOpen(true)
                          else if (item.action === "create-task") setCreateTaskOpen(true)
                        }}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                      {!isLastItem && ["quick-add", "add-investor", "generate-match", "upload-document"].includes(item.action) && 
                       index < currentRoleConfig.addMenuItems.length - 2 && item.action !== currentRoleConfig.addMenuItems[index + 1]?.action && (
                        <DropdownMenuSeparator />
                      )}
                    </div>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/role-selection" aria-label="Apps">
                <LayoutGrid className="h-4 w-4 text-foreground" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAiMode(true)}
              aria-label="AI assistant"
            >
              <Sparkles className="h-4 w-4 text-foreground" />
            </Button>

            {/* Notifications */}
            <NotificationCenter />

            <ThemeToggleSimple />

            {/* Theme Settings (NEW) */}
            <ThemeSettingsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-0.5 rounded-full hover:bg-muted transition-colors">
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[11px] font-medium text-primary-foreground">{getUserInitials()}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Team Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between h-[43px] px-3 border-b border-border bg-background">
        <Link
          href="/role-selection"
          className="flex items-center gap-3 rounded-lg transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Go to role selection"
        >
          <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-md">
            <span className="text-primary-foreground font-semibold text-[11px]">V</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Volery</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="w-5 h-5" />
          </Button>
          <ThemeSettingsDropdown />
          <NotificationCenter />
        </div>
      </header>

      {/* Mobile Bottom Navigation - Angel-specific vs default */}
      {user?.activeRole === "angel-investor" ? (
        <AngelBottomNav />
      ) : (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-4 z-50">
          <Link href="/" className="flex flex-col items-center gap-1 text-primary">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/startups" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium">Pipeline</span>
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <Link
            href="/activity"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 right-1 w-4 h-4 bg-destructive text-[10px] font-medium text-destructive-foreground rounded-full flex items-center justify-center">
              5
            </span>
            <span className="text-[10px] font-medium">Alerts</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <div className="text-sm text-muted-foreground">
                  Mobile navigation content
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      )}

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48 mb-2">
            {currentRoleConfig.addMenuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <DropdownMenuItem 
                  key={item.action}
                  onClick={() => {
                    if (item.action === "quick-add") setQuickAddOpen(true)
                    else if (item.action === "add-investor") setAddInvestorOpen(true)
                    else if (item.action === "create-task") setCreateTaskOpen(true)
                  }}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        searchPlaceholder={currentRoleConfig.searchPlaceholder}
      />

      {/* Quick Add Startup Modal */}
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      {/* Add Investor Modal */}
      <AddEditInvestorModal open={addInvestorOpen} onOpenChange={setAddInvestorOpen} mode="add" />

      {/* Create Task Modal */}
      <CreateTaskModal open={createTaskOpen} onOpenChange={setCreateTaskOpen} />

      {/* AI Assistant */}
      <AIAssistant isOpen={aiMode} onClose={() => setAiMode(false)} />
    </>
  )
}
