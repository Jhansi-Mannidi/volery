"use client"

import Link from "next/link"
import { Home, LayoutGrid, LogOutIcon, Palette } from "lucide-react"
import { Button } from "@/ShadcnComponents/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ShadcnComponents/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ShadcnComponents/ui/dropdown-menu"
import { ThemeSettingsDropdown } from "@/components/theme-settings-dropdown"
import { ThemeToggleSimple } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import CompanyLogo from "@/ReusableComponents/CompanyLogo/CompanyLogo"

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  return (
    <TooltipProvider>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-[43px] items-center justify-between border-b bg-background px-1 py-2 min-[756px]:px-3">
        <div className="flex items-center space-x-2">
          <Link href="/role-selection" className="flex items-center">
            <CompanyLogo className="h-[25px] gap-1.5 [&_span:first-child]:h-6 [&_span:first-child]:w-6 [&_span:first-child]:text-xs [&_span:last-child]:text-sm max-[399px]:[&_span:last-child]:hidden" />
          </Link>
          <div className="mx-2 ml-6 hidden h-6 w-[2px] bg-border md:block" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/role-selection">
                  <Home className="h-4 w-4" />
                  <span className="hidden text-sm font-medium min-[756px]:inline">Home</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go to Home</TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-auto flex items-center space-x-0.5 min-[756px]:space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <Link href="/role-selection" aria-label="Apps">
                  <LayoutGrid className="h-4 w-4 text-foreground" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Apps</TooltipContent>
          </Tooltip>
          <ThemeToggleSimple />
          <ThemeSettingsDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {initials}
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
                <Link href="/settings">
                  <Palette className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}

export default Header
