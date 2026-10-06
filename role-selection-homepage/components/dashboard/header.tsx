"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Building2, Users, CheckSquare, Home, Sparkles, FileText, LogOut, Rocket, LayoutGrid, PanelRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
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
import { GlobalSearch } from "@/components/dashboard/global-search"
import { QuickAddModal } from "@/components/startup/quick-add-modal"
import { AddEditInvestorModal } from "@/components/investor/add-edit-investor-modal"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { useAppChrome } from "@/components/dashboard/app-chrome-context"
import { useSidebarNav } from "@/components/dashboard/mobile-nav-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  title?: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  persist?: boolean
}

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

export function DashboardHeader({ persist }: HeaderProps) {
  const inAppChrome = useAppChrome()
  const { toggleSidebar, isSidebarOpen } = useSidebarNav()
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [addInvestorOpen, setAddInvestorOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const { user, logout } = useAuth()
  
  const getUserInitials = () => {
    if (!user?.name) return "U"
    const names = user.name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  const currentRoleConfig = user?.activeRole 
    ? roleConfig[user.activeRole] 
    : roleConfig["investment-banker"]

  if (inAppChrome && !persist) return null

  return (
    <>
      <TooltipProvider>
        <header className="flex items-center justify-between h-[43px] px-1 min-[756px]:px-3 py-2 border-b border-border bg-background shrink-0">
          <div className="flex items-center space-x-0.5 min-[756px]:space-x-2 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  aria-expanded={isSidebarOpen}
                >
                  <PanelRight className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand And Collapsible SideBar</TooltipContent>
            </Tooltip>

            <Link
              href="/role-selection"
              className="flex items-center gap-2 min-w-0"
              aria-label="Go to apps"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-md shrink-0">
                <span className="text-primary-foreground font-semibold text-[11px]">V</span>
              </div>
              <span className="hidden min-[400px]:inline text-sm font-semibold text-foreground truncate">Volery</span>
            </Link>

            <div className="h-6 w-[2px] bg-border mx-2 hidden min-[756px]:block ml-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/role-selection"
                  className="flex items-center gap-1.5 px-2.5 h-8 rounded-md text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-medium hidden min-[756px]:inline">Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to Home</TooltipContent>
            </Tooltip>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden min-[1024px]:flex items-center gap-2 h-7 max-w-xs flex-1 mx-4 px-2 rounded-[5px] border border-border bg-transparent text-muted-foreground hover:text-foreground text-left text-xs"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate">{currentRoleConfig.searchPlaceholder}</span>
          </button>

          <div className="flex items-center space-x-0.5 min-[756px]:space-x-2 ml-auto min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 gap-1.5 px-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden min-[1024px]:inline text-xs">Add</span>
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

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 min-[1024px]:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-foreground" />
            </Button>

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

            <NotificationCenter />

            <div className="hidden min-[480px]:contents">
              <ThemeToggleSimple />
              <ThemeSettingsDropdown />
            </div>

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
      </TooltipProvider>

      <GlobalSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        searchPlaceholder={currentRoleConfig.searchPlaceholder}
      />

      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      <AddEditInvestorModal open={addInvestorOpen} onOpenChange={setAddInvestorOpen} mode="add" />

      <CreateTaskModal open={createTaskOpen} onOpenChange={setCreateTaskOpen} />

      <AIAssistant isOpen={aiMode} onClose={() => setAiMode(false)} />
    </>
  )
}
